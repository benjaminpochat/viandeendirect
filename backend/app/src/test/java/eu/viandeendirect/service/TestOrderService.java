package eu.viandeendirect.service;

import eu.viandeendirect.model.*;
import eu.viandeendirect.repository.CustomerRepository;
import eu.viandeendirect.repository.OrderItemRepository;
import eu.viandeendirect.repository.PackageLotRepository;
import eu.viandeendirect.repository.SaleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
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
public class TestOrderService {

    @Autowired
    OrderService orderService;

    @Autowired
    SaleRepository saleRepository;

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    PackageLotRepository packageLotRepository;

    @Autowired
    OrderItemRepository orderItemRepository;

    @Test
    void createOrder_should_persist_order_in_database() {
        // given
        Sale sale = saleRepository.findById(1000).get();
        Customer customer = customerRepository.findById(3000).get();
        PackageLot packageLot = packageLotRepository.findById(10001).get();
        Order order = new Order();
        order.setCustomer(customer);
        order.setSale(sale);
        OrderItem item = new OrderItem();
        item.setQuantity(1);
        item.setUnitPrice(16f);
        item.setPackageLot(packageLot);
        order.setItems(List.of(item));

        // when
        Order orderCreated = orderService.createOrder(order).getBody();

        // then
        assertThat(orderCreated).isNotNull();
        assertThat(orderCreated.getId()).isNotNull();
        List<OrderItem> itemsCreated = orderItemRepository.findByOrder(orderCreated);
        assertThat(itemsCreated).hasSize(1);
    }

    @Test
    void getOrder_should_return_the_right_object(){
        // when
        Order order = orderService.getOrder(4000).getBody();

        // then
        assertThat(order).isNotNull();
        assertThat(order.getItems()).hasSize(1);
        assertThat(order.getSale()).isNotNull();
        assertThat(order.getCustomer()).isNotNull();
    }
}