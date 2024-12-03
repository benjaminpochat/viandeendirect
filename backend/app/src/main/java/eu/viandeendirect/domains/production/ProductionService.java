package eu.viandeendirect.domains.production;

import eu.viandeendirect.api.ProductionsApiDelegate;
import eu.viandeendirect.domains.user.ProducerPublicDataService;
import eu.viandeendirect.model.Image;
import eu.viandeendirect.model.PackageLot;
import eu.viandeendirect.model.Producer;
import eu.viandeendirect.model.Production;
import eu.viandeendirect.security.specs.AuthenticationServiceSpecs;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.OK;

@Service
public class ProductionService implements ProductionsApiDelegate {

    @Autowired
    ProductionRepository productionRepository;

    @Autowired
    PackageLotRepository packageLotRepository;

    @Autowired
    AuthenticationServiceSpecs authenticationService;

    @Autowired
    ProducerPublicDataService producerPublicDataService;

    @Override
    public ResponseEntity<List<Production>> getProductions(Boolean forSale) {
        Producer producer = authenticationService.getAuthenticatedProducer();
        List<Production> productions = productionRepository.findByProducer(producer);
        return new ResponseEntity<>(productions, OK);
    }

    @Override
    public ResponseEntity<Integer> getProductionPercentageSold(Integer productionId) {
        Production production = productionRepository.findById(productionId).get();
        List<PackageLot> lots = packageLotRepository.findByProduction(production);
        Float initialQuantityToSell = lots.stream()
                .map(lot -> lot.getQuantity() * lot.getNetWeight())
                .reduce((quantity1, quantity2) -> quantity1 + quantity2).orElse(0f);
        Float quantitySold = lots.stream()
                .map(lot -> lot.getQuantitySold() * lot.getNetWeight())
                .reduce((quantity1, quantity2) -> quantity1 + quantity2).orElse(0f);
        Float percentageSold = quantitySold / initialQuantityToSell * 100;
        Integer roundedPercentageSold = Math.round(percentageSold);
        return new ResponseEntity<>(roundedPercentageSold, OK);
    }

    @Override
    public ResponseEntity<Producer> getProductionProducerPublicData(Integer productionId) {
        Production production = productionRepository.findById(productionId).get();
        Producer producer = production.getProducer();
        var producerWithPublicData = producerPublicDataService.getProducerWithOnlyPublicData(producer);
        return new ResponseEntity<>(producerWithPublicData, OK);
    }

    @Override
    public ResponseEntity<Image> getProductLotPhoto(Integer productionId, Integer lotId) {
        PackageLot lot = packageLotRepository.findById(lotId).get();
        if (!lot.getProduction().getId().equals(productionId)) {
            return new ResponseEntity<>(BAD_REQUEST);
        }
        Image photo = Hibernate.unproxy(lot.getPhoto(), Image.class);
        return new ResponseEntity<>(Objects.requireNonNullElseGet(photo, Image::new), OK);
    }
}
