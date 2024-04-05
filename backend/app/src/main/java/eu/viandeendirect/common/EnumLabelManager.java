package eu.viandeendirect.common;

import eu.viandeendirect.model.BeefProduction;

import java.util.Locale;

public interface EnumLabelManager<T> {

    default String getLabel(T enumValue, Locale locale) {
        return switch (locale.getLanguage()) {
            case "fr" -> getFrenchLabel(enumValue);
            default -> "undefined";
        };
    }

    String getFrenchLabel(T enumValue);
}
