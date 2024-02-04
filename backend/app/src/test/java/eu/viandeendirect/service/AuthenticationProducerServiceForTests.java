package eu.viandeendirect.service;

import eu.viandeendirect.model.Producer;
import eu.viandeendirect.service.specs.AuthenticationProducerServiceSpecs;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile("test")
public class AuthenticationProducerServiceForTests implements AuthenticationProducerServiceSpecs {

    @Override
    public Producer getAuthenticatedProducer() {
        var producer = new Producer();
        producer.setId(1000);
        return producer;
    }
}
