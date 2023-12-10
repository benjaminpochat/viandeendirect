package eu.viandeendirect.service;

import eu.viandeendirect.model.BeefProduction;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit.jupiter.SpringExtension;


import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles(value = "test")
@ExtendWith({SpringExtension.class})
@Sql(value = {
        "/sql/create/users_test_data.sql",
        "/sql/create/producers_test_data.sql",
        "/sql/create/addresses_test_data.sql",
        "/sql/create/productions_test_data.sql"
}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
class TestBeefProductionsService {

    @Autowired
    private BeefProductionsService beefProductionService;

    @Test
    void getBeefProduction_should_return_the_right_instance() {
        // when
        BeefProduction beefProduction = beefProductionService.getBeefProduction("10").getBody();

        // then
        assertThat(beefProduction).isNotNull();
        assertThat(beefProduction.getAnimalLiveWeight().floatValue()).isEqualTo(400f);
    }
}