package eu.viandeendirect.repository;

import eu.viandeendirect.model.Delivery;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface DeliveryRepository extends CrudRepository<Delivery, UUID> {
}