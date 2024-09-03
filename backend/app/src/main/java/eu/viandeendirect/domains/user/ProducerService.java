package eu.viandeendirect.domains.user;

import eu.viandeendirect.api.ProducersApiDelegate;
import eu.viandeendirect.domains.payment.StripeService;
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

    @Override
    public ResponseEntity<Sale> createProducerSale(Integer producerId, Sale sale) {
        Producer producer = authenticationService.getAuthenticatedProducer();
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
            throw new ResponseStatusException(INTERNAL_SERVER_ERROR, "Une erreur s'est produite à la création du lien vers le compte Stripe", e);
        }
    }

    @Override
    public ResponseEntity<PaymentsSummary> getProducerPaymentsSummary(Integer producerId) {
        Producer producer = authenticationService.getAuthenticatedProducer();
        if (!producer.getId().equals(producerId)) {
            return new ResponseEntity<>(FORBIDDEN);
        }
        //TODO : calculer les montant à partir des API Stripe (https://docs.stripe.com/api/balance_transactions/object)
        PaymentsSummary paymentsSummary = new PaymentsSummary();
        paymentsSummary.setDaylyTotal(100f);
        paymentsSummary.setWeeklyTotal(1000f);
        paymentsSummary.setMonthlyTotal(4000f);
        paymentsSummary.setYearlyTotal(12000f);
        return new ResponseEntity<>(paymentsSummary, OK);
    }
}
