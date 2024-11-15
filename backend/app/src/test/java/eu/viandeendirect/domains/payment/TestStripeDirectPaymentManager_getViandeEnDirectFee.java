package eu.viandeendirect.domains.payment;

import eu.viandeendirect.model.BeefProduction;
import eu.viandeendirect.model.Order;
import eu.viandeendirect.model.PackageLot;
import eu.viandeendirect.model.Sale;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.OffsetDateTime;
import java.util.Map;

import static eu.viandeendirect.domains.order.OrderTestUtils.*;
import static eu.viandeendirect.domains.order.OrderTestUtils.createCustomer;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles(value = "test")
@ExtendWith({SpringExtension.class})
class TestStripeDirectPaymentManager_getViandeEnDirectFee {

    @Autowired
    private StripeDirectPaymentManager stripeDirectPaymentManager;

    @Test
    void should_return_the_correct_fee() {
        // given
        BeefProduction beefProduction = getBeefProduction();
        PackageLot packageLot1 = getPackageLot(1, beefProduction, "Colis tradition", "Un colis avec plein de trucs délicieux", 10f);
        PackageLot packageLot2 = getPackageLot(2, beefProduction, "Filet", "Un colis avec plein de trucs bons", 0.5f);

        Sale sale = new Sale();
        sale.setId(123);
        sale.setDeliveryStart(OffsetDateTime.parse("2021-09-30T15:30:00+01:00"));

        Order order = createOrder(123, createCustomer("Valentine", "DURAND", "0601020304"), Map.of(packageLot1, 1, packageLot2, 2));

        // when
        float fee = stripeDirectPaymentManager.getViandeEnDirectFee(order);

        // then
        assertEquals(1.1f, fee);
        assertEquals(110, (long)(fee * 100));
    }

}