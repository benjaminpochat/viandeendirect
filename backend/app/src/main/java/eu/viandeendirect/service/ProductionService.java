package eu.viandeendirect.service;

import eu.viandeendirect.api.ProductionsApiDelegate;
import eu.viandeendirect.model.PackageLot;
import eu.viandeendirect.model.Producer;
import eu.viandeendirect.model.Production;
import eu.viandeendirect.model.Sale;
import eu.viandeendirect.repository.PackageLotRepository;
import eu.viandeendirect.repository.ProductionRepository;
import eu.viandeendirect.service.specs.ProducerServiceSpecs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
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
    public ResponseEntity<BigDecimal> getProductionPercentageSold(String productionId) {
        Production production = productionRepository.findById(Long.valueOf(productionId)).get();
        List<PackageLot> lots = packageLotRepository.findByProduction(production);
        BigDecimal initialQuantityToSell = lots.stream()
                .map(lot -> lot.getQuantity().multiply(lot.getNetWeight()))
                .reduce((quantity1, quantity2) -> quantity1.add(quantity2)).get();
        BigDecimal quantitySold = lots.stream()
                .map(lot -> lot.getQuantitySold().multiply(lot.getNetWeight()))
                .reduce((quantity1, quantity2) -> quantity1.add(quantity2)).get();
        BigDecimal percentageSold = quantitySold.divide(initialQuantityToSell, new MathContext(2, RoundingMode.HALF_UP)).multiply(BigDecimal.valueOf(100));
        return new ResponseEntity<>(percentageSold, OK);
    }

}
