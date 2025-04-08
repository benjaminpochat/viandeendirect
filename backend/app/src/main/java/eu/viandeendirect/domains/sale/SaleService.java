package eu.viandeendirect.domains.sale;

import eu.viandeendirect.api.SalesApiDelegate;
import eu.viandeendirect.domains.order.OrderInvoiceService;
import eu.viandeendirect.domains.order.OrderLabelService;
import eu.viandeendirect.domains.production.BeefProductionRepository;
import eu.viandeendirect.model.*;
import eu.viandeendirect.domains.order.OrderRepository;
import eu.viandeendirect.domains.production.ProductionRepository;
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

import static org.springframework.http.HttpStatus.OK;

@Service
public class SaleService implements SalesApiDelegate {

    private static final Logger LOGGER = LoggerFactory.getLogger(SaleService.class);

    @Autowired
    SaleRepository saleRepository;

    @Autowired
    AuthenticationServiceSpecs producerService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductionRepository productionRepository;

    @Autowired
    private OrderLabelService orderLabelService;

    @Autowired
    private BeefProductionRepository beefProductionRepository;

    @Autowired
    private OrderInvoiceService orderInvoiceService;

    @Override
    public ResponseEntity<Sale> getSale(Integer saleId) {
        Sale sale = saleRepository.findById(saleId).get();
        return new ResponseEntity<>(sale, OK);
    }

    @Override
    public ResponseEntity<List<Sale>> getSales(String privateAccessKey) {
        List<Sale> sales = new ArrayList<>();
        if (privateAccessKey == null || privateAccessKey.isBlank()) {
            saleRepository.findByPrivateAccessKeyIgnoreCase("").forEach(sales::add);
        } else {
            saleRepository.findByPrivateAccessKeyIgnoreCase(privateAccessKey).forEach(sales::add);
        }
        List publishedSales = sales.stream().filter(sale -> sale.getPublishedToCustomers() != null && sale.getPublishedToCustomers()).toList();
        return new ResponseEntity<>(publishedSales, OK);
    }

    @Override
    public ResponseEntity<List<Order>> getSaleOrders(Integer saleId) {
        return new ResponseEntity<>(orderRepository.findBySaleId(saleId), OK);
    }

    @Override
    public ResponseEntity<List<Production>> getSaleProductions(Integer saleId) {
        return new ResponseEntity<>(productionRepository.findBySaleId(saleId), OK);
    }

    @Override
    public ResponseEntity<Resource> getSaleOrdersSummaries(Integer saleId) {
        Sale sale = saleRepository.findById(saleId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        try {
            ByteArrayOutputStream pdf = orderLabelService.generatePDF(sale);
            return new ResponseEntity<>(new ByteArrayResource(pdf.toByteArray()), HttpStatus.OK);
        } catch (IOException e) {
            LOGGER.error("Error generating summaries as pdf for sale", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Resource> getSaleOrdersInvoices(Integer saleId) {
        Sale sale = saleRepository.findById(saleId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        try {
            ByteArrayOutputStream pdf = orderInvoiceService.generatePDF(sale);
            return new ResponseEntity<>(new ByteArrayResource(pdf.toByteArray()), HttpStatus.OK);
        } catch (IOException e) {
            LOGGER.error("Error generating summaries as pdf for sale", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
