package eu.viandeendirect.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.mail.MessagingException;
import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.stream.Collectors;

public interface NotificationService<T> {

    static final Logger LOGGER = LoggerFactory.getLogger(NotificationService.class);

    String getSubject(T object);

    String getRecipient(T object);

    Object[] getTemplateValues(T object);

    EmailService getEmailService();

    String getBodyTemplatePath();

    default void notify(T object) {
        String recipient = getRecipient(object);
        String subject = getSubject(object);
        String body = getBody(object);
        sendMail(recipient, subject, body);
    };

    default String getBody(T object){
        String bodyTemplate = getBodyTemplate();
        Object[] bodyTemplateVariables = getTemplateValues(object);
        return String.format(bodyTemplate, bodyTemplateVariables);
    }

    default String getBodyTemplate() {
        try {
            return Files.lines(Paths.get(getClass().getClassLoader().getResource(getBodyTemplatePath()).toURI())).collect(Collectors.joining());
        } catch (IOException | URISyntaxException composingMailException) {
            LOGGER.error("An exception occured while composing an email.", composingMailException);
            return null;
        }
    }

    default void sendMail(String recipient, String subject, String body) {
        try {
            getEmailService().sendMail(recipient, subject, body);
        } catch (MessagingException messagingException) {
            LOGGER.error("An exception occured while sending an email.", messagingException);
        }
    }
}
