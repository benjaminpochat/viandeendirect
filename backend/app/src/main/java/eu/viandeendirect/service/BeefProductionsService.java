package eu.viandeendirect.service;

import eu.viandeendirect.api.BeefProductionsApiDelegate;
import eu.viandeendirect.model.BeefProduction;
import eu.viandeendirect.repository.ProductionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class BeefProductionsService implements BeefProductionsApiDelegate {

    @Autowired
    ProductionRepository productionRepository;

    @Override
    public ResponseEntity<BeefProduction> getBeefProduction(String beefProductionId) {
        return new ResponseEntity(productionRepository.findById(Long.valueOf(beefProductionId)).get(), HttpStatus.OK);
    }
}
