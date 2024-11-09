package eu.viandeendirect.domains.production;

import eu.viandeendirect.api.BeefProductionsApiDelegate;
import eu.viandeendirect.domains.sale.SaleRepository;
import eu.viandeendirect.domains.user.ProducerRepository;
import eu.viandeendirect.model.BeefProduction;
import eu.viandeendirect.model.PackageLot;
import eu.viandeendirect.model.Sale;
import eu.viandeendirect.security.specs.AuthenticationServiceSpecs;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class BeefProductionService implements BeefProductionsApiDelegate {

    private static final Logger LOGGER = LoggerFactory.getLogger(BeefProductionService.class);

    @Autowired
    ProductionRepository productionRepository;

    @Autowired
    PackageLotRepository packageLotRepository;

    @Autowired
    AuthenticationServiceSpecs producerService;

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private ProducerRepository producerRepository;

    @Autowired
    private PackageElementLabelService packageElementLabelService;

    @Autowired
    private BeefProductionRepository beefProductionRepository;


    @Override
    public ResponseEntity<BeefProduction> getBeefProduction(Integer beefProductionId) {
        BeefProduction production = beefProductionRepository.findById(beefProductionId).get();
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

    @Override
    public ResponseEntity<Resource> getBeefProductionPackageElementsLabels(Integer beefProductionId) {
        BeefProduction beefProduction = beefProductionRepository.findById(beefProductionId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        try {
            ByteArrayOutputStream pdf = packageElementLabelService.generatePDF(
                    new PackageElementLabelService.Arguments(
                            beefProduction,
                            List.of("Bavette", "Bourguignon", "Côte", "Faux filet", "Filet", "Hachi", "Hampe", "Queue", "Jarret", "Joues", "Onglet", "Osso buco", "Paleron", "Pot-au-feu", "Rosbeef", "Roti", "Rumsteak", "Steaks", "Steaks burger")));
            return new ResponseEntity<>(new ByteArrayResource(pdf.toByteArray()), HttpStatus.OK);
        } catch (IOException e) {
            LOGGER.error("Error generating labels as pdf for package elements", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
