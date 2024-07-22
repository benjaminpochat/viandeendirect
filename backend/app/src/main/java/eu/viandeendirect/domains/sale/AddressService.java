package eu.viandeendirect.domains.sale;

import eu.viandeendirect.api.AddressesApiDelegate;
import eu.viandeendirect.model.Address;
import eu.viandeendirect.model.Producer;
import eu.viandeendirect.security.specs.AuthenticationServiceSpecs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService implements AddressesApiDelegate {

    @Autowired
    AddressRepository addressRepository;

    @Autowired
    AuthenticationServiceSpecs producerService;

    @Override
    public ResponseEntity<List<Address>> getAddresses() {
        Producer producer = producerService.getAuthenticatedProducer();
        List<Address> addresses = addressRepository.findByOwner(producer);
        return new ResponseEntity<>(addresses, HttpStatus.OK);
    }
}
