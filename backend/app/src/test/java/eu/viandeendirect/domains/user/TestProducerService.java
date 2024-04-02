package eu.viandeendirect.domains.user;

import eu.viandeendirect.model.Customer;
import eu.viandeendirect.model.Producer;
import eu.viandeendirect.model.Sale;
import eu.viandeendirect.domains.sale.SaleRepository;
import eu.viandeendirect.security.specs.AuthenticationServiceSpecs;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatusCode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.AFTER_TEST_METHOD;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.BEFORE_TEST_METHOD;

@SpringBootTest
@ActiveProfiles(value = "test")
@ExtendWith({SpringExtension.class})
@Sql(value = {"/sql/create_test_data.sql"}, executionPhase = BEFORE_TEST_METHOD)
@Sql(value = {"/sql/delete_test_data.sql"}, executionPhase = AFTER_TEST_METHOD)
public class TestProducerService {

    @Autowired
    AuthenticationServiceSpecs authenticationProducerService;

    @Autowired
    SaleRepository saleRepository;

    @Autowired
    ProducerService producerService;

    @Test
    void getProducerSales_should_return_all_sales_for_the_current_producer() {
        // given
        Producer producer = authenticationProducerService.getAuthenticatedProducer();

        // when
        List<Sale> sales = producerService.getProducerSales(producer.getId()).getBody();

        // then
        assertThat(sales)
                .hasSize(1)
                .anyMatch(sale -> sale.getId().equals(1000));
    }

    @Test
    void getProducerSales_should_raise_an_error_if_accessing_sales_of_another_producer() {
        // when
        HttpStatusCode status = producerService.getProducerSales(-1).getStatusCode();

        // then
        assertThat(status).isEqualTo(HttpStatusCode.valueOf(403));
    }

    @Test
    void createProducerSale_should_persist_a_new_sale_in_database() {
        // given
        Producer producer = authenticationProducerService.getAuthenticatedProducer();

        Sale sale = new Sale();
        sale.setDeliveryCity("Chamonix");
        sale.setDeliveryAddressLine1("10 rue du tunnel");

        // when
        Sale saleCreated = producerService.createProducerSale(producer.getId(), sale).getBody();

        // then
        assertThat(saleCreated).isNotNull();
        assertThat(saleCreated.getId()).isNotNull();
        Sale saleReloaded = saleRepository.findById(saleCreated.getId()).get();
        assertThat(saleReloaded).isNotNull();
        assertThat(saleReloaded.getDeliveryCity()).isEqualTo("Chamonix");
        assertThat(saleReloaded.getDeliveryAddressLine1()).isEqualTo("10 rue du tunnel");
        assertThat(saleReloaded.getSeller().getId()).isEqualTo(1000);
    }

    @Test
    void createProducerSale_should_raise_an_error_if_creating_a_sale_for_another_producer() {
        // when / then
        HttpStatusCode status = producerService.createProducerSale(-1, new Sale()).getStatusCode();

        // then
        assertThat(status).isEqualTo(HttpStatusCode.valueOf(403));
    }

    @Test
    void getProducerCustomers_should_return_all_customers_with_orders_related_to_current_producer() {
        // when
        List<Customer> customers = producerService.getProducerCustomers(1000).getBody();

        // then
        assertThat(customers).hasSize(1);
        Customer customer1 = customers.get(0);
        assertThat(customer1.getId().longValue()).isEqualTo(3000);
    }
}
