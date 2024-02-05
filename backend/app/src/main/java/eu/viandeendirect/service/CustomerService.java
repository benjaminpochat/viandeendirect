package eu.viandeendirect.service;

import eu.viandeendirect.api.CustomersApiDelegate;
import eu.viandeendirect.model.Customer;
import eu.viandeendirect.repository.CustomerRepository;
import eu.viandeendirect.repository.UserRepository;
import eu.viandeendirect.service.specs.AuthenticationServiceSpecs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class CustomerService implements CustomersApiDelegate {

    @Autowired
    CustomerRepository customerRepository;

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
            return new ResponseEntity<>(NOT_FOUND);
        }
        if (customer.getUser().getEmail().equals(email)) {
            return new ResponseEntity<>(FORBIDDEN);
        }
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }


}
