package eu.viandeendirect.security.configuration;

import eu.viandeendirect.security.component.KeycloakLogoutHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.session.RegisterSessionAuthenticationStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;

import java.util.List;

@Configuration
@EnableWebSecurity
class SecurityConfiguration {

    private final KeycloakLogoutHandler keycloakLogoutHandler;

    SecurityConfiguration(KeycloakLogoutHandler keycloakLogoutHandler) {
        this.keycloakLogoutHandler = keycloakLogoutHandler;
    }

    @Bean
    protected SessionAuthenticationStrategy sessionAuthenticationStrategy() {
        return new RegisterSessionAuthenticationStrategy(new SessionRegistryImpl());
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors();
        http
                .authorizeHttpRequests()
                .requestMatchers("/swagger-ui")
                .anonymous()
            .and()
                .authorizeHttpRequests()
                .requestMatchers("/sales")
                .anonymous()
            .and()
                .authorizeHttpRequests()
                .requestMatchers("/productions")
                .hasRole("GROWER")
            .and()
                .authorizeHttpRequests()
                .requestMatchers("/beefProductions/*")
                .hasRole("GROWER")
            .and()
                .authorizeHttpRequests()
                .requestMatchers("/honneyProductions/*")
                .hasRole("GROWER")
            .and()
                .authorizeHttpRequests()
                .requestMatchers("/orders")
                .authenticated()
            .and()
                .authorizeHttpRequests()
                .requestMatchers("/error")
                .permitAll();
        http.oauth2Login()
                .and()
                .logout()
                .addLogoutHandler(keycloakLogoutHandler)
                .logoutSuccessUrl("/");
        http.oauth2ResourceServer()
                .jwt()
                .jwtAuthenticationConverter(new KeycloakJwtAuthenticationConverter("backend"));
        return http.build();
    }
}
