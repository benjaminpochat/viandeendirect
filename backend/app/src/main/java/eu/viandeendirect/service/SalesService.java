package eu.viandeendirect.service;

import eu.viandeendirect.api.SalesApiDelegate;
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
public class SalesService implements SalesApiDelegate {

    @Autowired
    SaleRepository saleRepository;

    @Override
    public ResponseEntity<List<Sale>> getSales() {
        List sales = StreamSupport.stream(saleRepository.findAll().spliterator(), false)
                .collect(Collectors.toList());
        return new ResponseEntity<>(sales, HttpStatus.OK);
    }
}
