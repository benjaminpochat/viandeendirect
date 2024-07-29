package eu.viandeendirect.domains.order;

import eu.viandeendirect.common.ViandeEnDirectConfiguration;
import eu.viandeendirect.model.Order;
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
class TestOrderNotificationToCustomerService_notify {

    @Autowired
    OrderTestService orderTestService;

    @Autowired
    ViandeEnDirectConfiguration viandeEnDirectConfiguration;

    @Autowired
    OrderNotificationToCustomerService orderNotificationToCustomerService;

    @Test
    void should_send_a_mail_correctly() {
        // Given
        Order order = orderTestService.createOrder();
        order.setId(1);
        OrderNotificationToCustomerService spyedService = spy(orderNotificationToCustomerService);
        doNothing().when(spyedService).sendMail(anyString(), anyString(), anyString());

        // When
        spyedService.notify(order);

        // Then
        ArgumentCaptor<String> mailBodyCaptor = ArgumentCaptor.forClass(String.class);
        verify(spyedService).sendMail(
                eq("customer@address.mail"),
                eq("Commande confirmée sur ViandeEnDirect.eu"),
                mailBodyCaptor.capture());
        String mailBody = mailBodyCaptor.getValue();
        String cleanMailBody = mailBody.replaceAll("( {4})*", "");
        assertThat(cleanMailBody).isEqualTo(String.format("<meta charset=\"UTF-8\"><div>La commande n° 1 a été enregistrée sur <a href='%s'>ViandeEnDirect.eu</a>.</div><div><ul><li>Montant de la commande : 1100.0 €TTC</li><li>Quantité commandée : 32.5 kg</li><li>Date et heure de la livraison : le 30/09/2021 entre 15:30 et 18:30</li><li>Adresse de la livraison :<br>A la ferme<br>Rue de la Paix<br><br>75001<br>Paris<br></li></ul></div>",viandeEnDirectConfiguration.getCustomerFrontendUrl()));
    }

}