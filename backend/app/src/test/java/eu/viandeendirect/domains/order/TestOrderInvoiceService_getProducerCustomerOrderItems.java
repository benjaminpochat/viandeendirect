package eu.viandeendirect.domains.order;

import eu.viandeendirect.domains.order.OrderInvoiceService.ProducerCustomerOrderItems;
import eu.viandeendirect.model.BeefProduction;
import eu.viandeendirect.model.Order;
import eu.viandeendirect.model.PackageLot;
import eu.viandeendirect.model.Sale;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import static eu.viandeendirect.domains.order.OrderTestUtils.*;
import static eu.viandeendirect.domains.order.OrderTestUtils.createCustomer;
import static org.mockito.Mockito.*;

class TestOrderInvoiceService_getProducerCustomerOrderItems {

    @Test
    void should_act_as_expected() {
        // given
        OrderInvoiceService service = mock(OrderInvoiceService.class);
        doCallRealMethod().when(service).getProducerCustomerOrderItems(any());

        BeefProduction beefProduction = getBeefProduction();

        PackageLot packageLot1 = getPackageLot(1, beefProduction,
                "Colis tradition",
                "Le colis tradition est composé de plein de trucs bons",
                10f);

        PackageLot packageLot2 = getPackageLot(2, beefProduction,
                "Filet",
                "Le colis tradition est aussi composé de plein de trucs bons",
                0.5f);

        Sale sale = new Sale();
        sale.setDeliveryStart(OffsetDateTime.parse("2021-09-30T15:30:00+01:00"));

        Order order1 = createOrder(123, createCustomer("Valentine", "DURAND", "0601020304"), Map.of(packageLot1, 1, packageLot2, 2));
        Order order2 = createOrder(124, createCustomer("Thibaut", "ENCOSTUME-MONFISS", "0304050607"), Map.of(packageLot1, 2));
        sale.setOrders(List.of(order1, order2));

        // when
        Stream<ProducerCustomerOrderItems> producerCustomerOrderItems = service.getProducerCustomerOrderItems(sale);

        // then
        List<ProducerCustomerOrderItems> producerCustomerOrderItemsList = producerCustomerOrderItems.toList();
        Assertions.assertThat(producerCustomerOrderItemsList).hasSize(2);
    }

}