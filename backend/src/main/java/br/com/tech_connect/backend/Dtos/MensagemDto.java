package br.com.tech_connect.backend.Dtos;

import java.time.LocalDateTime;

public record MensagemDto(Long id, Long usuarioId, Long tecnicoId,
                          String texto, Boolean enviadoPeloUsuario,
                          LocalDateTime enviadoEm) {
}
