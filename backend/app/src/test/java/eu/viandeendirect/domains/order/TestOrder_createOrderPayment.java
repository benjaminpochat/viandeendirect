package eu.viandeendirect.domains.order;

import com.stripe.exception.StripeException;
import eu.viandeendirect.domains.payment.StripeService;
import eu.viandeendirect.domains.production.PackageLotRepository;
import eu.viandeendirect.domains.production.ProductionRepository;
import eu.viandeendirect.domains.user.CustomerRepository;
import eu.viandeendirect.domains.user.ProducerRepository;
import eu.viandeendirect.domains.user.UserRepository;
import eu.viandeendirect.model.*;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static eu.viandeendirect.model.OrderStatus.ITEMS_SELECTED;
import static java.util.regex.Pattern.*;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles(value = "test")
@ExtendWith({SpringExtension.class})
public class TestOrder_createOrderPayment {

    @Autowired
    private OrderService service;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @MockBean
    private StripeService stripeService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PackageLotRepository packageLotRepository;

    @Autowired
    private ProductionRepository productionRepository;

    @Autowired
    private ProducerRepository producerRepository;

    @Test
    void should_persist_order_in_database() throws StripeException {
        // given
        Customer customer = createAndSaveCustomer();
        Producer beefProducer = createAndSaveProducer(1);
        Producer honeyProducer = createAndSaveProducer(2);

        PackageLot beefLotSteaksVache = OrderTestUtils.createBeefPackageLot(beefProducer, "steaks de vache", 5, 0);
        PackageLot beefLotCoteVeau = OrderTestUtils.createBeefPackageLot(beefProducer, "côte de veau", 5, 0);
        PackageLot honeyLotMielDeSapin = OrderTestUtils.getHoneyPackageLot(honeyProducer, "miel de sapin", 5, 0);
        PackageLot honeyLotMielDeColza = OrderTestUtils.getHoneyPackageLot(honeyProducer, "miel de colza", 5, 0);

        Order order = createAndSaveOrder(beefLotSteaksVache, beefLotCoteVeau, honeyLotMielDeSapin, honeyLotMielDeColza, customer);

        var stripePayment = new StripePayment();
        stripePayment.setId(1);
        Mockito.when(stripeService.createPayment(Mockito.any())).thenReturn(stripePayment);

        // when
        ResponseEntity<Order> response = service.createOrderPayment(order);

        // then
        Order orderReloaded = orderRepository.findById(response.getBody().getId()).get();
        assertThat(orderReloaded.getPayment().getId()).isEqualTo(1);
        assertThat(orderReloaded.getStatus()).isEqualTo(ITEMS_SELECTED);
        PackageLot honeyLotMielDeSapinReloaded = packageLotRepository.findById(honeyLotMielDeSapin.getId()).get();
        assertThat(honeyLotMielDeSapinReloaded.getQuantitySold()).isEqualTo(3);
    }

    @Test
    void should_raise_an_error_when_all_items_are_already_sold() throws StripeException {
        Customer customer = createAndSaveCustomer();
        Producer beefProducer = createAndSaveProducer(1);
        Producer honeyProducer = createAndSaveProducer(2);

        PackageLot beefLotSteaksVache = OrderTestUtils.createBeefPackageLot(beefProducer, "steaks de vache", 5, 4);
        PackageLot beefLotCoteVeau = OrderTestUtils.createBeefPackageLot(beefProducer, "côte de veau", 5, 4);
        PackageLot honeyLotMielDeSapin = OrderTestUtils.getHoneyPackageLot(honeyProducer, "miel de sapin", 5, 4);
        PackageLot honeyLotMielDeColza = OrderTestUtils.getHoneyPackageLot(honeyProducer, "miel de colza", 5, 4);

        Order order = createAndSaveOrder(beefLotSteaksVache, beefLotCoteVeau, honeyLotMielDeSapin, honeyLotMielDeColza, customer);

        var stripePayment = new StripePayment();
        stripePayment.setId(1);
        Mockito.when(stripeService.createPayment(Mockito.any())).thenReturn(stripePayment);

        // when / then
        Assertions.assertThatThrownBy(() -> service.createOrderPayment(order))
                .cause().hasMessageMatching(compile(".*Une erreur s'est produite lors de la création d'une commande de .* articles pour le lot '.* - .*'.*", MULTILINE | DOTALL));
        //TODO : revoir les status des commandes !
        Assertions.assertThat(order.getStatus()).isNotEqualTo(ITEMS_SELECTED);
    }

    @Test
    void should_change_order_status_after_payment_is_completed() {
        // given
        // when
        // then
        //TODO : faire un test pour la confirmation du paiement
        Assertions.fail("To be implemented...");
    }

    @Test
    void should_change_order_status_after_payment_is_aborted() {
        // given
        // when
        // then
        //TODO : faire un test pour l'abandon du paiement du paiement
        Assertions.fail("To be implemented...");
    }


    private Order createAndSaveOrder(PackageLot beefLotSteaksVache, PackageLot beefLotCoteVeau, PackageLot honeyLotMielDeSapin, PackageLot honeyLotMielDeColza, Customer customer) {
        Order order = OrderTestUtils.createOrder(
                beefLotSteaksVache,
                beefLotCoteVeau,
                honeyLotMielDeSapin,
                honeyLotMielDeColza);
        order.setCustomer(customer);
        productionRepository.saveAll(order.getItems().stream().map(OrderItem::getPackageLot).map(PackageLot::getProduction).toList());
        packageLotRepository.saveAll(order.getItems().stream().map(OrderItem::getPackageLot).distinct().toList());
        return order;
    }

    private Producer createAndSaveProducer(int id) {
        Producer producer = new Producer();
        producer.setId(id);
        producerRepository.save(producer);
        return producer;
    }

    private Customer createAndSaveCustomer() {
        User user = new User();
        user.setEmail("customer@address.mail");
        userRepository.save(user);

        Customer customer = new Customer();
        customer.setUser(user);
        customerRepository.save(customer);
        return customer;
    }

}
