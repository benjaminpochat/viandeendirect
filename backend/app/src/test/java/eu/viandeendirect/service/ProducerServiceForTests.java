package eu.viandeendirect.service;

import eu.viandeendirect.model.Producer;
import eu.viandeendirect.service.specs.ProducerServiceSpecs;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile("test")
public class ProducerServiceForTests implements ProducerServiceSpecs {

    @Override
    public Producer getAuthenticatedProducer() {
        var producer = new Producer();
        producer.setId(1000);
        return producer;
    }
}
