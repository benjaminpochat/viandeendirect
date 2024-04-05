package eu.viandeendirect.domains.production;

import eu.viandeendirect.common.EnumLabelManager;
import eu.viandeendirect.model.BeefProduction;
import org.springframework.stereotype.Component;

@Component
public class CattleBreedLabelManager implements EnumLabelManager<BeefProduction.CattleBreedEnum> {
    @Override
    public String getFrenchLabel(BeefProduction.CattleBreedEnum cattleBreed) {
        return switch (cattleBreed) {
            case CHAROLAISE -> "charolaise";
            case LIMOUSINE -> "limousine";
        };
    }
}
