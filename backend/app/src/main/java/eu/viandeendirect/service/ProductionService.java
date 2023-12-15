package eu.viandeendirect.service;

import eu.viandeendirect.api.ProductionsApiDelegate;
import eu.viandeendirect.model.PackageLot;
import eu.viandeendirect.model.Producer;
import eu.viandeendirect.model.Production;
import eu.viandeendirect.repository.PackageLotRepository;
import eu.viandeendirect.repository.ProductionRepository;
import eu.viandeendirect.service.specs.ProducerServiceSpecs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@Service
public class ProductionService implements ProductionsApiDelegate {

    @Autowired
    ProductionRepository productionRepository;

    @Autowired
    PackageLotRepository packageLotRepository;

    @Autowired
    ProducerServiceSpecs producerService;

    @Override
    public ResponseEntity<List<Production>> getProductions(Boolean forSale) {
        Producer producer = producerService.getAuthenticatedProducer();
        List<Production> productions = productionRepository.findByProducer(producer);
        return new ResponseEntity<>(productions, OK);
    }

    @Override
    public ResponseEntity<Integer> getProductionPercentageSold(Integer productionId) {
        Production production = productionRepository.findById(productionId).get();
        List<PackageLot> lots = packageLotRepository.findByProduction(production);
        Float initialQuantityToSell = lots.stream()
                .map(lot -> lot.getQuantity() * lot.getNetWeight())
                .reduce((quantity1, quantity2) -> quantity1 + quantity2).get();
        Float quantitySold = lots.stream()
                .map(lot -> lot.getQuantitySold() * lot.getNetWeight())
                .reduce((quantity1, quantity2) -> quantity1 + quantity2).get();
        Float percentageSold = quantitySold / initialQuantityToSell * 100;
        Integer roundedPercentageSold = Math.round(percentageSold);
        return new ResponseEntity<>(roundedPercentageSold, OK);
    }

}