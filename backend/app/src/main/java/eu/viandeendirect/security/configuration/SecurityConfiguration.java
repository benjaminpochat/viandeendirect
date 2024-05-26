package eu.viandeendirect.security.configuration;

import eu.viandeendirect.security.KeycloakLogoutHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.session.RegisterSessionAuthenticationStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;

@Configuration
@EnableWebSecurity
@Profile("!test")
class SecurityConfiguration {

    private static final Logger LOGGER = LoggerFactory.getLogger(SecurityConfiguration.class);

    public static final String ROLE_PRODUCER = "PRODUCER";
    public static final String ROLE_CUSTOMER = "CUSTOMER";

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
        LOGGER.debug("start SecurityConfiguration#filterChain");
        http.authorizeHttpRequests(authorizeHttpRequestsCustomizer -> authorizeHttpRequestsCustomizer
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/swagger-ui").permitAll()
                        .requestMatchers("/addresses", "/addresses/**").permitAll()
                        .requestMatchers("/sales", "/sales/**").permitAll()
                        .requestMatchers("/packageTemplates", "/packageTemplates/**").hasRole(ROLE_PRODUCER)
                        .requestMatchers("/productions", "/productions/**").permitAll()
                        .requestMatchers("/beefProductions", "/beefProductions/**").permitAll()
                        .requestMatchers("/honneyProductions", "/honneyProductions/**").permitAll()
                        .requestMatchers("/customers", "/customers/**").hasAnyRole(ROLE_PRODUCER, ROLE_CUSTOMER)
                        .requestMatchers("/producers", "/producers/**").hasRole(ROLE_PRODUCER)
                        .requestMatchers("/orders", "/orders/**").hasAnyRole(ROLE_PRODUCER, ROLE_CUSTOMER)
                        .requestMatchers("/error").permitAll()
                        //TODO : enable role protection
                        //.requestMatchers("/payments/stripe/**").hasRole(ROLE_PRODUCER)
                        .requestMatchers("/payments/stripe/**").permitAll()
                );
        http.oauth2Login(Customizer.withDefaults());
        http.logout(logoutCustomizer -> logoutCustomizer.addLogoutHandler(keycloakLogoutHandler).logoutSuccessUrl("/"));
        http.oauth2ResourceServer(oAuth2ResourceServerConfigurer -> oAuth2ResourceServerConfigurer.jwt(jwtConfigurer -> jwtConfigurer.jwtAuthenticationConverter(new KeycloakJwtAuthenticationConverter())));
        http.cors(Customizer.withDefaults());
        http.csrf(AbstractHttpConfigurer::disable);
        LOGGER.debug("stop SecurityConfiguration#filterChain");
        return http.build();
    }
}
