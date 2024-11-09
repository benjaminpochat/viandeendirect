package eu.viandeendirect.domains.registration;

import eu.viandeendirect.api.RegistrationsApiDelegate;
import eu.viandeendirect.common.EmailService;
import eu.viandeendirect.model.Registration;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class RegistrationsService implements RegistrationsApiDelegate {

    @Autowired
    EmailService emailService;

    @Override
    public ResponseEntity<Void> processRegistration(Registration registration) {
        try {
            emailService.sendMail(
                    "la.viande.en.direct@gmail.com",
                    "Nouvelle demande d'inscription d'un producteur sur ViandeEnDirect.eu",
                    String.format("""
                            <html>
                                Nouvelle demande d'inscription d'un producteur :
                                <br>
                                <br>
                                <div>
                                    <b>Nom :</b><br>
                                     %s<br>
                                </div>
                                <br>
                                <div>
                                    <b>Prénom :</b><br>
                                     %s<br>
                                </div>
                                <br>
                                <div>
                                    <b>Email :</b><br>
                                     %s<br>
                                </div>
                                <br>
                                <div>
                                    <b>Téléphone :</b><br>
                                    %s<br>
                                </div>
                                <br>
                                <div>
                                    <b>Nom de l'exploitation agricole :</b><br>
                                     %s<br>
                                </div>
                                <br>
                                <div>
                                    <b>N° SIREN de l'exploitation agricole :</b><br>
                                     %s<br>
                                </div>
                                <br>
                                <div>
                                    <b>Description de la production :</b><br>
                                     %s<br>
                                </div>
                            </html>
                            """,
                            registration.getProducer().getUser().getFirstName(),
                            registration.getProducer().getUser().getLastName(),
                            registration.getProducer().getUser().getEmail(),
                            registration.getProducer().getUser().getPhone(),
                            registration.getProducer().getLegalName(),
                            registration.getProducer().getLegalIdentificationNumber(),
                            registration.getProductionDescription()
                    )
            );
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
