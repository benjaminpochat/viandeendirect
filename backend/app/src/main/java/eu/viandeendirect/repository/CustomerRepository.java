package eu.viandeendirect.repository;

import eu.viandeendirect.model.Customer;
import eu.viandeendirect.model.Producer;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CustomerRepository extends CrudRepository<Customer, Long> {
    @Query("""
            SELECT c FROM OrderItem oi
            INNER JOIN oi.order o
            INNER JOIN o.customer c
            INNER JOIN oi.packageLot pl
            INNER JOIN pl.production p
            WHERE p.producer = :producer""")
    List<Customer> findByProducer(@Param("producer") Producer producer);
}
