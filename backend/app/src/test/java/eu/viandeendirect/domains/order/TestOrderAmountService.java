package eu.viandeendirect.domains.order;


import eu.viandeendirect.model.BeefProduction;
import eu.viandeendirect.model.Order;
import eu.viandeendirect.model.PackageLot;
import eu.viandeendirect.model.Sale;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

import java.time.OffsetDateTime;
import java.util.Map;

import static eu.viandeendirect.domains.order.OrderTestUtils.*;

class TestOrderAmountService {
    @Test
    void should_return_the_right_amount() {
        // given
        BeefProduction beefProduction = getBeefProduction();
        PackageLot packageLot1 = getPackageLot(1, beefProduction, "Colis tradition", "Un colis avec plein de trucs délicieux", 10f);
        PackageLot packageLot2 = getPackageLot(2, beefProduction, "Filet", "Un colis avec plein de trucs bons", 0.5f);

        Sale sale = new Sale();
        sale.setId(123);
        sale.setDeliveryStart(OffsetDateTime.parse("2021-09-30T15:30:00+01:00"));

        Order order = createOrder(123, createCustomer("Valentine", "DURAND", "0601020304"), Map.of(packageLot1, 1, packageLot2, 2));
        OrderAmountService orderAmountService = new OrderAmountService();

        // when
        float amount = orderAmountService.calculateTotalOrderAmount(order);

        // then
        Assertions.assertThat(amount).isEqualTo(110f);
    }

}