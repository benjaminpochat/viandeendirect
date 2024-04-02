package eu.viandeendirect.security.specs;

import eu.viandeendirect.model.Customer;
import eu.viandeendirect.model.Producer;

public interface AuthenticationServiceSpecs {
    Producer getAuthenticatedProducer();

    Customer getAuthenticatedCustomer();
}
