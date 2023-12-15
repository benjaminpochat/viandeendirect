package eu.viandeendirect.service;

import eu.viandeendirect.api.SalesApiDelegate;
import eu.viandeendirect.model.Order;
import eu.viandeendirect.model.Production;
import eu.viandeendirect.model.Sale;
import eu.viandeendirect.repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class SaleService implements SalesApiDelegate {

    @Autowired
    SaleRepository saleRepository;

    @Override
    public ResponseEntity<List<Sale>> getSales() {
        List sales = StreamSupport.stream(saleRepository.findAll().spliterator(), false)
                .collect(Collectors.toList());
        return new ResponseEntity<>(sales, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Void> createSale(Sale sale) {
        return SalesApiDelegate.super.createSale(sale);
    }

    @Override
    public ResponseEntity<Void> deleteSale(String saleId) {
        return SalesApiDelegate.super.deleteSale(saleId);
    }

    @Override
    public ResponseEntity<Sale> getSale(String saleId) {
        return SalesApiDelegate.super.getSale(saleId);
    }

    @Override
    public ResponseEntity<List<Order>> getSaleOrders(String saleId) {
        return SalesApiDelegate.super.getSaleOrders(saleId);
    }

    @Override
    public ResponseEntity<List<Production>> getSaleProductins(String saleId) {
        return SalesApiDelegate.super.getSaleProductins(saleId);
    }

    @Override
    public ResponseEntity<Void> updateSale(String saleId, Sale sale) {
        return SalesApiDelegate.super.updateSale(saleId, sale);
    }
}
