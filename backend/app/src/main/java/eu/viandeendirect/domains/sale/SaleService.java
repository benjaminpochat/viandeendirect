package eu.viandeendirect.domains.sale;

import eu.viandeendirect.api.SalesApiDelegate;
import eu.viandeendirect.model.*;
import eu.viandeendirect.domains.order.OrderRepository;
import eu.viandeendirect.domains.production.ProductionRepository;
import eu.viandeendirect.security.specs.AuthenticationServiceSpecs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@Service
public class SaleService implements SalesApiDelegate {

    @Autowired
    SaleRepository saleRepository;

    @Autowired
    AuthenticationServiceSpecs producerService;

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ProductionRepository productionRepository;

    @Override
    public ResponseEntity<Sale> getSale(Integer saleId) {
        Sale sale = saleRepository.findById(saleId).get();
        return new ResponseEntity<>(sale, OK);
    }

    @Override
    public ResponseEntity<List<Sale>> getSales() {
        List<Sale> sales = new ArrayList<>();
        saleRepository.findAll().forEach(sales::add);
        return new ResponseEntity<>(sales, OK);
    }

    @Override
    public ResponseEntity<List<Order>> getSaleOrders(Integer saleId) {
        return new ResponseEntity<>(orderRepository.findBySaleId(saleId), OK);
    }

    @Override
    public ResponseEntity<List<Production>> getSaleProductions(Integer saleId) {
        return new ResponseEntity<>(productionRepository.findBySaleId(saleId), OK);
    }
}
