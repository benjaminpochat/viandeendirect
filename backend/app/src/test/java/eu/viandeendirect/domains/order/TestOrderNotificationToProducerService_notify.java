package eu.viandeendirect.domains.order;

import eu.viandeendirect.common.ViandeEnDirectConfiguration;
import eu.viandeendirect.domains.sale.SaleRepository;
import eu.viandeendirect.domains.user.ProducerRepository;
import eu.viandeendirect.model.BeefProduction;
import eu.viandeendirect.model.Order;
import eu.viandeendirect.model.Producer;
import eu.viandeendirect.model.Production;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.BEFORE_TEST_CLASS;

@SpringBootTest
@ActiveProfiles(value = "test")
@ExtendWith({SpringExtension.class})
@Sql(value = {"/sql/delete_test_data.sql"}, executionPhase = BEFORE_TEST_CLASS)
class TestOrderNotificationToProducerService_notify {

    @Autowired
    private OrderTestService orderTestService;

    @Autowired
    private ViandeEnDirectConfiguration viandeEnDirectConfiguration;

    @Autowired
    private OrderNotificationToProducerService orderNotificationToProducerService;

    @Autowired
    private ProducerRepository producerRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Test
    void should_send_a_mail_correctly() {
        // Given
        Order order = orderTestService.createOrder();
        saleRepository.save(order.getSale());
        orderRepository.save(order);
        orderItemRepository.saveAll(order.getItems());
        Producer beefProducer = order.getItems().stream()
                .map(item -> item.getPackageLot().getProduction())
                .filter(production -> production instanceof BeefProduction)
                .map(Production::getProducer)
                .findFirst().get();
        OrderNotificationToProducerService spyedService = spy(orderNotificationToProducerService);
        doNothing().when(spyedService).sendMail(anyString(), anyString(), anyString());

        // When
        spyedService.notify(new OrderService.OrderProducer(order, beefProducer));

        // Then
        ArgumentCaptor<String> mailBodyCaptor = ArgumentCaptor.forClass(String.class);
        verify(spyedService).sendMail(
                eq("producer@address.mail"),
                eq("Nouvelle commande sur ViandeEnDirect.eu"),
                mailBodyCaptor.capture());
        String mailBody = mailBodyCaptor.getValue();
        String cleanMailBody = mailBody.replaceAll("( {4})*", "");
        assertThat(cleanMailBody).isEqualTo(String.format("<meta charset=\"UTF-8\"><div>La commande n° 1 a été enregistrée sur <a href='%s'>ViandeEnDirect.eu</a>.</div><div><ul><li>Client :<ul><li>Nom : John Doe</li><li>Email : customer@address.mail</li><li>Téléphone : 0102030405</li></ul></li><li>Montant de la commande : 1000.0 €TTC</li><li>Quantité commandée : 30.0 kg</li></ul></div>",viandeEnDirectConfiguration.getProducerFrontendUrl()));
    }

}