package eu.viandeendirect.domains.production;

import eu.viandeendirect.common.PDFService;
import eu.viandeendirect.model.BeefProduction;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Locale.FRENCH;

@Service
public class PackageElementLabelService extends PDFService<PackageElementLabelService.Arguments> {

    @Autowired
    AnimalTypeLabelManager animalTypeLabelManager;

    @Autowired
    CattleBreedLabelManager cattleBreedLabelManager;

    private String productLabelCSS;
    private String productLabelTemplate;

    public PackageElementLabelService() throws URISyntaxException, IOException {
        productLabelTemplate = getTemplate();
        productLabelCSS = getCSS();
    }

    @Override
    protected String getTemplatePath() {
        return "html/pdf/package_element_label_template.html";
    }

    @Override
    protected String getCSSPath() {
        return "html/pdf/package_element_label_template.css";
    }

    @Override
    protected String getContentAsHtml(PackageElementLabelService.Arguments arguments) {
        var htmlStart = String.format("<html><meta charset=\"UTF-8\"/><head><style type=\"text/css\">%s</style></head><body>", productLabelCSS);
        var htmlEnd = "</body></html>";
        return arguments.elementsNames.stream()
                .map(elementName -> String.format(productLabelTemplate, getLabelsAsHtml(arguments.beefProduction, elementName)))
                .collect(Collectors.joining("", htmlStart, htmlEnd));
    }

    private String getLabelsAsHtml(BeefProduction beefProduction, String elementName) {
        return String.format("""
                            <table>
                                <tr>
                                    <td>%1$s race %2$s</td>
                                    <td rowspan="2">
                                        <img src="data:image/jpg;base64, %7$s" class="certification-images"></img>
                                    </td>
                                </tr>
                                <tr>
                                    <td>%3$s</td>
                                </tr>
                                <tr>
                                    <td colspan="2" class="element-name">
                                        %4$s
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2">
                                        DLC : %5$td/%5$tm/%5$tY
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2">
                                        DLC congelé : %6$td/%6$tm/%6$tY
                                    </td>
                                </tr>
                            </table>""",
                StringUtils.capitalize(animalTypeLabelManager.getLabel(beefProduction.getAnimalType(), FRENCH)),
                cattleBreedLabelManager.getLabel(beefProduction.getCattleBreed(), FRENCH),
                beefProduction.getAnimalIdentifier(),
                elementName,
                beefProduction.getCuttingDate().plusDays(10),
                beefProduction.getCuttingDate().plusYears(1),
                getLabelRougeLogoAsBase64(beefProduction));
    }

    public record Arguments(BeefProduction beefProduction, List<String> elementsNames) {}
}
