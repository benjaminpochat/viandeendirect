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

import java.util.List;

@Service
public class ProductionsService implements ProductionsApiDelegate {

    @Autowired
    ProductionRepository productionRepository;

    @Autowired
    ProducerRepository producerRepository;

    @Override
    public ResponseEntity<Void> createProduction(Production production) {
        Producer producer = getAuthenticatedProducer();
        production.setProducer(producer);
        productionRepository.save(production);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<Production>> getProductions(Boolean forSale) {
        Producer producer = getAuthenticatedProducer();
        List<Production> productions = productionRepository.findByProducer(producer);
        return new ResponseEntity<>(productions, HttpStatus.OK);
    }

    private Producer getAuthenticatedProducer() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((JwtAuthenticationToken)authentication).getToken().getClaimAsString("email");
        Producer producer = producerRepository.findByEmail(email).orElseThrow();
        return producer;
    }
}
