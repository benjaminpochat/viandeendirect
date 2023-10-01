package eu.viandeendirect.service;

import eu.viandeendirect.api.HonneyProductionsApiDelegate;
import eu.viandeendirect.model.HonneyProduction;
import eu.viandeendirect.repository.ProductionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class HonneyProductionsService implements HonneyProductionsApiDelegate {

    @Autowired
    ProductionRepository productionRepository;

    @Override
    public ResponseEntity<HonneyProduction> getHonneyProduction(String honneyProductionId) {
        return new ResponseEntity(productionRepository.findById(Long.valueOf(honneyProductionId)).get(), HttpStatus.OK);
    }
}
