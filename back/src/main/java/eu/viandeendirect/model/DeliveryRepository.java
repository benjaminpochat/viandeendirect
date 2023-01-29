package eu.viandeendirect.model;

import eu.viandeendirect.model.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface DeliveryRepository extends CrudRepository<Delivery, UUID> {
}