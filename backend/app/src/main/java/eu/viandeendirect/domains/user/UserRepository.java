package eu.viandeendirect.domains.user;

import eu.viandeendirect.model.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends CrudRepository<User, Integer> {

    @Query("SELECT u FROM User u WHERE email = :email")
    Optional<User> findByEmail(@Param("email") String email);
}
