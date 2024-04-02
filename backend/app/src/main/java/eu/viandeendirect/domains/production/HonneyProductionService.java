package eu.viandeendirect.domains.production;

import eu.viandeendirect.api.HonneyProductionsApiDelegate;
import eu.viandeendirect.model.HonneyProduction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class HonneyProductionService implements HonneyProductionsApiDelegate {

    @Autowired
    ProductionRepository productionRepository;

    @Override
    public ResponseEntity<HonneyProduction> getHonneyProduction(Integer honneyProductionId) {
        return new ResponseEntity(productionRepository.findById(honneyProductionId).get(), HttpStatus.OK);
    }
}
