package eu.viandeendirect.domains.payment;

import eu.viandeendirect.model.OrderItem;
import eu.viandeendirect.model.PackageLot;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.*;

class TestStripePaymentManager_getUnitAmount {

    @Test
    void testGetUnitAmount() {
        // given
        StripePaymentManager stripePaymentManagerImpl = Mockito.mock(StripePaymentManager.class);
        Mockito.doCallRealMethod().when(stripePaymentManagerImpl).getUnitAmount(Mockito.any());
        PackageLot packageLot = new PackageLot();
        packageLot.setNetWeight(0.2f);
        OrderItem orderItem = new OrderItem();
        orderItem.setUnitPrice(0.2f);
        orderItem.setPackageLot(packageLot);

        // when
        long unitAmount = stripePaymentManagerImpl.getUnitAmount(orderItem);

        // then
        Assertions.assertThat(unitAmount).isEqualTo(4);
    }

}