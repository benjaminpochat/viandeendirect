package eu.viandeendirect.identity.eventlistener;


import org.keycloak.events.Event;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.events.EventType;
import org.keycloak.events.admin.AdminEvent;

import org.jboss.logging.Logger;
import org.keycloak.models.*;

public class ViandeEnDirectEventListenerProvider implements EventListenerProvider {

    private static Logger logger = Logger.getLogger(ViandeEnDirectEventListenerProvider.class);

    private KeycloakSession session;

    public ViandeEnDirectEventListenerProvider(KeycloakSession session) {
        this.session = session;
    }

    @Override
    public void onEvent(Event event) {
        logger.info("catch event of type " + event.getType().name());
        if (event.getType().equals(EventType.REGISTER)) {
            logger.info("REGISTER event details are :");
            event.getDetails().entrySet().forEach(entry -> logger.info(entry.getKey() + "=" + entry.getValue()));
            logger.info("REGISTER event clientId is : " + event.getClientId());

            RealmModel realm = session.realms().getRealm(event.getRealmId());
            UserModel user = session.users().getUserById(realm, event.getUserId());
            ClientModel client = session.clients().getClientByClientId(realm, event.getClientId());
            session.roles().getClientRolesStream(client).forEach(user::grantRole);
        }

    }

    @Override
    public void onEvent(AdminEvent adminEvent, boolean b) {

    }

    @Override
    public void close() {

    }
}
