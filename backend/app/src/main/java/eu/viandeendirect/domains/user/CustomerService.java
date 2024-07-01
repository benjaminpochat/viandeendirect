package eu.viandeendirect.domains.user;

import eu.viandeendirect.api.CustomersApiDelegate;
import eu.viandeendirect.model.Customer;
import eu.viandeendirect.security.specs.AuthenticationServiceSpecs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.*;

@Service
public class CustomerService implements CustomersApiDelegate {

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    ProducerRepository producerRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    AuthenticationServiceSpecs authenticationService;


    @Override
    public ResponseEntity<Customer> createCustomer(Customer customer) {
        userRepository.save(customer.getUser());
        return new ResponseEntity<>(customerRepository.save(customer), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Customer> getCustomer(String email) {
        Customer customer = authenticationService.getAuthenticatedCustomer();
        if (customer == null) {
            var producer = producerRepository.findByEmail(email);
            if (producer.isPresent()) {
                throw new ResponseStatusException(CONFLICT);
            } else {
                return new ResponseEntity<>(NO_CONTENT);
            }
        }
        if (!customer.getUser().getEmail().equals(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }


}
