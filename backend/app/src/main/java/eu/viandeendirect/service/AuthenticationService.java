package eu.viandeendirect.service;

import eu.viandeendirect.model.Customer;
import eu.viandeendirect.model.Producer;
import eu.viandeendirect.repository.CustomerRepository;
import eu.viandeendirect.repository.ProducerRepository;
import eu.viandeendirect.service.specs.AuthenticationServiceSpecs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@Profile("!test")
public class AuthenticationService implements AuthenticationServiceSpecs {

    @Autowired
    ProducerRepository producerRepository;

    @Autowired
    CustomerRepository customerRepository;

    @Override
    public Producer getAuthenticatedProducer() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((JwtAuthenticationToken)authentication).getToken().getClaimAsString("email");
        Producer producer = producerRepository.findByEmail(email).orElse(null);
        return producer;
    }

    @Override
    public Customer getAuthenticatedCustomer() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((JwtAuthenticationToken)authentication).getToken().getClaimAsString("email");
        Customer customer = customerRepository.findByEmail(email).orElse(null);
        return customer;
    }
}
