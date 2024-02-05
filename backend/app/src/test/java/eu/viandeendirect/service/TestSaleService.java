package eu.viandeendirect.service;

import eu.viandeendirect.model.BeefProduction;
import eu.viandeendirect.model.Order;
import eu.viandeendirect.model.Production;
import eu.viandeendirect.model.Sale;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.AFTER_TEST_METHOD;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.BEFORE_TEST_METHOD;

@SpringBootTest
@ActiveProfiles(value = "test")
@ExtendWith({SpringExtension.class})
@Sql(value = {"/sql/create_test_data.sql"}, executionPhase = BEFORE_TEST_METHOD)
@Sql(value = {"/sql/delete_test_data.sql"}, executionPhase = AFTER_TEST_METHOD)
public class TestSaleService {

    @Autowired
    SaleService saleService;

    @Test
    void getSale_should_return_the_right_sale() {
        // when
        Sale sale = saleService.getSale(2000).getBody();

        // then
        assertThat(sale).isNotNull();
        assertThat(sale.getDeliveryCity()).isEqualTo("Peltre");
        assertThat(sale.getSeller().getId()).isEqualTo(2000);
    }

    @Test
    void getSaleOrders_should_return_all_orders_for_the_given_sale() {
        // when
        List<Order> orders = saleService.getSaleOrders(1000).getBody();

        // then
        assertThat(orders)
                .hasSize(2)
                .anyMatch(order -> order.getId().equals(3000))
                .anyMatch(order -> order.getId().equals(4000));
    }

    @Test
    void getSaleProductions_should_return_all_productions_for_the_given_sale() {
        // when
        List<Production> productions = saleService.getSaleProductions(1000).getBody();

        // then
        assertThat(productions)
                .hasSize(1)
                .anyMatch(production -> production.getId().equals(1000))
                .anyMatch(production -> production instanceof BeefProduction);
    }
}
