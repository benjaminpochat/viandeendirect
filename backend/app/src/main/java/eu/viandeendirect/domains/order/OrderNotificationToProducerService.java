package eu.viandeendirect.domains.order;

import eu.viandeendirect.common.EmailService;
import eu.viandeendirect.common.NotificationService;
import eu.viandeendirect.common.ViandeEnDirectConfiguration;
import eu.viandeendirect.domains.user.ProducerRepository;
import eu.viandeendirect.model.Order;
import eu.viandeendirect.model.Producer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderNotificationToProducerService implements NotificationService<OrderService.OrderProducer> {

    private static final Logger LOGGER = LoggerFactory.getLogger(OrderNotificationToProducerService.class);

    @Autowired
    private EmailService emailService;

    @Autowired
    private ProducerRepository producerRepository;

    @Autowired
    ViandeEnDirectConfiguration viandeEnDirectConfiguration;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Override
    public String getSubject(OrderService.OrderProducer orderProducer) {
        return "Nouvelle commande sur ViandeEnDirect.eu";
    }

    @Override
    public String getRecipient(OrderService.OrderProducer orderProducer) {
        return orderProducer.producer().getUser().getEmail();
    }

    @Override
    public String getBodyTemplatePath() {
        return "html/notification/notification_to_producer_body_template.html";
    }

    @Override
    public EmailService getEmailService() {
        return emailService;
    }

    @Override
    public Object[] getTemplateValues(OrderService.OrderProducer orderProducer) {
        Order order = orderProducer.order();
        Producer producer = orderProducer.producer();
        Object[] templateValues = {
                order.getId(),
                viandeEnDirectConfiguration.getProducerFrontendUrl(),
                order.getCustomer().getUser().getFirstName(),
                order.getCustomer().getUser().getLastName(),
                order.getCustomer().getUser().getEmail(),
                order.getCustomer().getUser().getPhone(),
                getTotalPrice(order, producer),
                getTotalWeight(order, producer)
        };
        return templateValues;
    }

    double getTotalPrice(Order order, Producer producer) {
        return orderItemRepository.findByOrder(order).stream()
                .filter(item -> item.getPackageLot().getProduction().getProducer().getId().equals(producer.getId()))
                .mapToDouble(item -> item.getUnitPrice() * item.getQuantity() * item.getPackageLot().getNetWeight())
                .sum();
    }

    double getTotalWeight(Order order, Producer producer) {
        return orderItemRepository.findByOrder(order).stream()
                .filter(item -> item.getPackageLot().getProduction().getProducer().getId().equals(producer.getId()))
                .mapToDouble(item -> item.getQuantity() * item.getPackageLot().getNetWeight())
                .sum();
    }
}
