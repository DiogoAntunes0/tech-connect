package br.com.tech_connect.backend.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration-ms}")
    private long expirationMs;

    // Gera o token JWT com o id e email do usuário
    // Chamado por: UsuarioService.autenticar() após validar credenciais
    // O front guarda este token no localStorage e envia em todas as requisições protegidas:
    // headers: { Authorization: `Bearer ${token}` }
    public String gerarToken(Long usuarioId, String email) {
        return Jwts.builder()
                .setSubject(email)
                .claim("usuarioId", usuarioId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Extrai o e-mail do token (usado como identificador principal)
    public String extrairEmail(String token) {
        return extrairClaims(token).getSubject();
    }

    // Extrai o id do usuário embutido no token
    public Long extrairUsuarioId(String token) {
        return extrairClaims(token).get("usuarioId", Long.class);
    }

    // Valida se o token não expirou e pertence ao e-mail informado
    public boolean isTokenValido(String token, String email) {
        try {
            String emailToken = extrairEmail(token);
            return emailToken.equals(email) && !isTokenExpirado(token);
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isTokenExpirado(String token) {
        return extrairClaims(token).getExpiration().before(new Date());
    }

    private Claims extrairClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
}
