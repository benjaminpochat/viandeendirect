package eu.viandeendirect.domains.payment;

import eu.viandeendirect.model.StripeAccount;
import org.springframework.data.repository.CrudRepository;

public interface StripeAccountRepository extends CrudRepository<StripeAccount, Integer> {
}
