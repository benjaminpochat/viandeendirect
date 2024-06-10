package eu.viandeendirect.domains.payment;

import com.stripe.exception.StripeException;
import com.stripe.param.checkout.SessionCreateParams;
import eu.viandeendirect.model.Order;
import eu.viandeendirect.model.OrderItem;
import eu.viandeendirect.model.StripePayment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public interface StripePaymentManager {

    Logger LOGGER = LoggerFactory.getLogger(StripePaymentManager.class);

    StripePayment createPayment(Order order) throws StripeException;

    void processPaymentValidation(Order order);

    default SessionCreateParams.LineItem getLineItem(OrderItem orderItem) {
        long unitAmount = orderItem.getUnitPrice().longValue() * orderItem.getPackageLot().getNetWeight().longValue() * 100;
        long quantity = orderItem.getQuantity().longValue();
        LOGGER.debug("creating Stripe payment's line item for order item {} x{} for {} euro-cents each", orderItem.getPackageLot().getLabel(), quantity, unitAmount);
        return SessionCreateParams.LineItem.builder()
                .setPriceData(
                        SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("eur")
                                .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                        .setName(orderItem.getPackageLot().getLabel())
                                        .build()
                                )
                                .setUnitAmount(unitAmount)
                                .build()
                )
                .setQuantity(quantity)
                .build();
    }

}
