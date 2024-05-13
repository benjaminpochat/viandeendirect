package eu.viandeendirect.domains.payment;

import com.stripe.model.Account;
import com.stripe.model.AccountLink;
import com.stripe.param.AccountCreateParams;
import com.stripe.param.AccountLinkCreateParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * @link <a href=https://docs.stripe.com/connect/onboarding/quickstart#init-stripe>Stripe doc</a>
 */
@RestController
public class StripeApiController {

    private static final Logger LOGGER = LoggerFactory.getLogger(StripeApiController.class);

    @Value("${PRODUCER_FRONTEND_URL:http://localhost:3000}")
    String viandeendirectProducerFrontendUrl;

    @PostMapping(value = "/tests/payments/stripe/account", produces = "application/json")
    public ResponseEntity<StripeResponse> createAccount() {
        try {
            Account account = Account.create(
                    AccountCreateParams.builder()
                            .setType(AccountCreateParams.Type.STANDARD)
                            .setCapabilities(AccountCreateParams.Capabilities.builder()
                                    .build())
                            .build()
            );
            StripeResponse stripeResponse = new StripeResponse(new StripeAccount(account.getId(), null), null);
            return new ResponseEntity<>(stripeResponse, HttpStatus.OK);
        } catch (Exception e) {
            LOGGER.error("An error occurred when calling the Stripe API to create an account", e);
            StripeResponse stripeResponse = new StripeResponse(null, e.getMessage());
            return new ResponseEntity<>(stripeResponse, HttpStatus.INTERNAL_SERVER_ERROR);
       }
    }

    @PostMapping(value = "/tests/payments/stripe/accountLink", consumes = "application/json", produces = "application/json")
    public ResponseEntity<StripeResponse> createAccountLink(@RequestBody StripeAccount account) {
        try {
            AccountLink accountLink = AccountLink.create(
                    AccountLinkCreateParams.builder()
                            .setAccount(account.accountId)
                            .setReturnUrl(viandeendirectProducerFrontendUrl + "/payments/stripe/acknowledge/" + account.accountId)
                            .setRefreshUrl(viandeendirectProducerFrontendUrl + "/payments/stripe/refresh" + account.accountId)
                            .setType(AccountLinkCreateParams.Type.ACCOUNT_ONBOARDING)
                            .build()
            );
            StripeResponse stripeResponse = new StripeResponse(new StripeAccount(account.accountId, accountLink.getUrl()), null);
            return new ResponseEntity<>(stripeResponse, HttpStatus.OK);
        } catch (Exception e) {
            LOGGER.error("An error occurred when calling the Stripe API to create an account link", e);
            StripeResponse stripeResponse = new StripeResponse(null, e.getMessage());
            return new ResponseEntity<>(stripeResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public record StripeResponse (StripeAccount account, String error){}
    public record StripeAccount(String accountId, String onBoardingUrl){}
}
