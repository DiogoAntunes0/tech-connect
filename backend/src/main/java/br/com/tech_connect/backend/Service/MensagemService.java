package br.com.tech_connect.backend.Service;

import br.com.tech_connect.backend.Dtos.MensagemDto;
import br.com.tech_connect.backend.Repository.MensagemRepository;
import br.com.tech_connect.backend.Repository.TecnicoRepository;
import br.com.tech_connect.backend.Repository.UsuarioRepository;

import br.com.tech_connect.backend.Dtos.MensagemDto;

import br.com.tech_connect.backend.Model.Mensagem;
import br.com.tech_connect.backend.Model.Tecnico;
import br.com.tech_connect.backend.Model.Usuario;

import br.com.tech_connect.backend.Repository.MensagemRepository;
import br.com.tech_connect.backend.Repository.TecnicoRepository;
import br.com.tech_connect.backend.Repository.UsuarioRepository;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MensagemService {

    private final MensagemRepository mensagemRepository;
    private final UsuarioRepository usuarioRepository;
    private final TecnicoRepository tecnicoRepository;

    // --- HISTÓRICO ---
    // Chamado por: MensagemController → carregarMensagens() no chat.js
    // Substitui: localStorage.getItem("chat_" + tecnico.nome)
    // Retorna mensagens ordenadas por enviadoEm ASC para exibir cronologicamente
    // O campo enviadoPeloUsuario substitui o campo { eu: true/false } do front
    public @Nullable List<MensagemDto> historico(Long usuarioId, Long tecnicoId) {
        return mensagemRepository
                .findByUsuarioIdAndTecnicoIdOrderByEnviadoEmAsc(usuarioId, tecnicoId)
                .stream()
                .map(this::toDTO)
                .toList();
    }


    // --- ENVIAR MENSAGEM ---
    // Chamado por: MensagemController → enviarMensagem() no chat.js
    // Substitui: localStorage.setItem("chat_" + tecnico.nome, ...)
    // dto.enviadoPeloUsuario = true  → mensagem do cliente (lado direito no chat)
    // dto.enviadoPeloUsuario = false → resposta do técnico (lado esquerdo no chat)
    // NOTA: a resposta automática ("Olá! Recebi sua mensagem...") do chat.js
    //       deve ser removida do front e implementada aqui ou via WebSocket futuramente
    @Transactional
    public MensagemDto enviar(@Valid MensagemDto dto) {
        Usuario usuario = usuarioRepository.findById(dto.usuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Tecnico tecnico = tecnicoRepository.findById(dto.tecnicoId())
                .orElseThrow(() -> new RuntimeException("Técnico não encontrado"));

        Mensagem mensagem = new Mensagem();
        mensagem.setUsuario(usuario);
        mensagem.setTecnico(tecnico);
        mensagem.setTexto(dto.texto());
        mensagem.setEnviadoPeloUsuario(dto.enviadoPeloUsuario() != null
                ? dto.enviadoPeloUsuario()
                : true);

        return toDTO(mensagemRepository.save(mensagem));
    }


    // --- DELETAR ---
    @Transactional
    public void deletar(Long id) {
        if (!mensagemRepository.existsById(id)) {
            throw new RuntimeException("Mensagem não encontrada");
        }
        mensagemRepository.deleteById(id);
    }

    // --- MAPPER ---
    // enviadoPeloUsuario substitui { eu: true } do localStorage no chat.js
    private MensagemDto toDTO(Mensagem m) {
        return new MensagemDto(
                m.getId(),
                m.getUsuario().getId(),
                m.getTecnico().getId(),
                m.getTexto(),
                m.getEnviadoPeloUsuario(),
                m.getEnviadoEm()
        );
    }
}
