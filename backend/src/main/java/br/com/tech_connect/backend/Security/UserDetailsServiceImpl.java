package br.com.tech_connect.backend.Security;

import br.com.tech_connect.backend.Model.Usuario;
import br.com.tech_connect.backend.Repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    // Chamado pelo JwtFilter para carregar o usuário do banco pelo e-mail
    // O Spring Security usa o UserDetails retornado para verificar a autenticação
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Usuário não encontrado com e-mail: " + email
                ));

        return User.builder()
                .username(usuario.getEmail())
                .password(usuario.getSenha()) // já está em BCrypt
                .roles("USER")               // expandir para ROLE_TECNICO, ROLE_ADMIN futuramente
                .build();
    }
}
