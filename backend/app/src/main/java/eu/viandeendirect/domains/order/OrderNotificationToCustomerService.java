package eu.viandeendirect.domains.order;

import eu.viandeendirect.common.EmailService;
import eu.viandeendirect.common.NotificationService;
import eu.viandeendirect.common.ViandeEnDirectConfiguration;
import eu.viandeendirect.model.Order;
import eu.viandeendirect.model.Sale;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static java.util.Optional.ofNullable;

@Service
public class OrderNotificationToCustomerService implements NotificationService<Order> {

    @Autowired
    private EmailService emailService;

    @Autowired
    private ViandeEnDirectConfiguration viandeEnDirectConfiguration;

    @Override
    public String getSubject(Order order) {
        return "Commande confirmée sur ViandeEnDirect.eu";
    }

    @Override
    public String getRecipient(Order order) {
        return order.getCustomer().getUser().getEmail();
    }

    @Override
    public String getBodyTemplatePath() {
        return "html/notification/notification_to_customer_body_template.html";
    }

    @Override
    public EmailService getEmailService() {
        return emailService;
    }

    @Override
    public Object[] getTemplateValues(Order order) {
        Sale sale = order.getSale();
        Object[] bodyTemplateValues = {
                order.getId(),
                viandeEnDirectConfiguration.getCustomerFrontendUrl(),
                order.getItems().stream().mapToDouble(item -> item.getQuantity() * item.getUnitPrice() * item.getPackageLot().getNetWeight()).sum(),
                order.getItems().stream().mapToDouble(item -> item.getQuantity() * item.getPackageLot().getNetWeight()).sum(),
                sale.getDeliveryStart(),
                sale.getDeliveryStop(),
                sale.getDeliveryAddressName(),
                ofNullable(sale.getDeliveryAddressLine1()).orElse(""),
                ofNullable(sale.getDeliveryAddressLine2()).orElse(""),
                sale.getDeliveryZipCode(),
                sale.getDeliveryCity()
        };
        return bodyTemplateValues;
    }
}
