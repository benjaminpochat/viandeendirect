package eu.viandeendirect.common;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
public class ApplicationContextVerifyer {

    private static final Logger LOGGER = LoggerFactory.getLogger(ApplicationContextVerifyer.class);
    @Autowired
    private ApplicationContext applicationContext;

    @PostConstruct
    public void init() {
        LOGGER.info("List of beans loaded in applicationContext :");
        String[] beanNames = applicationContext.getBeanDefinitionNames();
        for (String beanName : beanNames) {
            LOGGER.info(beanName);
        }
    }
}
