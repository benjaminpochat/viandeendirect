package eu.viandeendirect.service;

import eu.viandeendirect.model.Producer;
import eu.viandeendirect.service.specs.ProducerServiceSpecs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@Profile("test")
public class ProducerServiceForTests implements ProducerServiceSpecs {

    @Override
    public Producer getAuthenticatedProducer() {
        var producer = new Producer();
        producer.setId(BigDecimal.valueOf(1));
        return producer;
    }
}
