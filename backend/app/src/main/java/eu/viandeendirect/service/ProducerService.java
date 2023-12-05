package eu.viandeendirect.service;

import eu.viandeendirect.model.Producer;
import eu.viandeendirect.repository.ProducerRepository;
import eu.viandeendirect.service.specs.ProducerServiceSpecs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@Profile("!test")
public class ProducerService implements ProducerServiceSpecs {

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
