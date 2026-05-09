package br.com.tech_connect.backend.Service;

import br.com.tech_connect.backend.Dtos.TecnicoDto;

import br.com.tech_connect.backend.Model.Favorito;
import br.com.tech_connect.backend.Model.Tecnico;
import br.com.tech_connect.backend.Model.Usuario;

import br.com.tech_connect.backend.Repository.FavoritoRepository;
import br.com.tech_connect.backend.Repository.TecnicoRepository;
import br.com.tech_connect.backend.Repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;
    private final UsuarioRepository usuarioRepository;
    private final TecnicoRepository tecnicoRepository;
    private final TecnicoService tecnicoService;

    // --- LISTAR FAVORITOS DO USUÁRIO ---
    // Chamado por: FavoritoController → getFavoritos() no tecnicos.js
    // Substitui: localStorage.getItem("favoritos")
    // Retorna lista de TecnicoDTO para renderizar os cards com ♥ já marcado
    public @Nullable List<TecnicoDto> listarPorUsuario(Long usuarioId) {
        return (List<TecnicoDto>) favoritoRepository.findByUsuarioId(usuarioId)
                .stream()
                .map(f -> tecnicoService.buscarPorId(f.getTecnico().getId()))
                .toList();
    }

    // --- ADICIONAR FAVORITO ---
    // Chamado por: FavoritoController → toggleFavorito() quando botão muda ♡ → ♥
    // Usa UniqueConstraint (usuario_id, tecnico_id) para evitar duplicatas
    @Transactional
    public void adicionar(Long usuarioId, Long tecnicoId) {
        // Verifica se já existe para evitar duplicata
        if (favoritoRepository.findByUsuarioIdAndTecnicoId(usuarioId, tecnicoId).isPresent()) {
            return; // já está favoritado, ignora silenciosamente
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Tecnico tecnico = tecnicoRepository.findById(tecnicoId)
                .orElseThrow(() -> new RuntimeException("Técnico não encontrado"));

        Favorito favorito = new Favorito();
        favorito.setUsuario(usuario);
        favorito.setTecnico(tecnico);

        favoritoRepository.save(favorito);
    }

    // --- REMOVER FAVORITO ---
    // Chamado por: FavoritoController → toggleFavorito() quando botão muda ♥ → ♡
    @Transactional
    public void remover(Long usuarioId, Long tecnicoId) {
        favoritoRepository.findByUsuarioIdAndTecnicoId(usuarioId, tecnicoId)
                .ifPresent(f -> favoritoRepository.deleteByUsuarioIdAndTecnicoId(usuarioId, tecnicoId));
    }

    // --- VERIFICAR SE É FAVORITO ---
    // Utilitário para uso interno ou endpoint futuro (/api/favoritos/verificar)
    public boolean isFavorito(Long usuarioId, Long tecnicoId) {
        return favoritoRepository.findByUsuarioIdAndTecnicoId(usuarioId, tecnicoId).isPresent();
    }
}
