package eu.viandeendirect.domains.order;

import eu.viandeendirect.api.OrdersApiDelegate;
import eu.viandeendirect.domains.payment.StripePaymentRepository;
import eu.viandeendirect.domains.payment.StripeService;
import eu.viandeendirect.domains.user.CustomerRepository;
import eu.viandeendirect.domains.user.CustomerService;
import eu.viandeendirect.model.*;
import eu.viandeendirect.domains.production.PackageLotRepository;
import eu.viandeendirect.security.AuthenticationService;
import eu.viandeendirect.security.specs.AuthenticationServiceSpecs;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

import static eu.viandeendirect.model.OrderStatus.PAYMENT_ABORTED;
import static org.springframework.http.HttpStatus.CREATED;
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

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private StripePaymentRepository stripePaymentRepository;

    @Autowired
    private AuthenticationServiceSpecs authenticationService;

    @Override
    public ResponseEntity<Order> getOrder(Integer orderId) {
        Order order = orderRepository.findById(orderId).get();
        checkOrderAccess(order);
        List<OrderItem> items = orderItemRepository.findByOrder(order);
        order.setItems(items);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    private void checkOrderAccess(Order order) {
        Customer customer = authenticationService.getAuthenticatedCustomer();
        if (customer != null) {
            if (!order.getCustomer().equals(customer)) {
                throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE);
            }
            return;
        }
        Producer producer = authenticationService.getAuthenticatedProducer();
        if (producer!= null) {
            if (order.getItems().stream().noneMatch(item -> item.getPackageLot().getProduction().getProducer().equals(producer))) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN);
            }
        }
    }

    @Override
    public ResponseEntity<Order> createOrder(Order order) {
        loadCustomer(order);
        order.setStatus(OrderStatus.BOOKED_WITHOUT_PAYMENT);
        Order orderCreated = orderRepository.save(order);
        updateQuantitiesSold(order);
        return new ResponseEntity<>(orderCreated, CREATED);
    }

    @Override
    public ResponseEntity<Order> createOrderPayment(Order order) {
        try {
            loadCustomer(order);
            order.setStatus(OrderStatus.PAYMENT_PENDING);
            orderRepository.save(order);
            updateQuantitiesSold(order);
            StripePayment payment = stripeService.createPayment(order);
            stripePaymentRepository.save(payment);
            order.setPayment(payment);
            orderRepository.save(order);
            return new ResponseEntity<>(order, CREATED);
        } catch (Exception e) {
            LOGGER.error("An error occurred when creating Stripe payment using Stripe API", e);
            throw new ResponseStatusException(INTERNAL_SERVER_ERROR, "Une erreur s'est produite à la création du paiement Stripe", e);
        }
    }

    private void loadCustomer(Order order) {
        if (order.getCustomer().getId() == null) {
            Customer customer = customerRepository.findByEmail(order.getCustomer().getUser().getEmail()).orElse(null);
            order.setCustomer(customer);
        }
    }

    private void updateQuantitiesSold(Order order) {
        List<PackageLot> lots = new ArrayList<>();
        order.getItems().forEach(item -> {
            PackageLot lot = packageLotRepository.findById(item.getPackageLot().getId()).get();
            int updatedQuantySold = lot.getQuantitySold() + item.getQuantity();
            if (updatedQuantySold > lot.getQuantity()) {
                order.setStatus(PAYMENT_ABORTED);
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
    }

    public void processOrderPaymentCompletion(Order order) {
        order.setStatus(OrderStatus.PAYMENT_COMPLETED);
        // TODO: trigger an email to the customer
        orderRepository.save(order);
    }

    public void processOrderPaymentExpiration(Order order) {
        order.setStatus(PAYMENT_ABORTED);
        // TODO : update quantity to sold with product not paid
        orderRepository.save(order);
    }
}
