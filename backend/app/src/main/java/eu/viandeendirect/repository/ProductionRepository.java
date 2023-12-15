package eu.viandeendirect.repository;

import eu.viandeendirect.model.Producer;
import eu.viandeendirect.model.Production;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductionRepository extends CrudRepository<Production, Integer> {
    @Query("SELECT p FROM Production p WHERE p.producer = :producer")
    List<Production> findByProducer(@Param("producer") Producer producer);

    @Query("select p from Production p inner join p.sales sales where sales.id = :saleId")
    List<Production> findBySalesId(@Param("saleId") Integer saleId);
}