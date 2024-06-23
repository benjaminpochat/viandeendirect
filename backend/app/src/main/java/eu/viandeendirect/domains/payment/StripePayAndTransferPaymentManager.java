package eu.viandeendirect.domains.payment;

import com.stripe.exception.StripeException;
import com.stripe.model.Transfer;
import com.stripe.model.checkout.Session;
import com.stripe.param.TransferCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import eu.viandeendirect.model.Order;
import eu.viandeendirect.model.OrderItem;
import eu.viandeendirect.model.Producer;
import eu.viandeendirect.model.StripePayment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * Manage Stripe payments following the Stripe pattern "separate charge and transfer".
 * To use when orders includes productions from different producers.
 *
 * @see <a href="https://docs.stripe.com/connect/separate-charges-and-transfers">Stripe doc</a>
 */
@Service
@Qualifier("StripePayAndTransferPaymentManager")
public class StripePayAndTransferPaymentManager implements StripePaymentManager{

    private static final Logger LOGGER = LoggerFactory.getLogger(StripePayAndTransferPaymentManager.class);

    @Value("${PRODUCER_FRONTEND_URL:http://localhost:3000}")
    String viandeendirectProducerFrontendUrl;


    @Override
    public StripePayment createPayment(Order order) throws StripeException {
        SessionCreateParams.Builder builder = SessionCreateParams.builder();
        order.getItems().forEach(item -> builder.addLineItem(getLineItem(item)));
        SessionCreateParams params = builder
                .setPaymentIntentData(SessionCreateParams.PaymentIntentData.builder().setTransferGroup(order.getId().toString()).build())
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(viandeendirectProducerFrontendUrl + "/orders/" + order.getId() + "/payment")
                .setCancelUrl(viandeendirectProducerFrontendUrl + "/orders/" + order.getId() + "/payment")
                .build();
        Session session = Session.create(params);
        StripePayment stripePayment = new StripePayment();
        stripePayment.setCheckoutSessionId(session.getId());
        stripePayment.setPaymentUrl(session.getUrl());
        return stripePayment;
    }

    @Override
    public void processPaymentValidation(Order order) {
        LOGGER.debug("processing payment validation for order {} : trigger producers transfers while payment manager is {}", order.getId(), this.getClass().getSimpleName());
        Map<Producer, PaymentTransferData> paymentTransferDatas = getPaymentTransferData(order);
        paymentTransferDatas.forEach((producer, paymentTransferData) -> transferPaymentToProducer(order, producer, paymentTransferData));
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

    record PaymentTransferData(Long amount, String description) {}

}
