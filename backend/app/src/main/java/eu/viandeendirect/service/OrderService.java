package eu.viandeendirect.service;

import eu.viandeendirect.api.OrdersApiDelegate;
import eu.viandeendirect.model.Order;
import eu.viandeendirect.model.OrderItem;
import eu.viandeendirect.model.PackageLot;
import eu.viandeendirect.repository.OrderItemRepository;
import eu.viandeendirect.repository.OrderRepository;
import eu.viandeendirect.repository.PackageLotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService implements OrdersApiDelegate {

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    OrderItemRepository orderItemRepository;
    @Autowired
    private PackageLotRepository packageLotRepository;

    @Override
    public ResponseEntity<Order> createOrder(Order order) {
        Order orderCreated = orderRepository.save(order);
        List<PackageLot> lots = new ArrayList<>();
        order.getItems().forEach(item -> {
            PackageLot lot = packageLotRepository.findById(item.getPackageLot().getId()).get();
            int updatedQuantySold = lot.getQuantitySold() + item.getQuantity();
            if (updatedQuantySold > lot.getQuantity()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        String.format("""
                                Une erreur s'est produite lors de la création d'une commande de %s articles pour le lot '%s - %s'
                                %s articles sont déjà vendus.
                                %s articles ont été mis en vente.
                                Le nombre total d'articles vendus ne peut pas dépasser la quantité totals du lot.
                                """,
                        item.getQuantity(),
                        lot.getId(),
                        lot.getLabel(),
                        lot.getQuantitySold(),
                        lot.getQuantity()));
            }
            lot.setQuantitySold(updatedQuantySold);
            lots.add(lot);
        });
        packageLotRepository.saveAll(lots);
        orderItemRepository.saveAll(order.getItems());
        return new ResponseEntity<>(orderCreated, HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<Order> getOrder(Integer orderId) {
        Order order = orderRepository.findById(orderId).get();
        List<OrderItem> items = orderItemRepository.findByOrder(order);
        order.setItems(items);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }
}
