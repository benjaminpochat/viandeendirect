package eu.viandeendirect.service;

import eu.viandeendirect.api.BeefProductionsApiDelegate;
import eu.viandeendirect.model.BeefProduction;
import eu.viandeendirect.model.PackageLot;
import eu.viandeendirect.model.Production;
import eu.viandeendirect.model.Sale;
import eu.viandeendirect.repository.PackageLotRepository;
import eu.viandeendirect.repository.ProductionRepository;
import eu.viandeendirect.repository.SaleRepository;
import eu.viandeendirect.service.specs.AuthenticationServiceSpecs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BeefProductionService implements BeefProductionsApiDelegate {

    @Autowired
    ProductionRepository productionRepository;

    @Autowired
    PackageLotRepository packageLotRepository;

    @Autowired
    AuthenticationServiceSpecs producerService;
    @Autowired
    private SaleRepository saleRepository;

    @Override
    public ResponseEntity<BeefProduction> getBeefProduction(Integer beefProductionId) {
        Production production = productionRepository.findById(beefProductionId).get();
        production.setLots(packageLotRepository.findByProduction(production));
        return new ResponseEntity(production, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<BeefProduction> createBeefProduction(BeefProduction beefProduction) {
        checkBeefProduction(beefProduction);
        beefProduction.setProducer(producerService.getAuthenticatedProducer());
        BeefProduction productionCreated = productionRepository.save(beefProduction);
        beefProduction.getLots().forEach(lot -> lot.setProduction(productionCreated));
        Iterable<PackageLot> lotsCreated = packageLotRepository.saveAll(beefProduction.getLots());
        List<PackageLot> lotsCreatedAsList = new ArrayList<>();
        lotsCreated.forEach(lotsCreatedAsList::add);
        productionCreated.setLots(lotsCreatedAsList);
        return new ResponseEntity<>(productionCreated, HttpStatus.OK);
    }

    void checkBeefProduction(BeefProduction beefProduction) {
        if(beefProduction.getId() != null) {
            List<Sale> sales = saleRepository.findByProduction(beefProduction);
            if (!sales.isEmpty()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Il n'est pas possible de modifier une production déjà mise en vente.");
            }
        }
    }
}
