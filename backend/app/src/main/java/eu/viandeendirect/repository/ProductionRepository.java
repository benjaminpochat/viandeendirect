package eu.viandeendirect.repository;

import eu.viandeendirect.model.Delivery;
import eu.viandeendirect.model.Production;
import org.springframework.data.repository.CrudRepository;

public interface ProductionRepository extends CrudRepository<Production, Long> {
}