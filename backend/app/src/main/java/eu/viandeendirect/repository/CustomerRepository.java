package eu.viandeendirect.repository;

import eu.viandeendirect.model.Customer;
import org.springframework.data.repository.CrudRepository;

public interface CustomerRepository extends CrudRepository<Customer, Long> {
}
