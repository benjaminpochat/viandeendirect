package eu.viandeendirect.domains.order;

import eu.viandeendirect.model.Order;
import eu.viandeendirect.model.OrderItem;
import org.springframework.stereotype.Service;

@Service
public class OrderAmountService {
    public float calculateTotalOrderAmount(Order order) {
        float totalAmount = 0;
        for (OrderItem orderItem : order.getItems()) {
            totalAmount += orderItem.getUnitPrice() * orderItem.getQuantity() * orderItem.getPackageLot().getNetWeight();
        }
        return totalAmount;
    }
}
