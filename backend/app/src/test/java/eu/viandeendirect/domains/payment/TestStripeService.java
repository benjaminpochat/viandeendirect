package eu.viandeendirect.domains.payment;

import eu.viandeendirect.model.*;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.List;

class TestStripeService {
    @Test
    void getPaymentTransferData_should_return_the_right_payment_transfer_data() {
        //given
        StripeService stripeService = new StripeService();

        Producer beefProducer = new Producer();
        beefProducer.setId(1);

        Production beefProduction1 = new BeefProduction();
        beefProduction1.setProducer(beefProducer);
        PackageLot beefLotSteaksVache = new PackageLot();
        beefLotSteaksVache.setProduction(beefProduction1);
        beefLotSteaksVache.setLabel("steaks de vache");

        Production beefProduction2 = new BeefProduction();
        beefProduction2.setProducer(beefProducer);
        PackageLot beefLotCoteVeau = new PackageLot();
        beefLotCoteVeau.setProduction(beefProduction2);
        beefLotCoteVeau.setLabel("côte de veau");


        Producer honeyProducer = new Producer();
        honeyProducer.setId(2);

        Production honeyProduction1 = new HonneyProduction();
        honeyProduction1.setProducer(honeyProducer);
        PackageLot honeyLotMielDeSapin = new PackageLot();
        honeyLotMielDeSapin.setProduction(honeyProduction1);
        honeyLotMielDeSapin.setLabel("miel de sapin");

        Production honeyProduction2 = new HonneyProduction();
        honeyProduction2.setProducer(honeyProducer);
        PackageLot honeyLotMielDeColza = new PackageLot();
        honeyLotMielDeColza.setProduction(honeyProduction2);
        honeyLotMielDeColza.setLabel("miel de colza");

        Order order = new Order();

        OrderItem item1= new OrderItem();
        item1.setQuantity(2);
        item1.setPackageLot(beefLotSteaksVache);
        item1.setUnitPrice(30f);

        OrderItem item2 = new OrderItem();
        item2.setQuantity(1);
        item2.setPackageLot(beefLotCoteVeau);
        item2.setUnitPrice(40f);

        OrderItem item3 = new OrderItem();
        item3.setQuantity(3);
        item3.setPackageLot(honeyLotMielDeSapin);
        item3.setUnitPrice(50f);

        OrderItem item4 = new OrderItem();
        item4.setQuantity(2);
        item4.setPackageLot(honeyLotMielDeColza);
        item4.setUnitPrice(25f);

        order.setItems(List.of(item1, item2, item3, item4));

        //when
        var paymentTransferData = stripeService.getPaymentTransferData(order);

        //then
        Assertions.assertThat(paymentTransferData.get(beefProducer).amount()).isEqualTo(100L);
        Assertions.assertThat(paymentTransferData.get(honeyProducer).amount()).isEqualTo(200L);
        Assertions.assertThat(paymentTransferData.get(beefProducer).description()).contains("steaks de vache x2");
        Assertions.assertThat(paymentTransferData.get(beefProducer).description()).contains("côte de veau x1");
        Assertions.assertThat(paymentTransferData.get(honeyProducer).description()).contains("miel de sapin x3");
        Assertions.assertThat(paymentTransferData.get(honeyProducer).description()).contains("miel de colza x2");
    }
}