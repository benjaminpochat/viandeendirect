package eu.viandeendirect.domains.production;

import eu.viandeendirect.domains.order.OrderItemRepository;
import eu.viandeendirect.model.OrderItem;
import eu.viandeendirect.model.PackageLot;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static eu.viandeendirect.model.OrderStatus.*;

@Service
public class PackageLotQuantitySoldService {
    @Autowired
    OrderItemRepository orderItemRepository;

    @Autowired
    PackageLotRepository packageLotRepository;

    public void updateQuantitySold(PackageLot packageLot) {
        var packageLotLoaded = packageLotRepository.findById(packageLot.getId()).get();
        int quantitySold = orderItemRepository.findByPackageLot(packageLotLoaded).stream()
                .filter(orderItem -> List.of(PAYMENT_COMPLETED, PAYMENT_PENDING, BOOKED_WITHOUT_PAYMENT, DELIVERED).contains(orderItem.getOrder().getStatus()))
                .mapToInt(OrderItem::getQuantity)
                .sum();
        packageLotLoaded.setQuantitySold(quantitySold);
        packageLotRepository.save(packageLotLoaded);
    }
}
