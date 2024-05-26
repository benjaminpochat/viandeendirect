package eu.viandeendirect.domains.order;

import eu.viandeendirect.api.OrdersApiDelegate;
import eu.viandeendirect.domains.payment.StripeService;
import eu.viandeendirect.model.*;
import eu.viandeendirect.domains.production.PackageLotRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

@Service
public class OrderService implements OrdersApiDelegate {

    private static final Logger LOGGER = LoggerFactory.getLogger(OrderService.class);
    @Autowired
    OrderRepository orderRepository;

    @Autowired
    OrderItemRepository orderItemRepository;

    @Autowired
    private PackageLotRepository packageLotRepository;

    @Autowired
    private StripeService stripeService;

    @Override
    public ResponseEntity<Order> createOrder(Order order) {
        order.setStatus(OrderStatus.ITEMS_SELECTED);
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

    @Override
    public ResponseEntity<StripePayment> createOrderPayment(Integer orderId) {
        Order order = orderRepository.findById(orderId).get();
        try {
            StripePayment payment = stripeService.createPayment(order);
            return new ResponseEntity<>(payment, HttpStatus.OK);
        } catch (Exception e) {
            LOGGER.error("An error occurred when creating Stripe account data using Stripe API", e);
            throw new ResponseStatusException(INTERNAL_SERVER_ERROR, "Une erreur s'est produite à la création du compte Stripe", e);
        }
    }

    public void processOrderPaymentInitialization(Order order) {
        order.setStatus(OrderStatus.PAYMENT_STARTED);
        orderRepository.save(order);
    }

    public void processOrderPaymentValidation(Order order) {
        stripeService.transferPaymentToProducers(order);
        order.setStatus(OrderStatus.PAYED);
        // TODO: trigger an email to the customer
        orderRepository.save(order);
    }

    public void processOrderPaymentFailure(Order order) {
        order.setStatus(OrderStatus.PAYMENT_FAILED);
        orderRepository.save(order);
    }
}
