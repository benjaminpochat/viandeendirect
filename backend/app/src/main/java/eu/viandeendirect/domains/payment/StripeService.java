package eu.viandeendirect.domains.payment;

import com.stripe.exception.StripeException;
import com.stripe.model.Account;
import com.stripe.model.AccountLink;
import com.stripe.param.AccountCreateParams;
import com.stripe.param.AccountLinkCreateParams;
import eu.viandeendirect.model.Producer;
import eu.viandeendirect.model.StripeAccount;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class StripeService {

    private static final Logger LOGGER = LoggerFactory.getLogger(StripeService.class);

    @Value("${PRODUCER_FRONTEND_URL:http://localhost:3000}")
    String viandeendirectProducerFrontendUrl;

    @Autowired
    StripeAccountRepository stripeAccountRepository;

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
        return stripeAccountRepository.save(stripeAccount);
    }

    public void getStripeAccountStatus(StripeAccount stripeAccount) throws StripeException {
        Account.retrieve(stripeAccount.getStripeId());
    }

    public void setStripeAccountLink(StripeAccount stripeAccount) throws StripeException {
        AccountLink accountLink = AccountLink.create(
                AccountLinkCreateParams.builder()
                        .setAccount(stripeAccount.getStripeId())
                        .setReturnUrl(viandeendirectProducerFrontendUrl + "/payments/stripe/acknowledge/" + stripeAccount.getStripeId())
                        .setRefreshUrl(viandeendirectProducerFrontendUrl + "/payments/stripe/refresh" + stripeAccount.getStripeId())
                        .setType(AccountLinkCreateParams.Type.ACCOUNT_ONBOARDING)
                        .build()
        );
        stripeAccount.setAccountLink(accountLink.getUrl());
        stripeAccountRepository.save(stripeAccount);
    }
}
