package eu.viandeendirect.domains.user;

import eu.viandeendirect.model.Producer;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProducerPublicDataService {
    public Producer getProducerWithOnlyPublicData(Optional<Producer> producer) {
        return producer.map(producerWithAllData -> {
            var producerWithOnlyPublicData = new Producer();
            producerWithOnlyPublicData.setFarmName(producerWithAllData.getFarmName());
            producerWithOnlyPublicData.setSlideShowUrl(producerWithAllData.getSlideShowUrl());
            producerWithOnlyPublicData.setWebsiteUrl(producerWithAllData.getWebsiteUrl());
            return producerWithOnlyPublicData;
        }).orElse(null);
    }
}
