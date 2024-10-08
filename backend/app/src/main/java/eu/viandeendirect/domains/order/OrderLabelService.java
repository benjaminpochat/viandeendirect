package eu.viandeendirect.domains.order;

import eu.viandeendirect.common.PDFService;
import eu.viandeendirect.domains.production.AnimalTypeLabelManager;
import eu.viandeendirect.domains.production.CattleBreedLabelManager;
import eu.viandeendirect.model.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Locale.FRENCH;

@Service
public class OrderLabelService extends PDFService<Sale> {

    @Autowired
    AnimalTypeLabelManager animalTypeLabelManager;

    @Autowired
    CattleBreedLabelManager cattleBreedLabelManager;

    private String labelTemplate;
    private String labelCSS;

    public OrderLabelService() throws URISyntaxException, IOException {
        labelTemplate = getTemplate();
        labelCSS = getCSS();
    }

    @Override
    protected String getTemplatePath() {
        return "html/pdf/order_label_template.html";
    }

    @Override
    protected String getCSSPath() {
        return "html/pdf/order_label_template.css";
    }

    @Override
    protected String getContentAsHtml(Sale sale) {
        var htmlStart = String.format("<html><meta charset=\"UTF-8\"/><head><style type=\"text/css\">%s</style></head><body>", labelCSS);
        var htmlEnd = "</body></html>";
        return sale.getOrders().stream()
                .filter(order -> List.of(OrderStatus.PAYMENT_COMPLETED, OrderStatus.BOOKED_WITHOUT_PAYMENT).contains(order.getStatus()))
                .map(order -> this.getOrderLabel(order, sale))
                .collect(Collectors.joining("", htmlStart, htmlEnd));
    }

    private String getOrderLabel(Order order, Sale sale) {
        return String.format(labelTemplate,
                sale.getDeliveryStart(),
                order.getId(),
                String.format("%s %s (%s)", order.getCustomer().getUser().getFirstName(), order.getCustomer().getUser().getLastName(), order.getCustomer().getUser().getPhone()),
                order.getItems().stream()
                        .sorted(Comparator.comparing(OrderItem::getId))
                        .map(orderItem -> String.format("""
                                        <tr>
                                            <td>%1$s</td>
                                            <td>x %2$s</td>
                                            <td>
                                                <div>%3$s</div>
                                                <div class='production-details'>
                                                    <div>Date limite de consommation frais : %5$td/%5$tm/%5$tY</div>
                                                    <div>Date limite de consommation congelé (congélation à réception) : %6$td/%6$tm/%6$tY</div>
                                                </div>
                                                <div class='production-details'>
                                                    <div>%7$s race %8$s n° %9$s</div>
                                                    <div>Date / lieu de naissance : %10$td/%10$tm/%10$tY / %11$s, %12$s</div>
                                                    <div>Date / lieu d'abattage : %13$td/%13$tm/%13$tY / %14$s, %15$s</div>
                                                    <div>Date / lieu de découpe : %16$td/%16$tm/%16$tY / %17$s, %18$s</div>
                                                </div>
                                            </td>
                                            <td>%4$s kg</td>
                                        </tr>
                                        """,
                                orderItem.getPackageLot().getLabel(),
                                orderItem.getQuantity(),
                                orderItem.getPackageLot().getDescription().replaceAll("\n", "<br/>"),
                                orderItem.getPackageLot().getNetWeight(),
                                ((BeefProduction)orderItem.getPackageLot().getProduction()).getCuttingDate().plusDays(10),
                                ((BeefProduction)orderItem.getPackageLot().getProduction()).getCuttingDate().plusYears(1),
                                StringUtils.capitalize(animalTypeLabelManager.getLabel(((BeefProduction)orderItem.getPackageLot().getProduction()).getAnimalType(), FRENCH)),
                                cattleBreedLabelManager.getLabel(((BeefProduction)orderItem.getPackageLot().getProduction()).getCattleBreed(), FRENCH),
                                ((BeefProduction)orderItem.getPackageLot().getProduction()).getAnimalIdentifier(),
                                ((BeefProduction)orderItem.getPackageLot().getProduction()).getBirthDate(),
                                ((BeefProduction)orderItem.getPackageLot().getProduction()).getBirthFarm(),
                                ((BeefProduction)orderItem.getPackageLot().getProduction()).getBirthPlace(),
                                ((BeefProduction)orderItem.getPackageLot().getProduction()).getSlaughterDate(),
                                ((BeefProduction)orderItem.getPackageLot().getProduction()).getSlaughterHouse(),
                                ((BeefProduction)orderItem.getPackageLot().getProduction()).getSlaughterPlace(),
                                ((BeefProduction)orderItem.getPackageLot().getProduction()).getCuttingDate(),
                                ((BeefProduction)orderItem.getPackageLot().getProduction()).getCuttingButcher(),
                                ((BeefProduction)orderItem.getPackageLot().getProduction()).getCuttingPlace()
                        ))
                        .collect(Collectors.joining()),
                getViandeEnDirectLogoAsBase64());
    }

}
