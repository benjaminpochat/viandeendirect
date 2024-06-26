package eu.viandeendirect.domains.production;

import eu.viandeendirect.model.Producer;
import eu.viandeendirect.model.Production;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductionRepository extends CrudRepository<Production, Integer> {
    @Query("select p from Production p where p.producer = :producer")
    List<Production> findByProducer(@Param("producer") Producer producer);

    @Query("select p from Sale s inner join s.productions p where s.id = :saleId")
    List<Production> findBySaleId(@Param("saleId") Integer saleId);
}