package eu.viandeendirect.domains.payment;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Account;
import com.stripe.model.AccountLink;
import com.stripe.param.AccountCreateParams;
import com.stripe.param.AccountLinkCreateParams;
import eu.viandeendirect.common.ViandeEnDirectConfiguration;
import eu.viandeendirect.model.Order;
import eu.viandeendirect.model.Producer;
import eu.viandeendirect.model.StripeAccount;
import eu.viandeendirect.model.StripePayment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import static com.stripe.param.AccountLinkCreateParams.Type.ACCOUNT_ONBOARDING;

@Service
public class StripeService {

    private static final Logger LOGGER = LoggerFactory.getLogger(StripeService.class);

    @Value("${STRIPE_API_KEY:default_stripe_api_key_value}")
    public void setStripeApiKey(String stripeApiKey) {
        Stripe.apiKey = stripeApiKey;
    }

    @Autowired
    ViandeEnDirectConfiguration viandeEnDirectConfiguration;

    @Autowired
    StripeAccountRepository stripeAccountRepository;

    @Autowired
    @Qualifier("StripeDirectPaymentManager")
    StripePaymentManager stripePaymentManager;

    public StripeAccount createStripeAccount(Producer producer) throws StripeException {
        Account account = Account.create(
                AccountCreateParams.builder()
                        .setType(AccountCreateParams.Type.STANDARD)
                        .setCapabilities(AccountCreateParams.Capabilities.builder()
                                .build())
                        .build()
        );
        StripeAccount stripeAccount = new StripeAccount();
        stripeAccount.setStripeId(account.getId());
        stripeAccount.setDetailsSubmitted(account.getDetailsSubmitted());
        return stripeAccountRepository.save(stripeAccount);
    }

    public void getStripeAccountStatus(StripeAccount stripeAccount) throws StripeException {
        Account.retrieve(stripeAccount.getStripeId());
    }

    public void loadStripeAccount(StripeAccount stripeAccount) throws StripeException {
        Account account = Account.retrieve(stripeAccount.getStripeId());
        AccountLink accountLink = AccountLink.create(
                AccountLinkCreateParams.builder()
                        .setAccount(stripeAccount.getStripeId())
                        .setReturnUrl(viandeEnDirectConfiguration.getProducerFrontendUrl() + "/account")
                        .setRefreshUrl(viandeEnDirectConfiguration.getProducerFrontendUrl() + "/account")
                        .setType(ACCOUNT_ONBOARDING)
                        .build()
        );
        stripeAccount.setDetailsSubmitted(account.getDetailsSubmitted());
        stripeAccount.setAccountLink(accountLink.getUrl());
    }

    public StripePayment createPayment(Order order) throws StripeException {
        return stripePaymentManager.createPayment(order);
    }

    public void processPaymentValidation(Order order) {
        stripePaymentManager.processPaymentValidation(order);
    }
}
