package eu.viandeendirect.service;

import eu.viandeendirect.model.BeefProduction;
import eu.viandeendirect.model.Production;
import org.assertj.core.api.Assertions;
import org.assertj.core.data.Offset;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.AFTER_TEST_METHOD;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.BEFORE_TEST_METHOD;

@SpringBootTest
@ActiveProfiles(value = "test")
@ExtendWith({SpringExtension.class})
@Sql(value = {"/sql/create_test_data.sql"}, executionPhase = BEFORE_TEST_METHOD)
@Sql(value = {"/sql/delete_test_data.sql"}, executionPhase = AFTER_TEST_METHOD)
public class TestProductionService {

    @Autowired
    ProductionService productionService;

    @Test
    void getProduction_should_return_all_productions_owned_by_current_producer() {
        // when
        List<Production> productions = productionService.getProductions(true).getBody();

        // then
        Assertions.assertThat(productions)
                .hasSize(2)
                .allMatch(production -> production instanceof BeefProduction);
    }

    @Test
    void getProductionPercentageSold_should_return_the_right_percentage() {
        // when
        Integer percentage = productionService.getProductionPercentageSold(1000).getBody();

        // then
        Assertions.assertThat(percentage.floatValue()).isCloseTo(24f, Offset.offset(0.1f));
    }
}
