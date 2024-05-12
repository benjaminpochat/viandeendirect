package eu.viandeendirect.security.configuration;

import eu.viandeendirect.security.KeycloakLogoutHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@Profile("!test")
class SecurityConfiguration {

    private static final Logger LOGGER = LoggerFactory.getLogger(SecurityConfiguration.class);

    @Value("${PRODUCER_FRONTEND_URL:http://localhost:3000}")
    String producerFrontendUrl;

    @Value("${CUSTOMER_FRONTEND_URL:http://localhost:3000}")
    String customerFrontendUrl;


    private final KeycloakLogoutHandler keycloakLogoutHandler;

    SecurityConfiguration(KeycloakLogoutHandler keycloakLogoutHandler) {
        this.keycloakLogoutHandler = keycloakLogoutHandler;
    }

    @Bean
    protected SessionAuthenticationStrategy sessionAuthenticationStrategy() {
        return new RegisterSessionAuthenticationStrategy(new SessionRegistryImpl());
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        LOGGER.debug("start SecurityConfiguration#corsConfigurationSource");
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(customerFrontendUrl, producerFrontendUrl));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "OPTIONS"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        LOGGER.debug("stop SecurityConfiguration#corsConfigurationSource");
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        LOGGER.debug("start SecurityConfiguration#filterChain");
        http.authorizeHttpRequests(authorizeHttpRequestsCustomizer -> authorizeHttpRequestsCustomizer
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/swagger-ui").permitAll()
                        .requestMatchers("/addresses", "/addresses/**").permitAll()
                        .requestMatchers("/sales", "/sales/**").permitAll()
                        .requestMatchers("/packageTemplates", "/packageTemplates/**").hasRole("PRODUCER")
                        .requestMatchers("/productions", "/productions/**").permitAll()
                        .requestMatchers("/beefProductions", "/beefProductions/**").permitAll()
                        .requestMatchers("/honneyProductions", "/honneyProductions/**").permitAll()
                        .requestMatchers("/customers", "/customers/**").authenticated()
                        .requestMatchers("/producers", "/producers/**").hasRole("PRODUCER")
                        .requestMatchers("/orders", "/orders/**").hasRole("PRODUCER")
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/payments/stripe/**").permitAll()
                );
        http.oauth2Login(Customizer.withDefaults());
        http.logout(logoutCustomizer -> logoutCustomizer.addLogoutHandler(keycloakLogoutHandler).logoutSuccessUrl("/"));
        http.oauth2ResourceServer(oAuth2ResourceServerConfigurer -> oAuth2ResourceServerConfigurer.jwt(jwtConfigurer -> jwtConfigurer.jwtAuthenticationConverter(new KeycloakJwtAuthenticationConverter())));
        http.cors(Customizer.withDefaults());
        LOGGER.debug("stop SecurityConfiguration#filterChain");
        return http.build();
    }
}
