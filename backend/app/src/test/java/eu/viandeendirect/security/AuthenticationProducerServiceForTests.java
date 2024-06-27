package eu.viandeendirect.security;

import eu.viandeendirect.model.Customer;
import eu.viandeendirect.model.Producer;
import eu.viandeendirect.model.User;
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
        customer.setId(4000);
        User user = new User();
        user.setId(4000);
        user.setFirstName("Freddy");
        user.setLastName("MERCURY");
        user.setPhone("0305060708");
        user.setEmail("freddy.mercury@address.mail");
        customer.setUser(user);
        return customer;
    }
}
