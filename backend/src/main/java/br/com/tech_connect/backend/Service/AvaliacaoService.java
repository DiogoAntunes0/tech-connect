package br.com.tech_connect.backend.Service;

import br.com.tech_connect.backend.Dtos.AvaliacaoDto;
import br.com.tech_connect.backend.Model.Avaliacao;
import br.com.tech_connect.backend.Model.Tecnico;
import br.com.tech_connect.backend.Model.Usuario;
import br.com.tech_connect.backend.Repository.AvaliacaoRepository;
import br.com.tech_connect.backend.Repository.TecnicoRepository;
import br.com.tech_connect.backend.Repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AvaliacaoService {

    private final AvaliacaoRepository avaliacaoRepository;
    private final TecnicoRepository tecnicoRepository;
    private final UsuarioRepository usuarioRepository;
    private final TecnicoService tecnicoService;

    // --- LISTAR POR TÉCNICO ---
    // Chamado por: AvaliacaoController → carregarAvaliacoes() no avaliacoes.js
    // Retorna avaliações fixas (seedadas no banco) + avaliações dos usuários
    // Substitui: [...avaliacoesFixas, ...avaliacoesLocais] do localStorage
    public List<AvaliacaoDto> listarPorTecnico(Long tecnicoId) {
        return avaliacaoRepository.findByTecnicoId(tecnicoId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // --- CRIAR AVALIAÇÃO ---
    // Chamado por: AvaliacaoController → btnAvaliar.onclick no perfil-drawer.html
    // Substitui: salvarAvaliacao() + localStorage no avaliacoes.js
    // Após salvar: recalcula e persiste o rating médio do técnico
    @Transactional
    public AvaliacaoDto criar(AvaliacaoDto dto) {
        Tecnico tecnico = tecnicoRepository.findById(dto.tecnicoId())
                .orElseThrow(() -> new RuntimeException("Técnico não encontrado"));

        Avaliacao avaliacao = new Avaliacao();
        avaliacao.setTecnico(tecnico);
        avaliacao.setNota(dto.nota());
        avaliacao.setComentario(dto.comentario());

        // Usuário autenticado (opcional — pode ser anônimo "Cliente TechConnect")
        if (dto.usuarioId() != null) {
            Usuario usuario = usuarioRepository.findById(dto.usuarioId())
                    .orElse(null);
            avaliacao.setUsuario(usuario);
            avaliacao.setCliente(usuario != null ? usuario.getNome() : "Cliente TechConnect");
        } else {
            avaliacao.setCliente("Cliente TechConnect");
        }

        AvaliacaoDto criada = toDTO(avaliacaoRepository.save(avaliacao));

        // Recalcula o rating médio e atualiza o campo rating no técnico
        recalcularRating(tecnico.getId());

        return criada;
    }

    // --- DELETAR ---
    @Transactional
    public void deletar(Long id) {
        Avaliacao avaliacao = avaliacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Avaliação não encontrada"));
        Long tecnicoId = avaliacao.getTecnico().getId();
        avaliacaoRepository.deleteById(id);
        recalcularRating(tecnicoId);
    }

    // --- RECALCULAR RATING ---
    // Calcula a média das notas de todas as avaliações do técnico
    // e delega a atualização para o TecnicoService
    private void recalcularRating(Long tecnicoId) {
        Double media = avaliacaoRepository.calcularMediaByTecnicoId(tecnicoId);
        if (media != null) {
            // Arredonda para 1 casa decimal (ex: 4.8, 5.0)
            double arredondado = Math.round(media * 10.0) / 10.0;
            tecnicoService.atualizarRating(tecnicoId, arredondado);
        }
    }

    // --- MAPPER ---
    private AvaliacaoDto toDTO(Avaliacao a) {
        return new AvaliacaoDto(
                a.getId(),
                a.getTecnico().getId(),
                a.getUsuario() != null ? a.getUsuario().getId() : null,
                a.getCliente(),
                a.getNota(),
                a.getComentario(),
                a.getCriadoEm()
        );
    }
}
