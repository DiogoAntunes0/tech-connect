package br.com.tech_connect.backend.Controller;

import br.com.tech_connect.backend.Service.MensagemService;
import br.com.tech_connect.backend.Dtos.MensagemDto;
import br.com.tech_connect.backend.Service.MensagemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mensagens")
@RequiredArgsConstructor
public class MensagemController {

    private final MensagemService mensagemService;

    // GET /api/mensagens?usuarioId=1&tecnicoId=2
    // Chamado por: chat.js → carregarMensagens()
    // Substitui: localStorage.getItem("chat_" + tecnico.nome)
    // Retorna histórico ordenado por enviadoEm ASC
    @GetMapping
    public ResponseEntity<List<MensagemDto>> historico(
            @RequestParam Long usuarioId,
            @RequestParam Long tecnicoId) {
        return ResponseEntity.ok(mensagemService.historico(usuarioId, tecnicoId));
    }

    // POST /api/mensagens
    // Chamado por: chat.js → enviarMensagem()
    // Substitui: localStorage.setItem("chat_" + tecnico.nome, ...)
    // enviadoPeloUsuario = true quando o cliente envia, false na resposta do técnico
    @PostMapping
    public ResponseEntity<MensagemDto> enviar(@RequestBody @Valid MensagemDto dto) {
        MensagemDto enviada = mensagemService.enviar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(enviada);
    }

    // DELETE /api/mensagens/{id}
    // Remoção de mensagem individual (moderação)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        mensagemService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
