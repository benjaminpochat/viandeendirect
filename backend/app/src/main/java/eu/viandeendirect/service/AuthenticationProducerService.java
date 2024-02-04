package eu.viandeendirect.service;

import eu.viandeendirect.api.ProducersApiDelegate;
import eu.viandeendirect.model.Producer;
import eu.viandeendirect.model.Sale;
import eu.viandeendirect.repository.ProducerRepository;
import eu.viandeendirect.repository.SaleRepository;
import eu.viandeendirect.service.specs.AuthenticationProducerServiceSpecs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import static org.springframework.http.HttpStatus.CREATED;

@Service
@Profile("!test")
public class AuthenticationProducerService implements AuthenticationProducerServiceSpecs {

    @Autowired
    ProducerRepository producerRepository;

    @Override
    public Producer getAuthenticatedProducer() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((JwtAuthenticationToken)authentication).getToken().getClaimAsString("email");
        Producer producer = producerRepository.findByEmail(email).orElseThrow();
        return producer;
    }
}
