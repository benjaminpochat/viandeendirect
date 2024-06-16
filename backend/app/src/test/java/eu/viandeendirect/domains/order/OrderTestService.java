package eu.viandeendirect.domains.order;

import eu.viandeendirect.domains.production.PackageLotRepository;
import eu.viandeendirect.domains.production.ProductionRepository;
import eu.viandeendirect.domains.user.CustomerRepository;
import eu.viandeendirect.domains.user.ProducerRepository;
import eu.viandeendirect.domains.user.UserRepository;
import eu.viandeendirect.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderTestService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProducerRepository producerRepository;

    @Autowired
    private PackageLotRepository packageLotRepository;

    @Autowired
    private ProductionRepository productionRepository;

    @Autowired
    private CustomerRepository customerRepository;


    public Order createOrderWithItems(PackageLot beefLotSteaksVache, PackageLot beefLotCoteVeau, PackageLot honeyLotMielDeSapin, PackageLot honeyLotMielDeColza) {

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

    public PackageLot getHoneyPackageLot(Producer honeyProducer, String packageLotLabel, int quantity, int quantitySold) {
        Production honeyProduction1 = new HonneyProduction();
        honeyProduction1.setProducer(honeyProducer);
        PackageLot packageLot = new PackageLot();
        packageLot.setProduction(honeyProduction1);
        packageLot.setLabel(packageLotLabel);
        packageLot.setQuantity(quantity);
        packageLot.setQuantitySold(quantitySold);
        return packageLot;
    }

    public PackageLot createBeefPackageLot(Producer beefProducer, String packageLotLabel, int quantity, int quantitySold) {
        Production beefProduction1 = new BeefProduction();
        beefProduction1.setProducer(beefProducer);
        PackageLot packageLot = new PackageLot();
        packageLot.setProduction(beefProduction1);
        packageLot.setLabel(packageLotLabel);
        packageLot.setQuantity(quantity);
        packageLot.setQuantitySold(quantitySold);
        return packageLot;
    }

    public Order createOrder(PackageLot beefLotSteaksVache, PackageLot beefLotCoteVeau, PackageLot honeyLotMielDeSapin, PackageLot honeyLotMielDeColza, Customer customer) {
        Order order = createOrderWithItems(
                beefLotSteaksVache,
                beefLotCoteVeau,
                honeyLotMielDeSapin,
                honeyLotMielDeColza);
        order.setCustomer(customer);
        productionRepository.saveAll(order.getItems().stream().map(OrderItem::getPackageLot).map(PackageLot::getProduction).toList());
        packageLotRepository.saveAll(order.getItems().stream().map(OrderItem::getPackageLot).distinct().toList());
        return order;
    }

    public Order createOrder() {
        Customer customer = createAndSaveCustomer();
        Producer beefProducer = createAndSaveProducer();
        Producer honeyProducer = createAndSaveProducer();

        PackageLot beefLotSteaksVache = createBeefPackageLot(beefProducer, "steaks de vache", 5, 0);
        PackageLot beefLotCoteVeau = createBeefPackageLot(beefProducer, "côte de veau", 5, 0);
        PackageLot honeyLotMielDeSapin = getHoneyPackageLot(honeyProducer, "miel de sapin", 5, 0);
        PackageLot honeyLotMielDeColza = getHoneyPackageLot(honeyProducer, "miel de colza", 5, 0);

        return createOrder(beefLotSteaksVache, beefLotCoteVeau, honeyLotMielDeSapin, honeyLotMielDeColza, customer);
    }

    public Producer createAndSaveProducer() {
        Producer producer = new Producer();
        producerRepository.save(producer);
        return producer;
    }

    public Customer createAndSaveCustomer() {
        User user = new User();
        user.setEmail("customer@address.mail");
        userRepository.save(user);

        Customer customer = new Customer();
        customer.setUser(user);
        customerRepository.save(customer);
        return customer;
    }

}
