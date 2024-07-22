package eu.viandeendirect.common;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ViandeEnDirectConfiguration {
    private String producerFrontendUrl;

    @Value("${PRODUCER_FRONTEND_URL:http://localhost:3000}")
    public void setProducerFrontendUrl(String producerFrontendUrl) {
        this.producerFrontendUrl = producerFrontendUrl;
    }

    public String getProducerFrontendUrl() {
        return producerFrontendUrl;
    }
}
