package eu.viandeendirect.common;

import jakarta.mail.*;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Properties;

@Service
public class EmailService {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmailService.class);

    @Value("${SMTP_HOST:smtp.gmail.com}")
    private String host;

    @Value("${SMTP_PORT:587}")
    private String port;

    @Value("${SMTP_AUTHENTICATION:true}")
    private boolean authentication;

    @Value("${SMTP_USER_NAME:unknown}")
    private String userName;

    @Value("${SMTP_PASSWORD:unknown}")
    private String password;

    @Value("${SMTP_START_TLS:true}")
    private boolean startTls;

    @Value("${SMTP_SSL_TRUST:unknown}")
    private String sslTrust;

    @Value("${EMAIL_DISABLED:true}")
    private boolean emailDisabled;

    public void sendMail(String recipient, String subject, String body) throws MessagingException {
        if (emailDisabled) {
            LOGGER.warn("email notifications have been disabled");
            return;
        }
        Session session = Session.getInstance(getProperties(), new SimpleAuthenticator());
        MimeMessage msg = new MimeMessage(session);
        msg.setFrom("la.viande.en.direct@gmail.com");
        msg.setRecipients(Message.RecipientType.TO, recipient);
        msg.setSubject(subject);
        msg.setText(body, "UTF-8", "html");
        Transport.send(msg, userName, password);
    }

    private Properties getProperties() {
        var properties = new Properties();
        properties.put("mail.smtp.auth", authentication);
        properties.put("mail.smtp.starttls.enable", startTls);
        properties.put("mail.smtp.host", host);
        properties.put("mail.smtp.port", port);
        properties.put("mail.smtp.ssl.trust", sslTrust);
        return properties;
    }

    private class SimpleAuthenticator extends Authenticator {
    }
}

