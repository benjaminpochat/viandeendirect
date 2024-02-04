package eu.viandeendirect.service;

import eu.viandeendirect.api.CustomersApiDelegate;
import eu.viandeendirect.model.Customer;
import eu.viandeendirect.model.Producer;
import eu.viandeendirect.repository.CustomerRepository;
import eu.viandeendirect.repository.UserRepository;
import eu.viandeendirect.service.specs.AuthenticationProducerServiceSpecs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService implements CustomersApiDelegate {

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    AuthenticationProducerServiceSpecs producerService;


    @Override
    public ResponseEntity<Customer> createCustomer(Customer customer) {
        userRepository.save(customer.getUser());
        return new ResponseEntity<>(customerRepository.save(customer), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<Customer>> getCustomers() {
        Producer producer = producerService.getAuthenticatedProducer();
        return new ResponseEntity<>(customerRepository.findByProducer(producer), HttpStatus.OK);
    }


}
