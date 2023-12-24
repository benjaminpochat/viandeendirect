package eu.viandeendirect.security.configuration;

import jakarta.validation.constraints.NotEmpty;
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

    private final String resourceId;

    public KeycloakJwtAuthenticationConverter(String resourceId) {
        this.resourceId = resourceId;
    }

    @Override
    public AbstractAuthenticationToken convert(final Jwt source) {
        Collection<GrantedAuthority> authorities = Stream.concat(
                        defaultGrantedAuthoritiesConverter.convert(source).stream(),
                        extractResourceRoles(source, resourceId).stream())
                .collect(Collectors.toSet());
        JwtAuthenticationToken jwtAuthenticationToken = new JwtAuthenticationToken(source, authorities);
        return jwtAuthenticationToken;
    }

    private static Collection<? extends GrantedAuthority> extractResourceRoles(final Jwt jwt, final String resourceId) {
        Map<String, Object> resourceAccess = jwt.getClaim("resource_access");
        Map<String, Object> resource;
        Collection<String> resourceRoles;
        if (resourceAccess != null && (resource = (Map<String, Object>) resourceAccess.get(resourceId)) != null &&
                (resourceRoles = (Collection<String>) resource.get("roles")) != null)
            return resourceRoles.stream()
                    .map(resourceRole -> new SimpleGrantedAuthority("ROLE_" + resourceRole.toUpperCase()))
                    .collect(Collectors.toSet());
        return Collections.emptySet();
    }

    private final JwtGrantedAuthoritiesConverter defaultGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();

}