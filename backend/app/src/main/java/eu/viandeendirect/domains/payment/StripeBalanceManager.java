package eu.viandeendirect.domains.payment;

import com.stripe.exception.StripeException;
import com.stripe.model.BalanceTransaction;
import com.stripe.model.BalanceTransactionCollection;
import com.stripe.net.RequestOptions;
import com.stripe.param.BalanceTransactionListParams;
import eu.viandeendirect.model.PaymentsSummary;
import eu.viandeendirect.model.Producer;
import org.springframework.stereotype.Service;

import java.time.Instant;

import static java.time.temporal.ChronoUnit.*;

@Service
public class StripeBalanceManager {
    public PaymentsSummary getPaymentsSummary(Producer producer) throws StripeException {
        Iterable<BalanceTransaction> balanceTransactions = getBalanceTransactions(producer);
        Instant now = getCurrentInstant();
        Instant oneDayAgo = now.minus(1, DAYS);
        Instant oneWeekAgo = now.minus(7, DAYS);
        Instant oneMonthAgo = now.minus(30, DAYS);
        Instant oneYearAgo = now.minus(365, DAYS);
        PaymentsSummary paymentsSummary = initPaymentsSummary();
        for (BalanceTransaction balanceTransaction : balanceTransactions) {
            if (balanceTransaction.getCreated() < oneYearAgo.getEpochSecond()) {
                break;
            }
            updatePaymentSummary(paymentsSummary, balanceTransaction, oneDayAgo, oneWeekAgo, oneMonthAgo, oneYearAgo);
        }
        return paymentsSummary;
    }

    Instant getCurrentInstant() {
        Instant now = Instant.now();
        return now;
    }

    private PaymentsSummary initPaymentsSummary() {
        PaymentsSummary paymentsSummary = new PaymentsSummary();
        paymentsSummary.setDaylyTotal(0f);
        paymentsSummary.setWeeklyTotal(0f);
        paymentsSummary.setMonthlyTotal(0f);
        paymentsSummary.setYearlyTotal(0f);
        return paymentsSummary;
    }

    private void updatePaymentSummary(PaymentsSummary paymentsSummary, BalanceTransaction balanceTransaction, Instant oneDayAgo, Instant oneWeekAgo, Instant oneMonthAgo, Instant oneYearAgo) {
        if (balanceTransaction.getType().equals("charge") && balanceTransaction.getStatus().equals("available")) {
            if (balanceTransaction.getCreated() > oneDayAgo.getEpochSecond()) {
                paymentsSummary.setDaylyTotal(paymentsSummary.getDaylyTotal() + balanceTransaction.getAmount() / 100);
            }
            if (balanceTransaction.getCreated() > oneWeekAgo.getEpochSecond()) {
                paymentsSummary.setWeeklyTotal(paymentsSummary.getWeeklyTotal() + balanceTransaction.getAmount() / 100);
            }
            if (balanceTransaction.getCreated() > oneMonthAgo.getEpochSecond()) {
                paymentsSummary.setMonthlyTotal(paymentsSummary.getMonthlyTotal() + balanceTransaction.getAmount() / 100);
            }
            if (balanceTransaction.getCreated() > oneYearAgo.getEpochSecond()) {
                paymentsSummary.setYearlyTotal(paymentsSummary.getYearlyTotal() + balanceTransaction.getAmount() / 100);
            }
        }
    }

    Iterable<BalanceTransaction> getBalanceTransactions(Producer producer) throws StripeException {
        RequestOptions requestOptions = RequestOptions.builder()
                .setStripeAccount(producer.getStripeAccount().getStripeId())
                .build();
        BalanceTransactionListParams params = BalanceTransactionListParams.builder().setLimit(3L).build();
        BalanceTransactionCollection balanceTransactionCollection = BalanceTransaction.list(params, requestOptions);
        return balanceTransactionCollection.autoPagingIterable();
    }
}
