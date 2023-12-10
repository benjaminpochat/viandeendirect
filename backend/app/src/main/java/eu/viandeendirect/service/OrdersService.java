package eu.viandeendirect.service;

import eu.viandeendirect.api.OrdersApiDelegate;
import eu.viandeendirect.model.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrdersService implements OrdersApiDelegate {
    @Override
    public ResponseEntity<Void> createOrder(Order order) {
        return OrdersApiDelegate.super.createOrder(order);
    }

    @Override
    public ResponseEntity<Void> deleteOrder(String orderId) {
        return OrdersApiDelegate.super.deleteOrder(orderId);
    }

    @Override
    public ResponseEntity<Order> getOrder(String orderId) {
        return OrdersApiDelegate.super.getOrder(orderId);
    }

    @Override
    public ResponseEntity<List<Order>> getOrders() {
        return OrdersApiDelegate.super.getOrders();
    }

    @Override
    public ResponseEntity<Void> updateOrder(String orderId, Order order) {
        return OrdersApiDelegate.super.updateOrder(orderId, order);
    }
}
