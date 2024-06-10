package eu.viandeendirect.domains.payment;

import eu.viandeendirect.domains.order.OrderTestUtils;
import eu.viandeendirect.model.*;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

class TestStripePayAndTransferPaymentManager {
    @Test
    void getPaymentTransferData_should_return_the_right_payment_transfer_data() {
        //given
        var paymentManager = new StripePayAndTransferPaymentManager();

        Producer beefProducer = new Producer();
        beefProducer.setId(1);

        Producer honeyProducer = new Producer();
        honeyProducer.setId(2);

        PackageLot beefLotSteaksVache = OrderTestUtils.createBeefPackageLot(beefProducer, "steaks de vache", 5, 0);
        PackageLot beefLotCoteVeau = OrderTestUtils.createBeefPackageLot(beefProducer, "côte de veau", 5, 0);
        PackageLot honeyLotMielDeSapin = OrderTestUtils.getHoneyPackageLot(honeyProducer, "miel de sapin", 5, 0);
        PackageLot honeyLotMielDeColza = OrderTestUtils.getHoneyPackageLot(honeyProducer, "miel de colza", 5, 0);

        Order order = OrderTestUtils.createOrder(beefLotSteaksVache, beefLotCoteVeau, honeyLotMielDeSapin, honeyLotMielDeColza);

        //when
        var paymentTransferData = paymentManager.getPaymentTransferData(order);

        //then
        Assertions.assertThat(paymentTransferData.get(beefProducer).amount()).isEqualTo(100L);
        Assertions.assertThat(paymentTransferData.get(honeyProducer).amount()).isEqualTo(200L);
        Assertions.assertThat(paymentTransferData.get(beefProducer).description()).contains("steaks de vache x2");
        Assertions.assertThat(paymentTransferData.get(beefProducer).description()).contains("côte de veau x1");
        Assertions.assertThat(paymentTransferData.get(honeyProducer).description()).contains("miel de sapin x3");
        Assertions.assertThat(paymentTransferData.get(honeyProducer).description()).contains("miel de colza x2");
    }
}