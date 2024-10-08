package eu.viandeendirect.domains.order;

import eu.viandeendirect.model.*;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

public class OrderTestUtils {

    public static BeefProduction getBeefProduction() {
        BeefProduction beefProduction = new BeefProduction();
        beefProduction.setAnimalType(BeefProduction.AnimalTypeEnum.COW);
        beefProduction.setCattleBreed(BeefProduction.CattleBreedEnum.LIMOUSINE);
        beefProduction.setAnimalIdentifier("FR5705563733");
        beefProduction.setBirthPlace("74940 Viuz-la-Chiesaz");
        beefProduction.setBirthFarm("La Ferme du Semnoz");
        beefProduction.setBirthDate(LocalDate.of(2018, 3, 23));
        beefProduction.setSlaughterPlace("74000 Annecy");
        beefProduction.setSlaughterHouse("Abattoir Birage");
        beefProduction.setSlaughterDate(LocalDate.of(2021, 9, 1));
        beefProduction.setCuttingPlace("74940 Gruffy");
        beefProduction.setCuttingButcher("Ets Fossioz");
        beefProduction.setCuttingDate(LocalDate.of(2021, 9, 15));
        beefProduction.setLabelRougeCertified(true);
        Producer producer = new Producer();
        Address address = new Address();
        address.setAddressLine1("2 rue des noyers");
        address.setZipCode("12345");
        address.setCity("Bouchy");
        User user = new User();
        user.setPhone("0102030405");
        producer.setAddress(address);
        producer.setLegalName("GAEC du Gros Noyer");
        producer.setLegalIdentificationNumber("123456AZERT");
        producer.setUser(user);
        beefProduction.setProducer(producer);
        return beefProduction;
    }

    public static PackageLot getPackageLot(Integer id, BeefProduction beefProduction, String label, String description, float netWeight) {
        PackageLot packageLot = new PackageLot();
        packageLot.setId(id);
        packageLot.setProduction(beefProduction);
        packageLot.setLabel(label);
        packageLot.setDescription(description);
        packageLot.setNetWeight(netWeight);
        return packageLot;
    }

    public static Order createOrder(int id, Customer customer, Map<PackageLot, Integer> items) {
        Order order = new Order();
        order.setId(1234);
        order.setCustomer(customer);
        AtomicInteger itemId = new AtomicInteger(0);
        order.setItems(
                items.entrySet()
                        .stream()
                        .sorted(Comparator.comparing(entry -> entry.getKey().getId()))
                        .map(entry -> {
                    OrderItem item = new OrderItem();
                    item.setId(itemId.addAndGet(1));
                    item.setPackageLot(entry.getKey());
                    item.setQuantity(entry.getValue());
                    item.setUnitPrice(10f);
                    return item;
                }).toList()
        );
        order.setStatus(OrderStatus.PAYMENT_COMPLETED);
        return order;
    }

    public static Customer createCustomer(String firstName, String lastName, String phone) {
        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPhone(phone);
        Customer customer = new Customer();
        customer.setUser(user);
        return customer;
    }
}
