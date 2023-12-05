package eu.viandeendirect.service;

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

@SpringBootTest
@ActiveProfiles(value = "test")
@ExtendWith({SpringExtension.class})
@Sql(value = {
        "/sql/create/users_test_data.sql",
        "/sql/create/producer_test_data.sql",
        "/sql/create/addresses_test_data.sql"
}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class TestAddressesService {
    @Autowired
    private AddressesService addressesService;

    @Test
    void getAddresses_should_return_addresses() {
        // when
        List<Address> addresses = addressesService.getAddresses().getBody();

        // then
        assertThat(addresses).hasSize(2);
        assertThat(addresses).anyMatch(address -> "Toulouse Centre".equals(address.getName()));
        assertThat(addresses).anyMatch(address -> "Toulouse Mirail".equals(address.getName()));
    }
}
