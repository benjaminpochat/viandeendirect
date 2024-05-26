package eu.viandeendirect.domains.payment;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Account;
import com.stripe.model.AccountLink;
import com.stripe.model.Transfer;
import com.stripe.model.checkout.Session;
import com.stripe.param.AccountCreateParams;
import com.stripe.param.AccountLinkCreateParams;
import com.stripe.param.TransferCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import com.stripe.param.checkout.SessionCreateParams.LineItem;
import eu.viandeendirect.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

import static com.stripe.param.AccountLinkCreateParams.Type.ACCOUNT_ONBOARDING;

@Service
public class StripeService {

    private static final Logger LOGGER = LoggerFactory.getLogger(StripeService.class);

    @Value("${STRIPE_API_KEY:default_stripe_api_key_value}")
    public void setStripeApiKey(String stripeApiKey) {
        Stripe.apiKey = stripeApiKey;
    }

    @Value("${PRODUCER_FRONTEND_URL:http://localhost:3000}")
    String viandeendirectProducerFrontendUrl;

    @Autowired
    StripeAccountRepository stripeAccountRepository;

    public StripeAccount createStripeAccount(Producer producer) throws StripeException {
        Account account = Account.create(
                AccountCreateParams.builder()
                        .setType(AccountCreateParams.Type.STANDARD)
                        .setCapabilities(AccountCreateParams.Capabilities.builder()
                                .build())
                        .build()
        );
        StripeAccount stripeAccount = new StripeAccount();
        stripeAccount.setStripeId(account.getId());
        stripeAccount.setDetailsSubmitted(account.getDetailsSubmitted());
        return stripeAccountRepository.save(stripeAccount);
    }

    public void getStripeAccountStatus(StripeAccount stripeAccount) throws StripeException {
        Account.retrieve(stripeAccount.getStripeId());
    }

    public void loadStripeAccount(StripeAccount stripeAccount) throws StripeException {
        Account account = Account.retrieve(stripeAccount.getStripeId());
        AccountLink accountLink = AccountLink.create(
                AccountLinkCreateParams.builder()
                        .setAccount(stripeAccount.getStripeId())
                        .setReturnUrl(viandeendirectProducerFrontendUrl + "/account")
                        .setRefreshUrl(viandeendirectProducerFrontendUrl + "/account")
                        .setType(ACCOUNT_ONBOARDING)
                        .build()
        );
        stripeAccount.setDetailsSubmitted(account.getDetailsSubmitted());
        stripeAccount.setAccountLink(accountLink.getUrl());
    }

    /**
     * Create a Stripe payment following the Stripe pattern "separate charge and transfer"
     *
     * @param order
     * @return
     * @see <a href="https://docs.stripe.com/connect/separate-charges-and-transfers">Stripe doc</a>
     */
    public StripePayment createPayment(Order order) throws StripeException {
        SessionCreateParams.Builder builder = SessionCreateParams.builder();
        order.getItems().forEach(item -> builder.addLineItem(getLineItem(item)));
        SessionCreateParams params = builder
                .setPaymentIntentData(SessionCreateParams.PaymentIntentData.builder().setTransferGroup(order.getId().toString()).build())
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(viandeendirectProducerFrontendUrl + "/order/" + order.getId() + "/paymentSuccessful")
                .setCancelUrl(viandeendirectProducerFrontendUrl + "/order/" + order.getId() + "/paymentCancelled")
                .build();
        Session session = Session.create(params);
        StripePayment stripePayment = new StripePayment();
        stripePayment.setCheckoutSessionId(session.getId());
        stripePayment.setPaymentUrl(session.getUrl());
        return stripePayment;
    }

    private LineItem getLineItem(OrderItem orderItem) {
        return LineItem.builder().setPriceData(
                        LineItem.PriceData.builder()
                                .setCurrency("eur")
                                .setProductData(LineItem.PriceData.ProductData.builder()
                                        .setName(orderItem.getPackageLot().getLabel())
                                        .build()
                                )
                                .setUnitAmount(orderItem.getUnitPrice().longValue())
                                .build()
                )
                .setQuantity(orderItem.getQuantity().longValue())
                .build();
    }

    public void transferPaymentToProducers(Order order) {
        Map<Producer, PaymentTransferData> paymentTransferDatas = getPaymentTransferData(order);
        paymentTransferDatas.forEach((producer, paymentTransferData) -> transferPaymentToProducer(order, producer, paymentTransferData));
    }

    private void transferPaymentToProducer(Order order, Producer producer, PaymentTransferData paymentTransferData) {
        String customerLastName = order.getCustomer().getUser().getLastName();
        TransferCreateParams params = TransferCreateParams.builder()
                .setAmount(paymentTransferData.amount())
                .setCurrency("eur")
                .setDestination(producer.getStripeAccount().getStripeId())
                .setTransferGroup(order.getId().toString())
                .setDescription("commande " + customerLastName + " n° " + order.getId().toString() + " - " + paymentTransferData.description())
                .build();
        try {
            Transfer transfer = Transfer.create(params);
            LOGGER.info("the payment of {} for order {} has been transferred to producer {} with Strip transfer id {}", paymentTransferData.amount(), order.getId(), producer.getId(), transfer.getId());
        } catch (StripeException e) {
            LOGGER.error("the payment of {} cannot for order {} be transferred to producer {} has failed", paymentTransferData.amount(), order.getId(), producer.getId(), e);
            throw new RuntimeException(e);
        }
    }

    Map<Producer, PaymentTransferData> getPaymentTransferData(Order order) {
        return order.getItems().stream().map(item -> Map.entry(
                item.getPackageLot().getProduction().getProducer(),
                new PaymentTransferData(
                        item.getUnitPrice().longValue() * item.getQuantity().longValue(),
                        item.getPackageLot().getLabel() + " x" + item.getQuantity().toString())))
                .reduce(new HashMap<>(),
                        (map, entry) -> {
                            if (map.get(entry.getKey()) == null) {
                                map.put(entry.getKey(), entry.getValue());
                            } else {
                                map.compute(entry.getKey(), (key, existingValue) -> combine(existingValue, entry.getValue()));
                            }
                            return map;
                        },
                        (map1, map2) -> {
                            map2.keySet().forEach(producer -> {
                                if(map1.get(producer) == null) {
                                    map1.put(producer, map2.get(producer));
                                } else {
                                    map1.compute(producer, (key, existingValue) -> combine(existingValue, map2.get(key)));
                                }
                            });
                            return map1;
                        });
    }

    private PaymentTransferData combine(PaymentTransferData data1, PaymentTransferData data2) {
        var combinedAmount = data1.amount() + data2.amount();
        var combinedDescription = data1.description() + " - " + data2.description();
        return new PaymentTransferData(combinedAmount, combinedDescription);
    }

    record PaymentTransferData(Long amount, String description) {}
}
