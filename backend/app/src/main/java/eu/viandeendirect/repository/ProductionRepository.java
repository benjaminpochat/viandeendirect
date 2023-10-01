package eu.viandeendirect.repository;

import eu.viandeendirect.model.Producer;
import eu.viandeendirect.model.Production;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductionRepository extends CrudRepository<Production, Long> {

    @Query("SELECT p FROM Production p WHERE p.producer = :producer")
    List<Production> findByProducer(@Param("producer") Producer producer);
}