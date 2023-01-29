package eu.viandeendirect.api;

import eu.viandeendirect.api.DeliveriesApiDelegate;
import eu.viandeendirect.model.Delivery;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public class DeliveriesApiImpl implements DeliveriesApiDelegate {

    @Override
    public ResponseEntity<List<Delivery>> deliveriesGet() {
        var delivery = new Delivery();
        delivery.setId(UUID.fromString("1234"));
        delivery.setName("Hello !");
        return ResponseEntity.of(Optional.of(List.of(delivery)));
    }
}
