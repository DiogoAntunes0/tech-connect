package br.com.tech_connect.backend.Service;

import br.com.tech_connect.backend.Dtos.CadastroDto;
import br.com.tech_connect.backend.Dtos.LoginDto;
import br.com.tech_connect.backend.Dtos.UsuarioDto;

import br.com.tech_connect.backend.Model.Usuario;

import br.com.tech_connect.backend.Repository.UsuarioRepository;

import br.com.tech_connect.backend.Security.JwtService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public UsuarioDto cadastrar(CadastroDto dto) {
        if (usuarioRepository.existsByEmail(dto.email())) {
            throw new RuntimeException("E-mail já cadastrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());
        usuario.setSenha(passwordEncoder.encode(dto.senha()));

        return toDTO(usuarioRepository.save(usuario));
    }


    public String autenticar(LoginDto dto) {
        Usuario usuario = usuarioRepository.findByEmail(dto.email())
                .orElseThrow(() -> new RuntimeException("Credenciais inválidas"));

        if (!passwordEncoder.matches(dto.senha(), usuario.getSenha())) {
            throw new RuntimeException("Credenciais inválidas");
        }

        return jwtService.gerarToken(usuario.getId(), usuario.getEmail());
    }

    // --- BUSCAR POR ID ---
    // Chamado por: UsuarioController.buscarPorId → btnMeuPerfil.onclick
    public UsuarioDto buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return toDTO(usuario);
    }

    @Transactional
    public UsuarioDto atualizar(Long id, UsuarioDto dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());
        usuario.setBio(dto.bio());
        usuario.setIdade(dto.idade());
        usuario.setValorHora(dto.valorHora());
        usuario.setEspecialidades(dto.especialidades());
        usuario.setProjetos(dto.projetos());

        return toDTO(usuarioRepository.save(usuario));
    }

    // --- ATUALIZAR FOTO ---
    // Recebe base64 da imagem (inputFoto.onchange)
    // Em produção: salvar em bucket S3/GCS e retornar URL pública
    // Por ora: persiste o base64 diretamente no campo foto
    @Transactional
    public String atualizarFoto(Long id, String foto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuario.setFoto(foto);
        usuarioRepository.save(usuario);
        return foto;
    }

    // --- MAPPER ---
    // Nunca retorna a senha para o front
    private UsuarioDto toDTO(Usuario u) {
        return new UsuarioDto(
                u.getId(),
                u.getNome(),
                u.getEmail(),
                u.getFoto(),
                u.getIdade(),
                u.getValorHora(),
                u.getBio(),
                u.getEspecialidades(),
                u.getProjetos()
        );
    }
}
