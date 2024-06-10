package eu.viandeendirect.domains.payment;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
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

    @Value("${STRIPE_WEBHOOK_ACCOUNT_SECRET:default_stripe_webhook_secret_value}")
    private String stripeWebhookAccountSecret;

    @Value("${STRIPE_WEBHOOK_CONNECT_SECRET:default_stripe_webhook_secret_value}")
    private String stripeWebhookConnectSecret;


    private static final Logger LOGGER = LoggerFactory.getLogger(StripeEventHandler.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderService orderService;


    @PostMapping(value = "/payments/stripeAccountEvents", produces = "application/json")
    public ResponseEntity<String> handleStripeAccountEvent(@RequestBody String stripeEvent, @RequestHeader("Stripe-Signature") String stripeSignature) {
        try {
            Event event = Webhook.constructEvent(stripeEvent, stripeSignature, stripeWebhookAccountSecret);
            switch (event.getType()) {
                case "checkout.session.completed":
                    LOGGER.info("Stripe account event handled : Checkout session completed");
                    break;
                case "checkout.session.expired":
                    LOGGER.info("Stripe account event handled : Checkout session expired");
                    break;
                case "checkout.session.async_payment_succeeded":
                    LOGGER.info("Stripe account event handled : Checkout session async payment succeeded");
                    break;
                case "checkout.session.async_payment_failed":
                    LOGGER.warn("Stripe account event handled : Checkout session async payment failed");
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
        try {
            Event event = Webhook.constructEvent(stripeEvent, stripeSignature, stripeWebhookConnectSecret);
            switch (event.getType()) {
                case "checkout.session.completed":
                    LOGGER.info("Stripe connect event handled : Checkout session completed");
                    processOrderPaymentCompleted(event);
                    break;
                case "checkout.session.expired":
                    LOGGER.info("Stripe connect event handled : Checkout session expired");
                    processOrderPaymentExpiration(event);
                    break;
                default:
                    LOGGER.info("Unhandled connect event type: {}", event.getType());
                    return new ResponseEntity<>(NOT_IMPLEMENTED);
            }
        } catch (SignatureVerificationException e) {
            LOGGER.error("An error occurred when processing Stripe webhook connect event", e);
            return new ResponseEntity<>(INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(OK);
    }

    private void processOrderPaymentCompleted(Event event) {
        Session checkoutSession = (Session) event.getData().getObject();
        Order order = findOrderByCheckoutSession(checkoutSession);
        orderService.processOrderPaymentCompletion(order);
    }

    private void processOrderPaymentExpiration(Event event) {
        Session checkoutSession = (Session) event.getData().getObject();
        Order order = findOrderByCheckoutSession(checkoutSession);
        orderService.processOrderPaymentExpiration(order);
    }

    private Order findOrderByCheckoutSession(Session checkoutSession) {
        return orderRepository.findByCheckoutSessionId(checkoutSession.getId());
    }

}

