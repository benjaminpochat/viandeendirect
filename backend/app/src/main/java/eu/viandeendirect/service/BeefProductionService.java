package eu.viandeendirect.service;

import eu.viandeendirect.api.BeefProductionsApiDelegate;
import eu.viandeendirect.model.BeefProduction;
import eu.viandeendirect.repository.ProductionRepository;
import eu.viandeendirect.service.specs.AuthenticationServiceSpecs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class BeefProductionService implements BeefProductionsApiDelegate {

    @Autowired
    ProductionRepository productionRepository;

    @Autowired
    AuthenticationServiceSpecs producerService;

    @Override
    public ResponseEntity<BeefProduction> getBeefProduction(Integer beefProductionId) {
        return new ResponseEntity(productionRepository.findById(beefProductionId).get(), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<BeefProduction> createBeefProduction(BeefProduction beefProduction) {
        beefProduction.setProducer(producerService.getAuthenticatedProducer());
        BeefProduction productionCreated = productionRepository.save(beefProduction);
        return new ResponseEntity<>(productionCreated, HttpStatus.CREATED);
    }
}
