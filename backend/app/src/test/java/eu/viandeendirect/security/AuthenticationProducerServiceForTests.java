package eu.viandeendirect.security;

import eu.viandeendirect.model.Customer;
import eu.viandeendirect.model.Producer;
import eu.viandeendirect.security.specs.AuthenticationServiceSpecs;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile("test")
public class AuthenticationProducerServiceForTests implements AuthenticationServiceSpecs {

    @Override
    public Producer getAuthenticatedProducer() {
        var producer = new Producer();
        producer.setId(1000);
        return producer;
    }

    @Override
    public Customer getAuthenticatedCustomer() {
        var customer = new Customer();
        customer.setId(1000);
        return customer;
    }
}
