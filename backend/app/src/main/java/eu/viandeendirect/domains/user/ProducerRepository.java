package eu.viandeendirect.domains.user;

import eu.viandeendirect.model.Producer;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProducerRepository extends CrudRepository<Producer, Integer> {

    @Query("""
            SELECT p FROM Producer p
            INNER JOIN p.user u
            WHERE u.email = :email""")
    Optional<Producer> findByEmail(@Param("email") String email);
}