package eu.viandeendirect.domains.payment;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import eu.viandeendirect.domains.order.OrderRepository;
import eu.viandeendirect.domains.order.OrderService;
import eu.viandeendirect.domains.order.OrderTestService;
import eu.viandeendirect.model.*;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static eu.viandeendirect.model.OrderStatus.PAYMENT_ABORTED;
import static eu.viandeendirect.model.OrderStatus.PAYMENT_COMPLETED;
import static org.mockito.Mockito.*;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.BEFORE_TEST_CLASS;

@SpringBootTest
@ActiveProfiles(value = "test")
@ExtendWith({SpringExtension.class})
@Sql(value = {"/sql/delete_test_data.sql"}, executionPhase = BEFORE_TEST_CLASS)
public class TestStripeEventHandler_handleStripeAccountEvent {

    @SpyBean
    private StripeEventHandler stripeEventHandler;

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderTestService orderTestService;

    @MockBean
    private StripeService stripeService;

    @Autowired
    private OrderRepository orderRepository;

    @Test
    void should_change_order_status_after_payment_is_completed() throws StripeException {
        // given
        Order order = orderTestService.createOrder();

        var stripePayment = new StripePayment();
        stripePayment.setCheckoutSessionId("stripe-id-success");
        when(stripeService.createPayment(any())).thenReturn(stripePayment);
        orderService.createOrderPayment(order);

        Session checkoutSession = new Session();
        checkoutSession.setId("stripe-id-success");
        checkoutSession.setObject("checkout.session");
        Event event = new Event();
        event.setType("checkout.session.completed");
        Event.Data data = new Event.Data();
        JsonObject jsonObject = new Gson().toJsonTree(checkoutSession).getAsJsonObject();
        data.setObject(jsonObject);
        event.setData(data);
        doReturn(event).when(stripeEventHandler).getEvent(any(), any());
        doReturn(checkoutSession).when(stripeEventHandler).getCheckoutSession(any());

        // when
        stripeEventHandler.handleStripeConnectEvent(null, null);

        // then
        Order orderReloaded = orderRepository.findById(order.getId()).get();
        Assertions.assertThat(orderReloaded.getStatus()).isEqualTo(PAYMENT_COMPLETED);
    }

    @Test
    void should_change_order_status_after_payment_is_aborted() throws StripeException {
        // given
        Order order = orderTestService.createOrder();

        var stripePayment = new StripePayment();
        stripePayment.setCheckoutSessionId("stripe-id-aborted");
        when(stripeService.createPayment(any())).thenReturn(stripePayment);
        orderService.createOrderPayment(order);

        Session checkoutSession = new Session();
        checkoutSession.setId("stripe-id-aborted");
        checkoutSession.setObject("checkout.session");
        Event event = new Event();
        event.setType("checkout.session.expired");
        Event.Data data = new Event.Data();
        JsonObject jsonObject = new Gson().toJsonTree(checkoutSession).getAsJsonObject();
        data.setObject(jsonObject);
        event.setData(data);
        doReturn(event).when(stripeEventHandler).getEvent(any(), any());
        doReturn(checkoutSession).when(stripeEventHandler).getCheckoutSession(any());

        // when
        stripeEventHandler.handleStripeConnectEvent(null, null);

        // then
        Order orderReloaded = orderRepository.findById(order.getId()).get();
        Assertions.assertThat(orderReloaded.getStatus()).isEqualTo(PAYMENT_ABORTED);    }
}
