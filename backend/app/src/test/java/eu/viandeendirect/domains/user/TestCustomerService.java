package eu.viandeendirect.domains.user;

import eu.viandeendirect.domains.user.CustomerService;
import eu.viandeendirect.domains.user.ProducerService;
import eu.viandeendirect.model.Customer;
import eu.viandeendirect.model.User;
import eu.viandeendirect.domains.user.CustomerRepository;
import eu.viandeendirect.domains.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.assertj.core.api.Assertions.*;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.AFTER_TEST_METHOD;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.BEFORE_TEST_METHOD;

@SpringBootTest
@ActiveProfiles(value = "test")
@ExtendWith({SpringExtension.class})
@Sql(value = {"/sql/create_test_data.sql"}, executionPhase = BEFORE_TEST_METHOD)
@Sql(value = {"/sql/delete_test_data.sql"}, executionPhase = AFTER_TEST_METHOD)
class TestCustomerService {

    @Autowired
    ProducerService producerService;

    @Autowired
    CustomerService customerService;

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    UserRepository userRepository;

    @Test
    void createCustomer_should_persist_customer_and_user_in_database() {
        // given
        User user = new User();
        user.setEmail("thom.york@address.mail");
        user.setFirstName("Thom");
        user.setLastName("YORK");
        user.setPhone("0609080706");
        Customer customer = new Customer();
        customer.setUser(user);

        // when
        Customer savedCustomer = customerService.createCustomer(customer).getBody();

        // then
        assertThat(savedCustomer.getId()).isNotNull();
        Customer reloadedCustomer = customerRepository.findById(savedCustomer.getId()).get();
        assertThat(reloadedCustomer.getUser()).isNotNull();

        assertThat(reloadedCustomer.getUser().getId()).isNotNull();
        User reloadedUser = userRepository.findById(reloadedCustomer.getUser().getId()).get();
        assertThat(reloadedUser.getEmail()).isEqualTo("thom.york@address.mail");
        assertThat(reloadedUser.getFirstName()).isEqualTo("Thom");
        assertThat(reloadedUser.getLastName()).isEqualTo("YORK");
        assertThat(reloadedUser.getPhone()).isEqualTo("0609080706");
    }
}
