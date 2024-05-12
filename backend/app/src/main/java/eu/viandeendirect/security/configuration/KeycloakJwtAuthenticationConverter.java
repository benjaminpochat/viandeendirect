package eu.viandeendirect.security.configuration;

import eu.viandeendirect.domains.payment.StripeService;
import jakarta.validation.constraints.NotEmpty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

import static java.util.Collections.emptySet;
import static java.util.stream.Collectors.toSet;

public class KeycloakJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private static final Logger LOGGER = LoggerFactory.getLogger(KeycloakJwtAuthenticationConverter.class);

    public static final String CUSTOMER_FRONTEND_CLIENT_ID = "viandeendirect-customer-frontend";
    public static final String PRODUCER_FRONTEND_CLIENT_ID = "viandeendirect-producer-frontend";

    @Override
    public AbstractAuthenticationToken convert(final Jwt source) {
        Collection<GrantedAuthority> authorities = Stream.concat(
                        defaultGrantedAuthoritiesConverter.convert(source).stream(),
                        extractResourceRoles(source).stream())
                .collect(Collectors.toSet());
        JwtAuthenticationToken jwtAuthenticationToken = new JwtAuthenticationToken(source, authorities);
        return jwtAuthenticationToken;
    }

    private static Collection<? extends GrantedAuthority> extractResourceRoles(final Jwt jwt) {
        LOGGER.debug("start KeycloakJwtAuthenticationConverter#extractResourceRoles");
        Map<String, Object> resourceAccess = jwt.getClaim("resource_access");
        if (resourceAccess == null) {
            return Collections.emptySet();
        }
        Map<String, Object> customerResourceAccess = (Map<String, Object>) resourceAccess.get(CUSTOMER_FRONTEND_CLIENT_ID);
        Map<String, Object> producerResourceAccess = (Map<String, Object>) resourceAccess.get(PRODUCER_FRONTEND_CLIENT_ID);
        Collection<String> resourceRoles;
        if (producerResourceAccess != null && (resourceRoles = (Collection<String>) producerResourceAccess.get("roles")) != null) {
            LOGGER.debug("stop KeycloakJwtAuthenticationConverter#extractResourceRoles : roles extractes = " + resourceRoles);
            return getGrantedAuthorities(resourceRoles);
        }
        if (customerResourceAccess != null && (resourceRoles = (Collection<String>) customerResourceAccess.get("roles")) != null) {
            LOGGER.debug("stop KeycloakJwtAuthenticationConverter#extractResourceRoles : roles extracted = " + resourceRoles);
            return getGrantedAuthorities(resourceRoles);
        }
        LOGGER.debug("stop KeycloakJwtAuthenticationConverter#extractResourceRoles : no roles extractes");
        return Collections.emptySet();
    }

    private static Set<SimpleGrantedAuthority> getGrantedAuthorities(Collection<String> resourceRoles) {
        return resourceRoles.stream()
                .map(resourceRole -> new SimpleGrantedAuthority("ROLE_" + resourceRole.toUpperCase()))
                .collect(Collectors.toSet());
    }

    private final JwtGrantedAuthoritiesConverter defaultGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();

}