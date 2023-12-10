package eu.viandeendirect.service;

import eu.viandeendirect.api.CustomersApiDelegate;
import eu.viandeendirect.model.Customer;
import eu.viandeendirect.model.User;
import eu.viandeendirect.repository.CustomerRepository;
import eu.viandeendirect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomersService implements CustomersApiDelegate {

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    UserRepository userRepository;

    @Override
    public ResponseEntity<Customer> createCustomer(Customer customer) {
        userRepository.save(customer.getUser());
        return new ResponseEntity<>(customerRepository.save(customer), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<Customer>> getCustomers() {
        return CustomersApiDelegate.super.getCustomers();
    }


}
