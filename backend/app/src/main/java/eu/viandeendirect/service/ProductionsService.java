package eu.viandeendirect.service;

import eu.viandeendirect.api.ProductionsApiDelegate;
import eu.viandeendirect.model.Producer;
import eu.viandeendirect.model.Production;
import eu.viandeendirect.model.User;
import eu.viandeendirect.repository.ProductionRepository;
import eu.viandeendirect.repository.ProducerRepository;
import eu.viandeendirect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class ProductionsService implements ProductionsApiDelegate {

    @Autowired
    ProductionRepository productionRepository;

    @Autowired
    ProducerRepository producerRepository;

    @Autowired
    ProducerRepository growerRepository;

    @Override
    public ResponseEntity<Void> createProduction(Production production) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((JwtAuthenticationToken)authentication).getToken().getClaimAsString("email");
        Producer producer = producerRepository.findByEmail(email).orElseThrow();
        production.setProducer(producer);
        productionRepository.save(production);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
