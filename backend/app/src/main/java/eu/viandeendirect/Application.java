package eu.viandeendirect;

import com.fasterxml.jackson.databind.Module;
import com.stripe.Stripe;
import org.openapitools.jackson.nullable.JsonNullableModule;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
@ComponentScan(basePackages = {"eu.viandeendirect", "eu.viandeendirect.api" , "eu.viandeendirect.api.configuration"})
public class Application {

    public static void main(String[] args) {
        Stripe.apiKey = "sk_test_51P7HcpCgv5VSh4jfbuh4NdajukjRQeAI8uwZgdx0cbDYUFEMRzdWn72xA16Qhko4Qfevjb0VRoNNBcKhd39HCfGu00WBTjmkao";
        SpringApplication.run(Application.class, args);
    }

    @Bean
    public Module jsonNullableModule() {
        return new JsonNullableModule();
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

}