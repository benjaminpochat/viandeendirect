package eu.viandeendirect.domains.payment;

import eu.viandeendirect.domains.payment.MollieService;
import eu.viandeendirect.model.Producer;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@SpringBootTest
@ActiveProfiles(value = "test")
@ExtendWith({SpringExtension.class})
@Disabled
/**
 * To authorize payment on behalf of another mollie account :
 * https://my.mollie.com/oauth2/authorize?client_id=app_JSUEw3CWPXcEhFDkCiRCXbPs&state=54951&scope=payments.write&response_type=code&redirect_uri=https%3A%2F%2Fcustomer.sandbox.viandeendirect.eu
 */
class TestMollieService {

    @Autowired
    private MollieService mollieService;

    @Test
    void mollieClientId_should_contain_the_right_value() {
        // then
        Assertions.assertThat(mollieService.mollieAccessTokenUrl).isEqualTo("https://api.mollie.com/oauth2/tokens");
    }

    @Test
    void getRefreshTokenWithAuthorizationCode_should_retreive_an_access_token() {
        // given
        String authorizationCode = "auth_NbR5z7VqNjbS43j2p4WaNSyvaBtgs2";

        // when
        String refreshToken = mollieService.getRefreshTokenWithAuthorizationCode(authorizationCode);

        // then
        Assertions.assertThat(refreshToken)
                .isNotEmpty()
                .startsWith("refresh_");
    }

    @Test
    void getAccessTokenWithRefreshToken_should_retrieve_an_access_token() {
        // given
        Producer producer = new Producer();
        producer.setMollieRefreshToken("refresh_CQMGnQv87GyJvt9BMVM6THjyPwsgva");

        // when
        String accessToken = mollieService.getAccessTokenWithRefreshToken(producer);

        // then
        Assertions.assertThat(accessToken)
                .isNotEmpty()
                .startsWith("access_");
    }
}