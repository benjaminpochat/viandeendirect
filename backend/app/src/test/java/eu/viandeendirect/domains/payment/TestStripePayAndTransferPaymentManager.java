package eu.viandeendirect.domains.payment;

import eu.viandeendirect.domains.order.OrderTestService;
import eu.viandeendirect.model.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@ActiveProfiles(value = "test")
@ExtendWith({SpringExtension.class})
class TestStripePayAndTransferPaymentManager {

    @Autowired
    OrderTestService orderTestService;

    @Test
    void getPaymentTransferData_should_return_the_right_payment_transfer_data() {
        //given
        var paymentManager = new StripePayAndTransferPaymentManager();

        Producer beefProducer = new Producer();
        beefProducer.setId(1);

        Producer honeyProducer = new Producer();
        honeyProducer.setId(2);

        PackageLot beefLotSteaksVache = orderTestService.createBeefPackageLot(beefProducer, "steaks de vache", 5, 0);
        PackageLot beefLotCoteVeau = orderTestService.createBeefPackageLot(beefProducer, "côte de veau", 5, 0);
        PackageLot honeyLotMielDeSapin = orderTestService.getHoneyPackageLot(honeyProducer, "miel de sapin", 5, 0);
        PackageLot honeyLotMielDeColza = orderTestService.getHoneyPackageLot(honeyProducer, "miel de colza", 5, 0);

        Order order = orderTestService.createOrderWithItems(beefLotSteaksVache, beefLotCoteVeau, honeyLotMielDeSapin, honeyLotMielDeColza);

        //when
        var paymentTransferData = paymentManager.getPaymentTransferData(order);

        //then
        assertThat(paymentTransferData.get(beefProducer).amount()).isEqualTo(100L);
        assertThat(paymentTransferData.get(honeyProducer).amount()).isEqualTo(200L);
        assertThat(paymentTransferData.get(beefProducer).description()).contains("steaks de vache x2");
        assertThat(paymentTransferData.get(beefProducer).description()).contains("côte de veau x1");
        assertThat(paymentTransferData.get(honeyProducer).description()).contains("miel de sapin x3");
        assertThat(paymentTransferData.get(honeyProducer).description()).contains("miel de colza x2");
    }
}