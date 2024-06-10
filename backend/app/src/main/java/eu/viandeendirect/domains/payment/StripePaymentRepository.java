package eu.viandeendirect.domains.payment;

import eu.viandeendirect.model.StripePayment;
import org.springframework.data.repository.CrudRepository;

public interface StripePaymentRepository extends CrudRepository<StripePayment, Integer> {
}
