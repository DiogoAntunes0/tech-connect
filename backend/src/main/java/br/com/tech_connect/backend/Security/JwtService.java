package br.com.tech_connect.backend.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
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

    public String gerarToken(Long usuarioId, String email) {
        return Jwts.builder()
                .setSubject(email)
                .claim("usuarioId", usuarioId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getKey()) // HS256 inferido automaticamente
                .compact();
    }

    // Extrai o e-mail do token
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

    // Decodifica o secret de Base64 — mais seguro que getBytes()
    private Key getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}