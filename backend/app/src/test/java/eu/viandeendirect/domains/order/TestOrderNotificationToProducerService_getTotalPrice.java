package eu.viandeendirect.domains.order;

import eu.viandeendirect.model.Order;
import eu.viandeendirect.model.Producer;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.AFTER_TEST_METHOD;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.BEFORE_TEST_METHOD;

@SpringBootTest
@ActiveProfiles(value = "test")
@ExtendWith({SpringExtension.class})
@Sql(value = {"/sql/create_test_data.sql"}, executionPhase = BEFORE_TEST_METHOD)
@Sql(value = {"/sql/delete_test_data.sql"}, executionPhase = AFTER_TEST_METHOD)
class TestOrderNotificationToProducerService_getTotalPrice {

    @Autowired
    private OrderNotificationToProducerService orderNotificationToProducerService;

    @Test
    void should_return_the_right_total_price() {
        // given
        var order = new Order();
        order.setId(3000);
        var producer = new Producer();
        producer.setId(1000);

        // when
        double totalPrice = orderNotificationToProducerService.getTotalPrice(order, producer);

        // then
        Assertions.assertThat(totalPrice).isEqualTo(160f);
    }


}