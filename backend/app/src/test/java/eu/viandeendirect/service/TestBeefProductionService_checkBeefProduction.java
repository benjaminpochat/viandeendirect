package eu.viandeendirect.service;

import eu.viandeendirect.model.BeefProduction;
import eu.viandeendirect.model.Sale;
import eu.viandeendirect.repository.ProductionRepository;
import eu.viandeendirect.repository.SaleRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles(value = "test")
@ExtendWith({SpringExtension.class})
class TestBeefProductionService_checkBeefProduction {
    @Autowired
    BeefProductionService beefProductionService;

    @Autowired
    ProductionRepository productionRepository;

    @Autowired
    SaleRepository saleRepository;

    @Test
    void should_not_raise_an_error_if_production_not_related_to_a_sale() {
        // given
        BeefProduction production = productionRepository.save(new BeefProduction());

        // when / then
        Assertions.assertThatNoException().isThrownBy(() -> beefProductionService.checkBeefProduction(production));
    }

    @Test
    void should_raise_an_error_if_production_related_to_a_sale() {
        // given
        BeefProduction production = productionRepository.save(new BeefProduction());
        Sale sale = new Sale();
        sale.setProductions(List.of(production));
        saleRepository.save(sale);

        // when / then
        Assertions.assertThatThrownBy(() -> beefProductionService.checkBeefProduction(production))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(throwable -> assertThat(((ResponseStatusException) throwable).getBody().getDetail()).isEqualTo("Il n'est pas possible de modifier une production déjà mise en vente."));
    }

}