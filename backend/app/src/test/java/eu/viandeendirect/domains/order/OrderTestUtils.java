package eu.viandeendirect.domains.order;

import eu.viandeendirect.model.*;

import java.util.List;

public class OrderTestUtils {

    public static Order createOrder(PackageLot beefLotSteaksVache, PackageLot beefLotCoteVeau, PackageLot honeyLotMielDeSapin, PackageLot honeyLotMielDeColza) {

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
        return order;
    }

    public static PackageLot getHoneyPackageLot(Producer honeyProducer, String packageLotLabel, int quantity, int quantitySold) {
        Production honeyProduction1 = new HonneyProduction();
        honeyProduction1.setProducer(honeyProducer);
        PackageLot packageLot = new PackageLot();
        packageLot.setProduction(honeyProduction1);
        packageLot.setLabel(packageLotLabel);
        packageLot.setQuantity(quantity);
        packageLot.setQuantitySold(quantitySold);
        return packageLot;
    }

    public static PackageLot createBeefPackageLot(Producer beefProducer, String packageLotLabel, int quantity, int quantitySold) {
        Production beefProduction1 = new BeefProduction();
        beefProduction1.setProducer(beefProducer);
        PackageLot packageLot = new PackageLot();
        packageLot.setProduction(beefProduction1);
        packageLot.setLabel(packageLotLabel);
        packageLot.setQuantity(quantity);
        packageLot.setQuantitySold(quantitySold);
        return packageLot;
    }

}
