package eu.viandeendirect.api.configuration;

import eu.viandeendirect.api.DeliveriesApiDelegate;
import eu.viandeendirect.api.DeliveriesApiImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfiguration {
    @Bean
    DeliveriesApiDelegate deliveriesApi(){
        return new DeliveriesApiImpl();
    }
}
