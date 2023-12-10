package eu.viandeendirect.repository;

import eu.viandeendirect.model.Order;
import org.springframework.data.repository.CrudRepository;

public interface OrderRepository extends CrudRepository<Order, Long> {
}
