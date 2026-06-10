package br.com.tech_connect.backend.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {

    // Origens permitidas definidas no application.properties
    // app.cors.allowed-origins=http://localhost:5500,http://127.0.0.1:5500
    @Value("${app.cors.allowed-origins}")
    private List<String> allowedOrigins;

    // Libera o front-end (Live Server na porta 5500) para chamar a API na 8080
    // Sem isso o browser bloqueia todas as requisições do auth.js, tecnicos.js, etc.
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Origens do front (dev: Live Server / prod: domínio real)
        config.setAllowedOrigins(allowedOrigins);

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));

        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);

        return new CorsFilter(source);
    }
}
