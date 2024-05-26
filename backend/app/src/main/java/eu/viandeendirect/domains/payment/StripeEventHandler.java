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

/**
 * @link <a href=https://docs.stripe.com/connect/onboarding/quickstart#init-stripe>Stripe documentation</a>
 */
@RestController
public class StripeEventHandler {

    @Value("${STRIPE_WEBHOOK_SECRET:default_stripe_webhook_secret_value}")
    private String stripeWebhookSecret;

    private static final Logger LOGGER = LoggerFactory.getLogger(StripeEventHandler.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderService orderService;


    @PostMapping(value = "/payments/stripeEvents", produces = "application/json")
    public ResponseEntity<String> handleStripeEvent(@RequestBody String stripeEvent, @RequestHeader("Stripe-Signature") String stripeSignature) {
        try {
            Event event = Webhook.constructEvent(stripeEvent, stripeSignature, stripeWebhookSecret);
            switch (event.getType()) {
                case "checkout.session.completed":
                    LOGGER.info("Stripe event handled : Checkout session completed");
                    processOrderPaymentInitialization(event);
                    break;
                case "checkout.session.async_payment_succeeded":
                    LOGGER.info("Stripe event handled : Checkout session async payment succeeded");
                    processOrderPaymentValidation(event);
                    break;
                case "checkout.session.async_payment_failed":
                    LOGGER.warn("Stripe event handled : Checkout session async payment failed");
                    processOrderPaymentFailure(event);
                    break;
                default:
                    LOGGER.error("Unhandled event type: {}", event.getType());
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        } catch (SignatureVerificationException e) {
            LOGGER.error("An error occurred when processing Stripe webhook event", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    private void processOrderPaymentInitialization(Event event) {
        Session checkoutSession = (Session) event.getData().getObject();
        Order order = findOrderByCheckoutSession(checkoutSession);
        orderService.processOrderPaymentInitialization(order);
    }

    private void processOrderPaymentValidation(Event event) {
        Session checkoutSession = (Session) event.getData().getObject();
        Order order = findOrderByCheckoutSession(checkoutSession);
        orderService.processOrderPaymentValidation(order);
    }

    private void processOrderPaymentFailure(Event event) {
        Session checkoutSession = (Session) event.getData().getObject();
        Order order = findOrderByCheckoutSession(checkoutSession);
        orderService.processOrderPaymentFailure(order);
    }

    private Order findOrderByCheckoutSession(Session checkoutSession) {
        return orderRepository.findByCheckoutSessionId(checkoutSession.getId());
    }

}

