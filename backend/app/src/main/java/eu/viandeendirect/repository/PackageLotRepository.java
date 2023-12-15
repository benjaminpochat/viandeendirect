package eu.viandeendirect.repository;

import eu.viandeendirect.model.PackageLot;
import eu.viandeendirect.model.Production;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PackageLotRepository extends CrudRepository<PackageLot, Long> {
    @Query("SELECT l FROM PackageLot l WHERE l.production = :production")
    List<PackageLot> findByProduction(@Param("production") Production production);
}
