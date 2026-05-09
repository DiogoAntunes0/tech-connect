package br.com.tech_connect.backend.Service;

import br.com.tech_connect.backend.Dtos.TecnicoDto;

import br.com.tech_connect.backend.Dtos.ProjetoDto;
import br.com.tech_connect.backend.Dtos.TecnicoDto;

import br.com.tech_connect.backend.Model.Projeto;
import br.com.tech_connect.backend.Model.Tecnico;

import br.com.tech_connect.backend.Repository.TecnicoRepository;

import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TecnicoService {

    private final TecnicoRepository tecnicoRepository;

    // --- LISTAR TODOS ---
    // Chamado por: TecnicoController.listar → tecnicos.js → renderTecnicos()
    // Substitui o array hardcoded `const tecnicos = [...]` no front
    public @Nullable List<TecnicoDto> listarTodos() {
        return tecnicoRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // --- BUSCAR POR TERMO ---
    // Chamado por: TecnicoController.buscar → btnBuscar → renderTecnicos(filtro)
    // Filtra por nome, área, cidade ou qualquer skill (query JPQL no repository)
    public @Nullable List<TecnicoDto> buscarPorTermo(String termo) {
        if (termo == null || termo.isBlank()) {
            return listarTodos();
        }
        return tecnicoRepository.buscarPorTermo(termo)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // --- BUSCAR POR ID ---
    // Chamado por: TecnicoController.buscarPorId → abrirPerfil(tecnico)
    // Retorna TecnicoDTO com projetos e skills embutidos
    public TecnicoDto buscarPorId(Long id) {
        Tecnico tecnico = tecnicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Técnico não encontrado"));
        return toDTO(tecnico);
    }

    // --- CADASTRAR ---
    // Chamado por: TecnicoController.cadastrar
    // Cria técnico com skills e projetos vinculados
    @Transactional
    public TecnicoDto cadastrar(TecnicoDto dto) {
        Tecnico tecnico = toEntity(dto);
        return toDTO(tecnicoRepository.save(tecnico));
    }

    // --- ATUALIZAR ---
    // Chamado por: TecnicoController.atualizar → salvarPerfilUsuario (quando for técnico)
    // Atualiza todos os campos editáveis, inclusive lista de skills
    @Transactional
    public TecnicoDto atualizar(Long id, TecnicoDto dto) {
        Tecnico tecnico = tecnicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Técnico não encontrado"));

        tecnico.setNome(dto.nome());
        tecnico.setArea(dto.area());
        tecnico.setCidade(dto.cidade());
        tecnico.setIdade(dto.idade());
        tecnico.setValorHora(dto.valorHora());
        tecnico.setBio(dto.bio());
        tecnico.setSucesso(dto.sucesso());
        tecnico.setResposta(dto.resposta());
        tecnico.setFoto(dto.foto());
        tecnico.setSkills(dto.skills());

        return toDTO(tecnicoRepository.save(tecnico));
    }

    // --- ATUALIZAR RATING ---
    // Chamado internamente pelo AvaliacaoService após cada nova avaliação
    // Recalcula a média e persiste no campo rating do técnico
    @Transactional
    public void atualizarRating(Long tecnicoId, Double novoRating) {
        Tecnico tecnico = tecnicoRepository.findById(tecnicoId)
                .orElseThrow(() -> new RuntimeException("Técnico não encontrado"));
        tecnico.setRating(novoRating);
        tecnicoRepository.save(tecnico);
    }

    // --- DELETAR ---
    @Transactional
    public void deletar(Long id) {
        if (!tecnicoRepository.existsById(id)) {
            throw new RuntimeException("Técnico não encontrado");
        }
        tecnicoRepository.deleteById(id);
    }

    // --- MAPPER ENTITY → DTO ---
    private TecnicoDto toDTO(Tecnico t) {
        List<ProjetoDto> projetos = t.getProjetos() == null ? List.of() :
                t.getProjetos().stream()
                        .map(p -> new ProjetoDto(
                                p.getId(),
                                t.getId(),
                                p.getTitulo(),
                                p.getDescricao(),
                                p.getImagem()
                        ))
                        .toList();

        return new TecnicoDto(
                t.getId(),
                t.getNome(),
                t.getArea(),
                t.getCidade(),
                t.getIdade(),
                t.getValorHora(),
                t.getRating(),
                t.getFoto(),
                t.getBio(),
                t.getSucesso(),
                t.getResposta(),
                t.getAtendimentos(),
                t.getSkills(),
                projetos
        );
    }

    // --- MAPPER DTO → ENTITY ---
    private Tecnico toEntity(TecnicoDto dto) {
        Tecnico tecnico = new Tecnico();
        tecnico.setNome(dto.nome());
        tecnico.setArea(dto.area());
        tecnico.setCidade(dto.cidade());
        tecnico.setIdade(dto.idade());
        tecnico.setValorHora(dto.valorHora());
        tecnico.setBio(dto.bio());
        tecnico.setSucesso(dto.sucesso());
        tecnico.setResposta(dto.resposta());
        tecnico.setFoto(dto.foto());
        tecnico.setSkills(dto.skills());

        if (dto.projetos() != null) {
            List<Projeto> projetos = dto.projetos().stream().map(p -> {
                Projeto projeto = new Projeto();
                projeto.setTitulo(p.titulo());
                projeto.setDescricao(p.descricao());
                projeto.setImagem(p.imagem());
                projeto.setTecnico(tecnico);
                return projeto;
            }).toList();
            tecnico.setProjetos(projetos);
        }

        return tecnico;
    }
}
