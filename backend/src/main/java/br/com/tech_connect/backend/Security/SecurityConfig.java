package br.com.tech_connect.backend.Security;

import com.techconnect.security.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.techconnect.security.UserDetailsServiceImpl;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final UserDetailsServiceImpl userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Desativa CSRF — API REST stateless não usa sessão de formulário
            .csrf(AbstractHttpConfigurer::disable)

            // Sem sessão — autenticação é 100% via JWT
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            .authorizeHttpRequests(auth -> auth

                // -------------------------------------------------------
                // ROTAS PÚBLICAS — não exigem token
                // -------------------------------------------------------

                // Cadastro e login (auth.js → fazerCadastro / fazerLogin)
                .requestMatchers("/api/auth/**").permitAll()

                // Listagem e busca de técnicos são públicas
                // tecnicos.js → renderTecnicos() e btnBuscar funcionam sem login
                .requestMatchers(HttpMethod.GET, "/api/tecnicos").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/tecnicos/buscar").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/tecnicos/{id}").permitAll()

                // Avaliações públicas para leitura (carregarAvaliacoes no perfil-drawer)
                .requestMatchers(HttpMethod.GET, "/api/avaliacoes/tecnico/**").permitAll()

                // -------------------------------------------------------
                // ROTAS PROTEGIDAS — exigem Bearer token no header
                // -------------------------------------------------------

                // Perfil do usuário (btnMeuPerfil, salvarPerfilUsuario, inputFoto)
                .requestMatchers("/api/usuarios/**").authenticated()

                // Enviar avaliação exige login (btnAvaliar no perfil-drawer)
                .requestMatchers(HttpMethod.POST, "/api/avaliacoes").authenticated()

                // Chat exige login (abrirChat / enviarMensagem no chat.js)
                .requestMatchers("/api/mensagens/**").authenticated()

                // Favoritos exigem login (toggleFavorito no tecnicos.js)
                .requestMatchers("/api/favoritos/**").authenticated()

                // Cadastro de técnico restrito (uso admin)
                .requestMatchers(HttpMethod.POST, "/api/tecnicos").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/tecnicos/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/tecnicos/**").authenticated()

                // Qualquer outra rota não mapeada exige autenticação
                .anyRequest().authenticated()
            )

            // Registra o JwtFilter antes do filtro padrão do Spring Security
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)

            .authenticationProvider(authenticationProvider());

        return http.build();
    }

    // BCrypt para criptografar e validar senhas
    // Usado em: UsuarioService.cadastrar() e UsuarioService.autenticar()
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Provider que conecta o UserDetailsService + PasswordEncoder ao Spring Security
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    // Expõe o AuthenticationManager para uso em testes ou fluxos customizados
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }
}
