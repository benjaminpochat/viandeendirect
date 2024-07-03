package eu.viandeendirect.domains.production;

import eu.viandeendirect.domains.order.OrderItemRepository;
import eu.viandeendirect.domains.order.OrderRepository;
import eu.viandeendirect.domains.user.CustomerRepository;
import eu.viandeendirect.model.*;
import org.assertj.core.api.Abstract2DArrayAssert;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

import static eu.viandeendirect.model.OrderStatus.*;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles(value = "test")
@ExtendWith({SpringExtension.class})
class TestPackageLotQuantitySoldService_updateQuantitySold {

    @Autowired
    private PackageLotQuantitySoldService packageLotQuantitySoldService;

    @Autowired
    private PackageLotRepository packageLotRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Test
    void should_count_order_with_payment_completed_as_sold() {
        // given
        PackageLot lot = prepareContext(PAYMENT_COMPLETED, 3);

        // when
        packageLotQuantitySoldService.updateQuantitySold(lot);

        // then
        PackageLot reloadedLot = packageLotRepository.findById(lot.getId()).get();
        assertThat(reloadedLot.getQuantitySold()).isEqualTo(3);
    }

    @Test
    void should_count_order_with_payment_pending_as_sold() {
        // given
        PackageLot lot = prepareContext(PAYMENT_PENDING, 2);

        // when
        packageLotQuantitySoldService.updateQuantitySold(lot);

        // then
        PackageLot reloadedLot = packageLotRepository.findById(lot.getId()).get();
        assertThat(reloadedLot.getQuantitySold()).isEqualTo(2);
    }

    @Test
    void should_count_order_booked_without_payment_as_sold() {
        // given
        PackageLot lot = prepareContext(BOOKED_WITHOUT_PAYMENT, 1);

        // when
        packageLotQuantitySoldService.updateQuantitySold(lot);

        // then
        PackageLot reloadedLot = packageLotRepository.findById(lot.getId()).get();
        assertThat(reloadedLot.getQuantitySold()).isEqualTo(1);
    }

    @Test
    void should_count_order_delivered_as_sold() {
        // given
        PackageLot lot = prepareContext(BOOKED_WITHOUT_PAYMENT, 4);

        // when
        packageLotQuantitySoldService.updateQuantitySold(lot);

        // then
        PackageLot reloadedLot = packageLotRepository.findById(lot.getId()).get();
        assertThat(reloadedLot.getQuantitySold()).isEqualTo(4);
    }

    @Test
    void should_count_order_with_payment_aborted_as_not_sold() {
        // given
        PackageLot lot = prepareContext(PAYMENT_ABORTED, 1);

        // when
        packageLotQuantitySoldService.updateQuantitySold(lot);

        // then
        PackageLot reloadedLot = packageLotRepository.findById(lot.getId()).get();
        assertThat(reloadedLot.getQuantitySold()).isEqualTo(0);
    }

    @Test
    void should_count_the_right_quantity_with_various_order_status() {
        // given
        Customer customer = new Customer();
        customerRepository.save(customer);
        PackageLot lot = new PackageLot();
        lot.setQuantitySold(0);
        lot = packageLotRepository.save(lot);

        OrderItem item1CompletelyPaid = new OrderItem();
        item1CompletelyPaid.setQuantity(2);
        item1CompletelyPaid.setPackageLot(lot);
        Order order1CompletelyPaid = new Order();
        order1CompletelyPaid.setCustomer(customer);
        order1CompletelyPaid.setItems(List.of(item1CompletelyPaid));
        order1CompletelyPaid.setStatus(PAYMENT_COMPLETED);
        orderRepository.save(order1CompletelyPaid);
        orderItemRepository.save(item1CompletelyPaid);

        OrderItem item2CompletelyPaid = new OrderItem();
        item2CompletelyPaid.setQuantity(4);
        item2CompletelyPaid.setPackageLot(lot);
        Order order2CompletelyPaid = new Order();
        order2CompletelyPaid.setCustomer(customer);
        order2CompletelyPaid.setItems(List.of(item2CompletelyPaid));
        order2CompletelyPaid.setStatus(PAYMENT_COMPLETED);
        orderRepository.save(order2CompletelyPaid);
        orderItemRepository.save(item2CompletelyPaid);

        OrderItem itemWithPendingPayment = new OrderItem();
        itemWithPendingPayment.setQuantity(3);
        itemWithPendingPayment.setPackageLot(lot);
        Order orderWithPendingPayment = new Order();
        orderWithPendingPayment.setCustomer(customer);
        orderWithPendingPayment.setItems(List.of(itemWithPendingPayment));
        orderWithPendingPayment.setStatus(PAYMENT_PENDING);
        orderRepository.save(orderWithPendingPayment);
        orderItemRepository.save(itemWithPendingPayment);

        OrderItem itemWithAbortedPayment = new OrderItem();
        itemWithAbortedPayment.setQuantity(2);
        itemWithAbortedPayment.setPackageLot(lot);
        Order orderWithAbortedPayment = new Order();
        orderWithAbortedPayment.setCustomer(customer);
        orderWithAbortedPayment.setItems(List.of(itemWithAbortedPayment));
        orderWithAbortedPayment.setStatus(PAYMENT_ABORTED);
        orderRepository.save(orderWithAbortedPayment);
        orderItemRepository.save(itemWithAbortedPayment);

        OrderItem itemBookedWithoutPayment = new OrderItem();
        itemBookedWithoutPayment.setQuantity(1);
        itemBookedWithoutPayment.setPackageLot(lot);
        Order orderBookedWithoutPayment = new Order();
        orderBookedWithoutPayment.setCustomer(customer);
        orderBookedWithoutPayment.setItems(List.of(itemBookedWithoutPayment));
        orderBookedWithoutPayment.setStatus(BOOKED_WITHOUT_PAYMENT);
        orderRepository.save(orderBookedWithoutPayment);
        orderItemRepository.save(itemBookedWithoutPayment);

        // when
        packageLotQuantitySoldService.updateQuantitySold(lot);

        // then
        PackageLot reloadedLot = packageLotRepository.findById(lot.getId()).get();
        assertThat(reloadedLot.getQuantitySold()).isEqualTo(10);
    }


    private PackageLot prepareContext(OrderStatus orderStatus, int quantity) {
        Customer customer = new Customer();
        customerRepository.save(customer);
        PackageLot lot = new PackageLot();
        lot.setQuantitySold(0);
        lot = packageLotRepository.save(lot);
        OrderItem item = new OrderItem();
        item.setQuantity(quantity);
        item.setPackageLot(lot);
        Order order = new Order();
        order.setCustomer(customer);
        order.setItems(List.of(item));
        order.setStatus(orderStatus);
        orderRepository.save(order);
        orderItemRepository.save(item);
        return lot;
    }
}