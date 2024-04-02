package eu.viandeendirect.domains.sale;

import eu.viandeendirect.domains.sale.AddresseService;
import eu.viandeendirect.model.Address;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.AFTER_TEST_METHOD;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.BEFORE_TEST_METHOD;

@SpringBootTest
@ActiveProfiles(value = "test")
@ExtendWith({SpringExtension.class})
@Sql(value = {"/sql/create_test_data.sql"}, executionPhase = BEFORE_TEST_METHOD)
@Sql(value = {"/sql/delete_test_data.sql"}, executionPhase = AFTER_TEST_METHOD)
public class TestAddressesService {
    @Autowired
    private AddresseService addresseService;

    @Test
    void getAddresses_should_return_addresses() {
        // when
        List<Address> addresses = addresseService.getAddresses().getBody();

        // then
        assertThat(addresses).hasSize(2);
        assertThat(addresses).anyMatch(address -> "Toulouse Centre".equals(address.getName()));
        assertThat(addresses).anyMatch(address -> "Toulouse Mirail".equals(address.getName()));
    }
}
