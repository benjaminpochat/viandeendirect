package eu.viandeendirect.repository;

import eu.viandeendirect.model.Producer;
import eu.viandeendirect.model.Production;
import eu.viandeendirect.model.Sale;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SaleRepository extends CrudRepository<Sale, Integer> {
    @Query("select s from Sale s where s.seller = :seller")
    List<Sale> findBySeller(@Param("seller") Producer seller);

    @Query("""
                select s 
                from Sale s 
                inner join s.productions p
                where p = :production
                """)
    List<Sale> findByProduction(@Param("production") Production production);
}
