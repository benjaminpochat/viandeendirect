package eu.viandeendirect.domains.sale;

import eu.viandeendirect.model.Address;
import eu.viandeendirect.model.Producer;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends CrudRepository<Address, Integer> {
    @Query("SELECT a FROM Address a WHERE a.owner = :owner")
    List<Address> findByOwner(@Param("owner") Producer owner);
}
