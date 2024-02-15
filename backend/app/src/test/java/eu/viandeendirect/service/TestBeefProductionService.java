package eu.viandeendirect.service;

import eu.viandeendirect.model.BeefProduction;
import eu.viandeendirect.model.Production;
import eu.viandeendirect.repository.ProductionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit.jupiter.SpringExtension;


import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.AFTER_TEST_METHOD;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.BEFORE_TEST_METHOD;

@SpringBootTest
@ActiveProfiles(value = "test")
@ExtendWith({SpringExtension.class})
@Sql(value = {"/sql/create_test_data.sql"}, executionPhase = BEFORE_TEST_METHOD)
@Sql(value = {"/sql/delete_test_data.sql"}, executionPhase = AFTER_TEST_METHOD)
class TestBeefProductionService {

    @Autowired
    private BeefProductionService beefProductionService;

    @Autowired
    ProductionRepository productionRepository;

    @Test
    void getBeefProduction_should_return_the_right_instance() {
        // when
        BeefProduction beefProduction = beefProductionService.getBeefProduction(1000).getBody();

        // then
        assertThat(beefProduction).isNotNull();
        assertThat(beefProduction.getWarmCarcassWeight()).isEqualTo(400);
    }

    @Test
    void createBeefProduction_should_persist_in_database() {
        // given
        BeefProduction beefProduction = new BeefProduction();
        beefProduction.setAnimalIdentifier("9999");
        beefProduction.setBirthPlace("Béchy");

        // when
        BeefProduction beefProductionCreated = beefProductionService.createBeefProduction(beefProduction).getBody();

        // then
        assertThat(beefProductionCreated).isNotNull();
        assertThat(beefProductionCreated.getId()).isNotNull();
        Production beefProductionFromDatabase = productionRepository.findById(beefProductionCreated.getId()).get();
        assertThat(beefProductionFromDatabase)
                .isNotNull()
                .isInstanceOf(BeefProduction.class);
    }
}