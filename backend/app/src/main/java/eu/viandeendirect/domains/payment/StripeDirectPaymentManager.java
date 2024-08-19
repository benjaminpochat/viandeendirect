package eu.viandeendirect.domains.payment;

import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.net.RequestOptions;
import com.stripe.param.checkout.SessionCreateParams;
import eu.viandeendirect.common.ViandeEnDirectConfiguration;
import eu.viandeendirect.domains.production.PackageLotRepository;
import eu.viandeendirect.model.Order;
import eu.viandeendirect.model.OrderItem;
import eu.viandeendirect.model.Producer;
import eu.viandeendirect.model.StripePayment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

/**
 * Manager Stripe payments following the Stripe pattern "direct charge".
 * To use when orders includes productions from the same producer.
 *
 * @see <a href="https://docs.stripe.com/connect/direct-charges">Stripe doc</a>
 */
@Service
@Qualifier("StripeDirectPaymentManager")
public class StripeDirectPaymentManager implements StripePaymentManager {

    private static final Logger LOGGER = LoggerFactory.getLogger(StripeDirectPaymentManager.class);

    @Autowired
    ViandeEnDirectConfiguration viandeEnDirectConfiguration;

    @Autowired
    PackageLotRepository packageLotRepository;

    @Override
    public StripePayment createPayment(Order order) throws StripeException {
        SessionCreateParams.Builder builder = SessionCreateParams.builder();
        order.getItems().forEach(item -> builder.addLineItem(getLineItem(item)));
        SessionCreateParams params = builder
                .setPaymentIntentData(SessionCreateParams.PaymentIntentData.builder()
                        .setDescription(String.format("Commande viandeendirect.eu n° %s de %s %s", order.getId(), order.getCustomer().getUser().getFirstName(), order.getCustomer().getUser().getLastName()))
                        .setApplicationFeeAmount(1L).build())
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setCustomerEmail(order.getCustomer().getUser().getEmail())
                .setSuccessUrl(viandeEnDirectConfiguration.getCustomerFrontendUrl() + "/order/" + order.getId() + "/payment")
                .setCancelUrl(viandeEnDirectConfiguration.getCustomerFrontendUrl() + "/order/" + order.getId() + "/payment")
                .setExpiresAt(Instant.now().plusSeconds(30 * 60).getEpochSecond())
                .build();
        RequestOptions requestOptions = RequestOptions.builder().setStripeAccount(getProducerStripeAccount(order).getStripeAccount().getStripeId()).build();
        Session session = Session.create(params, requestOptions);
        StripePayment stripePayment = new StripePayment();
        stripePayment.setCheckoutSessionId(session.getId());
        stripePayment.setPaymentUrl(session.getUrl());
        return stripePayment;
    }

    private Producer getProducerStripeAccount(Order order) {
        List<Producer> orderProducers = order.getItems().stream()
                .map(OrderItem::getPackageLot)
                .map(lot -> packageLotRepository.findById(lot.getId()).get())
                .map(lot -> lot.getProduction().getProducer())
                .distinct()
                .toList();
        if (orderProducers.size() > 1) {
            throw new IllegalStateException("StripeDirectPaymentManager can only be used with orders from the same producer");
        }
        return orderProducers.stream().findFirst().get();
    }

    @Override
    public void processPaymentValidation(Order order) {
        LOGGER.debug("processing payment validation for order {} : do nothing while payment manager is {}", order.getId(), this.getClass().getSimpleName());
    }
}
