package eu.viandeendirect.domains.order;

import eu.viandeendirect.common.EmailService;
import eu.viandeendirect.common.NotificationService;
import eu.viandeendirect.model.Order;
import org.springframework.stereotype.Service;

@Service
public class OrderNotificationToCustomerService implements NotificationService<Order> {
    @Override
    public String getSubject(Order object) {
        return "";
    }

    @Override
    public String getRecipient(Order object) {
        return "";
    }

    @Override
    public Object[] getTemplateValues(Order object) {
        return new Object[0];
    }

    @Override
    public EmailService getEmailService() {
        return null;
    }

    @Override
    public String getBodyTemplatePath() {
        return "";
    }
}
