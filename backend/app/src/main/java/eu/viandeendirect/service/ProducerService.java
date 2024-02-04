package eu.viandeendirect.service;

import eu.viandeendirect.api.ProducersApiDelegate;
import eu.viandeendirect.model.Producer;
import eu.viandeendirect.model.Sale;
import eu.viandeendirect.repository.ProducerRepository;
import eu.viandeendirect.repository.SaleRepository;
import eu.viandeendirect.service.specs.AuthenticationProducerServiceSpecs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.http.HttpStatus.*;

@Service
public class ProducerService implements ProducersApiDelegate {

    @Autowired
    ProducerRepository producerRepository;

    @Autowired
    SaleRepository saleRepository;

    @Autowired
    AuthenticationProducerServiceSpecs producerService;

    @Override
    public ResponseEntity<Sale> createProducerSale(Integer producerId, Sale sale) {
        Producer producer = producerService.getAuthenticatedProducer();
        if (!producer.getId().equals(producerId)) {
            return new ResponseEntity<>(FORBIDDEN);
        }
        sale.setSeller(producer);
        return new ResponseEntity<>(saleRepository.save(sale), CREATED);
    }

    @Override
    public ResponseEntity<Producer> getProducer(String email) {
        Producer producer = producerRepository.findByEmail(email).orElseThrow();
        return new ResponseEntity<>(producer, OK);
    }

    @Override
    public ResponseEntity<List<Sale>> getProducerSales(Integer producerId) {
        Producer producer = producerService.getAuthenticatedProducer();
        if (!producer.getId().equals(producerId)) {
            return new ResponseEntity<>(FORBIDDEN);
        }
        List<Sale> sales = new ArrayList<>();
        saleRepository.findBySeller(producer).forEach(sales::add);;
        return new ResponseEntity<>(sales, OK);
    }
}
