package eu.viandeendirect.domains.user;

import eu.viandeendirect.api.ProducersApiDelegate;
import eu.viandeendirect.domains.payment.StripeService;
import eu.viandeendirect.domains.production.ProductionRepository;
import eu.viandeendirect.domains.sale.SaleRepository;
import eu.viandeendirect.model.*;
import eu.viandeendirect.security.specs.AuthenticationServiceSpecs;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import static org.springframework.http.HttpStatus.*;

@Service
public class ProducerService implements ProducersApiDelegate {

    private static final Logger LOGGER = LoggerFactory.getLogger(ProducerService.class);

    @Autowired
    ProducerRepository producerRepository;

    @Autowired
    SaleRepository saleRepository;

    @Autowired
    AuthenticationServiceSpecs authenticationService;

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    StripeService stripeService;

    @Autowired
    ProducerPublicDataService producerPublicDataService;

    @Autowired
    private ProductionRepository productionRepository;

    @Override
    public ResponseEntity<Sale> createProducerSale(Integer producerId, Sale sale) {
        Producer producer = authenticationService.getAuthenticatedProducer();
        if (!producer.getId().equals(producerId)) {
            return new ResponseEntity<>(FORBIDDEN);
        }
        sale.setSeller(producer);
        sale.setPublishedToCustomers(true);
        return new ResponseEntity<>(saleRepository.save(sale), CREATED);
    }

    @Override
    public ResponseEntity<Producer> getProducer(String email) {
        Producer producer = producerRepository.findByEmail(email).orElseThrow();
        return new ResponseEntity<>(producer, OK);
    }

    @Override
    public ResponseEntity<Producer> updateProducer(Integer producerId, Producer producer) {
        Producer authenticatedProducer = authenticationService.getAuthenticatedProducer();
        if (!producer.getId().equals(producerId) || !authenticatedProducer.getId().equals(producerId)) {
            return new ResponseEntity<>(FORBIDDEN);
        }
        return new ResponseEntity<>(producerRepository.save(producer), OK);
    }

    @Override
    public ResponseEntity<List<Sale>> getProducerSales(Integer producerId) {
        Producer producer = authenticationService.getAuthenticatedProducer();
        if (!producer.getId().equals(producerId)) {
            return new ResponseEntity<>(FORBIDDEN);
        }
        List<Sale> sales = new ArrayList<>();
        saleRepository.findBySeller(producer).forEach(sales::add);;
        return new ResponseEntity<>(sales, OK);
    }

    @Override
    public ResponseEntity<List<Customer>> getProducerCustomers(Integer producerId) {
        Producer producer = authenticationService.getAuthenticatedProducer();
        if (!producer.getId().equals(producerId)) {
            return new ResponseEntity<>(FORBIDDEN);
        }
        return new ResponseEntity<>(customerRepository.findByProducer(producer), OK);
    }

    @Override
    public ResponseEntity<StripeAccount> createStripeAccount(Integer producerId) {
        Producer producer = authenticationService.getAuthenticatedProducer();
        if (!producer.getId().equals(producerId)) {
            return new ResponseEntity<>(FORBIDDEN);
        }
        producer = producerRepository.findById(producerId).orElseThrow();
        if (producer.getStripeAccount() != null) {
            throw new ResponseStatusException(BAD_REQUEST, "Un compte Stripe existe déjà pour le producteur " + producer.getId());
        }
        try {
            StripeAccount stripeAccount = stripeService.createStripeAccount(producer);
            stripeService.loadStripeAccount(stripeAccount);
            producer.setStripeAccount(stripeAccount);
            producerRepository.save(producer);
            return new ResponseEntity<>(stripeAccount, OK);
        } catch (Exception e) {
            LOGGER.error("An error occurred when creating Stripe account data using Stripe API", e);
            throw new ResponseStatusException(INTERNAL_SERVER_ERROR, "Une erreur s'est produite à la création du compte Stripe", e);
        }
    }

    @Override
    public ResponseEntity<StripeAccount> getStripeAccount(Integer producerId) {
        Producer producer = authenticationService.getAuthenticatedProducer();
        if (!producer.getId().equals(producerId)) {
            return new ResponseEntity<>(FORBIDDEN);
        }
        try {
            var stripeAccount = producer.getStripeAccount();
            stripeService.loadStripeAccount(stripeAccount);
            return new ResponseEntity<>(stripeAccount, OK);
        } catch (Exception e) {
            LOGGER.error("An error occurred when loading Stripe account data using Stripe API", e);
            throw new ResponseStatusException(INTERNAL_SERVER_ERROR, "Une erreur s'est produite au chargement du compte Stripe", e);
        }
    }

    @Override
    public ResponseEntity<PaymentsSummary> getProducerPaymentsSummary(Integer producerId) {
        Producer producer = authenticationService.getAuthenticatedProducer();
        if (!producer.getId().equals(producerId)) {
            return new ResponseEntity<>(FORBIDDEN);
        }
        try {
            PaymentsSummary paymentsSummary = stripeService.loadStripePaymentSummary(producer);
            return new ResponseEntity<>(paymentsSummary, OK);
        } catch (Exception e) {
            LOGGER.error("An error occurred when loading Stripe payments summary data using Stripe API", e);
            throw new ResponseStatusException(INTERNAL_SERVER_ERROR, "Une erreur s'est produite au chargement du résumé des paiements Stripe", e);
        }
    }

    @Override
    public ResponseEntity<Producer> getRandomProducerPublicData() {
        long producerCount = producerRepository.count();
        var producersIterator = producerRepository.findAll().iterator();
        Producer producer = getRandomProducer(producerCount, producersIterator);
        Producer producerWithPublicData = producerPublicDataService.getProducerWithOnlyPublicData(producer);
        return new ResponseEntity<>(producerWithPublicData, OK);
    }

    @Override
    public ResponseEntity<Sale> addProductionToSale(Integer producerId, Integer saleId, Production production) {
        Producer producer = authenticationService.getAuthenticatedProducer();
        if (!producer.getId().equals(producerId)) {
            return new ResponseEntity<>(FORBIDDEN);
        }
        Sale sale = saleRepository.findById(saleId).orElseThrow();
        Production loadedProduction = productionRepository.findById(production.getId()).orElseThrow();
        if (sale.getProductions().contains(loadedProduction)) {
            return new ResponseEntity<>(CONFLICT);
        }
        sale.getProductions().add(loadedProduction);
        saleRepository.save(sale);
        return new ResponseEntity<>(sale, OK);
    }

    @Override
    public ResponseEntity<Void> setSalePublishedToCustomers(Integer producerId, Integer saleId, Boolean publishedToCustomers) {
        Producer producer = authenticationService.getAuthenticatedProducer();
        if (!producer.getId().equals(producerId)) {
            return new ResponseEntity<>(FORBIDDEN);
        }
        Sale sale = saleRepository.findById(saleId).orElseThrow();
        sale.setPublishedToCustomers(publishedToCustomers);
        saleRepository.save(sale);
        return new ResponseEntity<>(NO_CONTENT);
    }

    Producer getRandomProducer(long producerCount, Iterator<Producer> producersIterator) {
        long randomProducerIndex = (long) (getRandom() * producerCount);
        if(!producersIterator.hasNext()) {
            return null;
        }
        Producer producer = producersIterator.next();
        for (long i = 0 ; i < randomProducerIndex ; i++) {
            producer = producersIterator.next();
        }
        return producer;
    }

    double getRandom() {
        return Math.random();
    }
}
