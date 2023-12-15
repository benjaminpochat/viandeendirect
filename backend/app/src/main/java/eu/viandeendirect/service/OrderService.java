package eu.viandeendirect.service;

import eu.viandeendirect.api.OrdersApiDelegate;
import eu.viandeendirect.model.Order;
import eu.viandeendirect.model.OrderItem;
import eu.viandeendirect.repository.OrderItemRepository;
import eu.viandeendirect.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService implements OrdersApiDelegate {

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    OrderItemRepository orderItemRepository;

    @Override
    public ResponseEntity<Order> createOrder(Order order) {
        Order orderCreated = orderRepository.save(order);
        orderItemRepository.saveAll(order.getItems());
        return new ResponseEntity<>(orderCreated, HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<Order> getOrder(String orderId) {
        Order order = orderRepository.findById(Long.valueOf(orderId)).get();
        List<OrderItem> items = orderItemRepository.findByOrder(order);
        order.setItems(items);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }
}
