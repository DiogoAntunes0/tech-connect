package br.com.tech_connect.backend.Dtos;

import java.time.LocalDateTime;

public record AvaliacaoDto(Long id, Long tecnicoId, Long usuarioId,
                           String cliente, Integer nota, String comentario,
                           LocalDateTime criadoEm) {
}
