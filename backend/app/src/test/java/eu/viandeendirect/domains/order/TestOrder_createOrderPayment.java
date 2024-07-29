package eu.viandeendirect.domains.order;

import com.stripe.exception.StripeException;
import eu.viandeendirect.domains.payment.StripeService;
import eu.viandeendirect.domains.production.PackageLotRepository;
import eu.viandeendirect.domains.sale.SaleRepository;
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
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static eu.viandeendirect.model.OrderStatus.PAYMENT_PENDING;
import static java.util.regex.Pattern.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.BEFORE_TEST_CLASS;

@SpringBootTest
@ActiveProfiles(value = "test")
@ExtendWith({SpringExtension.class})
@Sql(value = {"/sql/delete_test_data.sql"}, executionPhase = BEFORE_TEST_CLASS)
public class TestOrder_createOrderPayment {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderTestService orderTestService;

    @Autowired
    private PackageLotRepository packageLotRepository;

    @MockBean
    private StripeService stripeService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private SaleRepository saleRepository;

    @Test
    void should_persist_order_in_database() throws StripeException {
        // given
        Customer customer = orderTestService.createAndSaveCustomer();
        Producer beefProducer = orderTestService.createAndSaveProducer();
        Producer honeyProducer = orderTestService.createAndSaveProducer();

        PackageLot beefLotSteaksVache = orderTestService.createBeefPackageLot(beefProducer, "steaks de vache", 5, 0);
        PackageLot beefLotCoteVeau = orderTestService.createBeefPackageLot(beefProducer, "côte de veau", 5, 0);
        PackageLot honeyLotMielDeSapin = orderTestService.getHoneyPackageLot(honeyProducer, "miel de sapin", 5, 0);
        PackageLot honeyLotMielDeColza = orderTestService.getHoneyPackageLot(honeyProducer, "miel de colza", 5, 0);

        Order order = orderTestService.createOrder(beefLotSteaksVache, beefLotCoteVeau, honeyLotMielDeSapin, honeyLotMielDeColza, customer);
        saleRepository.save(order.getSale());

        var stripePayment = new StripePayment();
        stripePayment.setCheckoutSessionId("test_success");
        Mockito.when(stripeService.createPayment(Mockito.any())).thenReturn(stripePayment);

        // when
        ResponseEntity<Order> response = orderService.createOrderPayment(order);

        // then
        Order orderReloaded = orderRepository.findById(response.getBody().getId()).get();
        assertThat(orderReloaded.getPayment().getCheckoutSessionId()).isEqualTo("test_success");
        assertThat(orderReloaded.getStatus()).isEqualTo(PAYMENT_PENDING);
        PackageLot honeyLotMielDeSapinReloaded = packageLotRepository.findById(honeyLotMielDeSapin.getId()).get();
        assertThat(honeyLotMielDeSapinReloaded.getQuantitySold()).isEqualTo(3);
    }

    @Test
    void should_raise_an_error_when_all_items_are_already_sold() throws StripeException {
        Customer customer = orderTestService.createAndSaveCustomer();
        Producer beefProducer = orderTestService.createAndSaveProducer();
        Producer honeyProducer = orderTestService.createAndSaveProducer();

        PackageLot beefLotSteaksVache = orderTestService.createBeefPackageLot(beefProducer, "steaks de vache", 5, 4);
        PackageLot beefLotCoteVeau = orderTestService.createBeefPackageLot(beefProducer, "côte de veau", 5, 4);
        PackageLot honeyLotMielDeSapin = orderTestService.getHoneyPackageLot(honeyProducer, "miel de sapin", 5, 4);
        PackageLot honeyLotMielDeColza = orderTestService.getHoneyPackageLot(honeyProducer, "miel de colza", 5, 4);

        Order order = orderTestService.createOrder(beefLotSteaksVache, beefLotCoteVeau, honeyLotMielDeSapin, honeyLotMielDeColza, customer);

        var stripePayment = new StripePayment();
        stripePayment.setCheckoutSessionId("test_failure_product_not_available");
        Mockito.when(stripeService.createPayment(Mockito.any())).thenReturn(stripePayment);

        // when / then
        Assertions.assertThatThrownBy(() -> orderService.createOrderPayment(order))
                .cause().hasMessageMatching(compile(".*Une erreur s'est produite lors de la création d'une commande de .* articles pour le lot '.* - .*'.*", MULTILINE | DOTALL));
    }



}
