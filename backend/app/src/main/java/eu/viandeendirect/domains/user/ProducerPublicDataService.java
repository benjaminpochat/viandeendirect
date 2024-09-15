package eu.viandeendirect.domains.user;

import eu.viandeendirect.model.Producer;
import org.springframework.stereotype.Service;

@Service
public class ProducerPublicDataService {
    public Producer getProducerWithOnlyPublicData(Producer producer) {
        var producerWithPublicData = new Producer();
        producerWithPublicData.setFarmName(producer.getFarmName());
        producerWithPublicData.setSlideShowUrl(producer.getSlideShowUrl());
        producerWithPublicData.setWebsiteUrl(producer.getWebsiteUrl());
        return producerWithPublicData;
    }
}
