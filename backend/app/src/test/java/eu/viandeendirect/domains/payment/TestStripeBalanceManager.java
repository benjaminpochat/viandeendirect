package eu.viandeendirect.domains.payment;

import com.stripe.exception.StripeException;
import com.stripe.model.BalanceTransaction;
import eu.viandeendirect.model.PaymentsSummary;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;

class TestStripeBalanceManager {
    @Test
    void should_return_the_expected_result() throws StripeException {
        // given
        StripeBalanceManager stripeBalanceManager = Mockito.spy(StripeBalanceManager.class);
        Mockito.doReturn(Instant.parse("2024-12-25T20:30:00.00Z")).when(stripeBalanceManager).getCurrentInstant();
        Mockito.doReturn(getBalanceTransations()).when(stripeBalanceManager).getBalanceTransactions(any());

        // when
        PaymentsSummary paymentsSummary = stripeBalanceManager.getPaymentsSummary(null);

        // then
        Assertions.assertThat(paymentsSummary.getDaylyTotal()).isEqualTo(1000f);
        Assertions.assertThat(paymentsSummary.getWeeklyTotal()).isEqualTo(1500f);
        Assertions.assertThat(paymentsSummary.getMonthlyTotal()).isEqualTo(2450f);
        Assertions.assertThat(paymentsSummary.getYearlyTotal()).isEqualTo(3150f);
    }

    private Iterable<BalanceTransaction> getBalanceTransations() {
        BalanceTransaction transaction1 = createBalanceTransaction(100000l, "2024-12-25T20:10:00.00Z", "available", "charge");
        BalanceTransaction transaction2 = createBalanceTransaction(50000l, "2024-12-20T20:10:00.00Z", "available", "charge");
        BalanceTransaction transaction3 = createBalanceTransaction(20000l, "2024-11-30T21:10:00.00Z", "available", "charge");
        BalanceTransaction transaction4 = createBalanceTransaction(75000l, "2024-11-30T21:10:00.00Z", "pending", "charge");
        BalanceTransaction transaction5 = createBalanceTransaction(30000l, "2024-11-29T20:10:00.00Z", "available", "refund");
        BalanceTransaction transaction6 = createBalanceTransaction(70000l, "2024-03-30T20:10:00.00Z", "available", "charge");
        return List.of(transaction1, transaction2, transaction3, transaction4, transaction5, transaction6);
    }

    private static BalanceTransaction createBalanceTransaction(long amount, String creationDate, String status, String type) {
        BalanceTransaction transaction1 = new BalanceTransaction();
        transaction1.setAmount(amount);
        transaction1.setCreated(Instant.parse(creationDate).getEpochSecond());
        transaction1.setStatus(status);
        transaction1.setType(type);
        return transaction1;
    }

}