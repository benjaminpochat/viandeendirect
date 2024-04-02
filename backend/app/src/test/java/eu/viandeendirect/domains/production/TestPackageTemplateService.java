package eu.viandeendirect.domains.production;

import eu.viandeendirect.domains.production.PackageTemplateService;
import eu.viandeendirect.model.PackageTemplate;
import org.assertj.core.api.Assertions;
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
public class TestPackageTemplateService {

    @Autowired
    PackageTemplateService packageTemplateService;

    @Test
    void getPackageTemplates_should_return_the_right_packages() {
        // when
        List<PackageTemplate> packageTemplates = packageTemplateService.getPackageTemplates().getBody();

        // then
        Assertions.assertThat(packageTemplates)
                .hasSize(2)
                .anyMatch(packageTemplate -> packageTemplate.getLabel().equals("Le coli tradition"))
                .anyMatch(packageTemplate -> packageTemplate.getLabel().equals("Le coli cuisson rapide"));
    }
}
