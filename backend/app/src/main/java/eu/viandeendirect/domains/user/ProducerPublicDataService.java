package eu.viandeendirect.domains.user;

import eu.viandeendirect.model.Producer;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProducerPublicDataService {
    public Producer getProducerWithOnlyPublicData(Producer producer) {
        var producerWithOnlyPublicData = new Producer();
        producerWithOnlyPublicData.setFarmName(producer.getFarmName());
        producerWithOnlyPublicData.setSlideShowUrl(producer.getSlideShowUrl());
        producerWithOnlyPublicData.setWebsiteUrl(producer.getWebsiteUrl());
        return producerWithOnlyPublicData;
    }
}
