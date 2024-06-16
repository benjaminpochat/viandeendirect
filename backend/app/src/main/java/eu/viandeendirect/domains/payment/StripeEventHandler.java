package eu.viandeendirect.domains.payment;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import eu.viandeendirect.domains.order.OrderRepository;
import eu.viandeendirect.domains.order.OrderService;
import eu.viandeendirect.model.Order;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.HttpStatus.*;
import static org.springframework.http.HttpStatus.NOT_IMPLEMENTED;

/**
 * @link <a href=https://docs.stripe.com/connect/onboarding/quickstart#init-stripe>Stripe documentation</a>
 */
@RestController
public class StripeEventHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(StripeEventHandler.class);

    @Value("${STRIPE_WEBHOOK_ACCOUNT_SECRET:default_stripe_webhook_secret_value}")
    private String stripeWebhookAccountSecret;

    @Value("${STRIPE_WEBHOOK_CONNECT_SECRET:default_stripe_webhook_secret_value}")
    private String stripeWebhookConnectSecret;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderService orderService;


    @PostMapping(value = "/payments/stripeAccountEvents", produces = "application/json")
    public ResponseEntity<String> handleStripeAccountEvent(@RequestBody String stripeEvent, @RequestHeader("Stripe-Signature") String stripeSignature) {
        try {
            Event event = getEvent(stripeEvent, stripeSignature);
            switch (event.getType()) {
                case "checkout.session.completed":
                    LOGGER.info("Stripe account event handled : Checkout session completed");
                    processOrderPaymentCompleted(event);
                    break;
                case "checkout.session.expired":
                    LOGGER.info("Stripe account event handled : Checkout session expired");
                    processOrderPaymentExpiration(event);
                    break;
                default:
                    LOGGER.info("Unhandled account event type: {}", event.getType());
                    return new ResponseEntity<>(NOT_IMPLEMENTED);
            }
        } catch (SignatureVerificationException e) {
            LOGGER.error("An error occurred when processing Stripe webhook account event", e);
            return new ResponseEntity<>(INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(OK);
    }

    @PostMapping(value = "/payments/stripeConnectEvents", produces = "application/json")
    public ResponseEntity<String> handleStripeConnectEvent(@RequestBody String stripeEvent, @RequestHeader("Stripe-Signature") String stripeSignature) {
        LOGGER.info("Unhandled connect event");
        return new ResponseEntity<>(NOT_IMPLEMENTED);
    }

    Event getEvent(String stripeEvent, String stripeSignature) throws SignatureVerificationException {
        return Webhook.constructEvent(stripeEvent, stripeSignature, stripeWebhookConnectSecret);
    }

    void processOrderPaymentCompleted(Event event) {
        Session checkoutSession = getCheckoutSession(event);
        Order order = findOrderByCheckoutSession(checkoutSession);
        orderService.processOrderPaymentCompletion(order);
    }

    Session getCheckoutSession(Event event) {
        Session checkoutSession = (Session) event.getDataObjectDeserializer().getObject().get();
        return checkoutSession;
    }

    private void processOrderPaymentExpiration(Event event) {
        Session checkoutSession = getCheckoutSession(event);
        Order order = findOrderByCheckoutSession(checkoutSession);
        orderService.processOrderPaymentExpiration(order);
    }

    Order findOrderByCheckoutSession(Session checkoutSession) {
        return orderRepository.findByCheckoutSessionId(checkoutSession.getId());
    }

}

