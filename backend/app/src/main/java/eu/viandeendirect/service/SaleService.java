package eu.viandeendirect.service;

import eu.viandeendirect.api.SalesApiDelegate;
import eu.viandeendirect.model.*;
import eu.viandeendirect.repository.OrderRepository;
import eu.viandeendirect.repository.ProductionRepository;
import eu.viandeendirect.repository.SaleRepository;
import eu.viandeendirect.service.specs.ProducerServiceSpecs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

@Service
public class SaleService implements SalesApiDelegate {

    @Autowired
    SaleRepository saleRepository;

    @Autowired
    ProducerServiceSpecs producerService;

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ProductionRepository productionRepository;

    @Override
    public ResponseEntity<List<Sale>> getSales() {
        Producer producer = producerService.getAuthenticatedProducer();
        List<Sale> sales = new ArrayList<>();
        saleRepository.findBySeller(producer).forEach(sales::add);;
        return new ResponseEntity<>(sales, OK);
    }

    @Override
    public ResponseEntity<Sale> createSale(Sale sale) {
        sale.setSeller(producerService.getAuthenticatedProducer());
        return new ResponseEntity<>(saleRepository.save(sale), CREATED);
    }

    @Override
    public ResponseEntity<Sale> getSale(Integer saleId) {
        Sale sale = saleRepository.findById(saleId).get();
        return new ResponseEntity<>(sale, OK);
    }

    @Override
    public ResponseEntity<List<Order>> getSaleOrders(Integer saleId) {
        return new ResponseEntity<>(orderRepository.findBySaleId(saleId), OK);
    }

    @Override
    public ResponseEntity<List<Production>> getSaleProductions(Integer saleId) {
        return new ResponseEntity<>(productionRepository.findBySalesId(saleId), OK);
    }
}
