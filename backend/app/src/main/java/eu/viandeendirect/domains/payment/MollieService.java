package eu.viandeendirect.domains.payment;

import com.fasterxml.jackson.databind.ObjectMapper;
import eu.viandeendirect.model.Producer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

@Service
public class MollieService {

    private static final Logger LOGGER = LoggerFactory.getLogger(MollieService.class);
    @Value("${mollie.client-id}")
    String mollieClientId;

    @Value("${mollie.client-secret}")
    String mollieClientSecret;

    @Value("${mollie.redirect-url}")
    String mollieRedirectUrl;

    @Value("${mollie.authorization-url}")
    String mollieAuthorizationUrl;

    @Value("${mollie.access-token-url}")
    String mollieAccessTokenUrl;

    @Value("${mollie.resource-owner-url}")
    String mollieResourceOwnerUrl;

    public String getRefreshTokenWithAuthorizationCode(String authorizationCode) {
        String requestBody = getRequestBodyToGetAccessTokenWithAuthorizationCode(authorizationCode);
        return postRequestBodyToGetTokenAccess(requestBody).refresh_token();
    }

    public String getAccessTokenWithRefreshToken(Producer producer) {
        String requestBody = getRequestBodyToGetAccessTokenWithRefreshToken(producer);
        return postRequestBodyToGetTokenAccess(requestBody).access_token();
    }

    private String getRequestBodyToGetAccessTokenWithAuthorizationCode(String authorizationCode) {
        return String.format("client_id=%s&client_secret=%s&redirect_uri=%s&grant_type=authorization_code&code=%s",
                mollieClientId,
                mollieClientSecret,
                mollieRedirectUrl,
                authorizationCode);
    }

    private String getRequestBodyToGetAccessTokenWithRefreshToken(Producer producer) {
        String requestBody = String.format("client_id=%s&client_secret=%s&redirect_uri=%s&grant_type=refresh_token&refresh_token=%s",
                mollieClientId,
                mollieClientSecret,
                mollieRedirectUrl,
                producer.getMollieRefreshToken());
        return requestBody;
    }

    private AccessToken postRequestBodyToGetTokenAccess(String requestBody) {
        try {
            URL url = new URL(mollieAccessTokenUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setDoOutput(true);
            connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            try (DataOutputStream dataOutputStream = new DataOutputStream(connection.getOutputStream())) {
                dataOutputStream.writeBytes(requestBody);
                InputStream dataInputStream = connection.getInputStream();
                String responseAsString = getResponseBodyAsStringForAccessToken(dataInputStream);
                ObjectMapper mapper = new ObjectMapper();
                LOGGER.debug("Access token returned by Mollie is : {}", responseAsString);
                return mapper.readValue(responseAsString, AccessToken.class);
            } catch (IOException e) {
                InputStream errorStream = connection.getErrorStream();
                String responseAsString = getResponseBodyAsStringForAccessToken(errorStream);
                LOGGER.error("An error occurred while retrieving Mollie access token : {}", responseAsString);
                throw new RuntimeException(e);
            }
        } catch (IOException e) {
            LOGGER.error("An exception occurred while retrieving Mollie access token", e);
            throw new RuntimeException(e);
        }
    }

    private String getResponseBodyAsStringForAccessToken(InputStream dataInputStream) {
        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(dataInputStream));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
                response.append("\r");
            }
            reader.close();
            return response.toString();
        } catch (IOException e) {
            LOGGER.error(String.format("An error occurred while reading http response for url %s", mollieAccessTokenUrl), e);
            throw new RuntimeException(e);
        }
    }

    private record AccessToken(String access_token, String refresh_token, int expires_in, String token_type, String scope) {}
}
