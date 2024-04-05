package eu.viandeendirect.domains.production;

import eu.viandeendirect.common.EnumLabelManager;
import eu.viandeendirect.model.BeefProduction;
import org.springframework.stereotype.Component;

@Component
public class AnimalTypeLabelManager implements EnumLabelManager<BeefProduction.AnimalTypeEnum> {

    @Override
    public String getFrenchLabel(BeefProduction.AnimalTypeEnum animalType) {
        return switch (animalType) {
            case COW -> "vache";
            case BULL -> "taureau";
            case VEAL -> "veau";
            case HEIFER -> "génisse";
        };
    }
}
