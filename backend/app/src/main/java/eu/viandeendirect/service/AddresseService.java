package eu.viandeendirect.service;

import eu.viandeendirect.api.AddressesApiDelegate;
import eu.viandeendirect.model.Address;
import eu.viandeendirect.model.Producer;
import eu.viandeendirect.repository.AddressRepository;
import eu.viandeendirect.service.specs.AuthenticationProducerServiceSpecs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddresseService implements AddressesApiDelegate {

    @Autowired
    AddressRepository addressRepository;

    @Autowired
    AuthenticationProducerServiceSpecs producerService;

    @Override
    public ResponseEntity<List<Address>> getAddresses() {
        Producer producer = producerService.getAuthenticatedProducer();
        List<Address> addresses = addressRepository.findByOwner(producer);
        return new ResponseEntity<>(addresses, HttpStatus.OK);
    }
}
