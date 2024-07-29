package eu.viandeendirect.common;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ViandeEnDirectConfiguration {
    private String producerFrontendUrl;
    private String customerFrontendUrl;

    @Value("${PRODUCER_FRONTEND_URL:http://localhost:3000}")
    public void setProducerFrontendUrl(String producerFrontendUrl) {
        this.producerFrontendUrl = producerFrontendUrl;
    }

    @Value("${CUSTOMER_FRONTEND_URL:http://localhost:3000}")
    public void setCustomerFrontendUrl(String customerFrontendUrl) {
        this.customerFrontendUrl = customerFrontendUrl;
    }

    public String getProducerFrontendUrl() {
        return producerFrontendUrl;
    }

    public String getCustomerFrontendUrl() {
        return customerFrontendUrl;
    }
}
