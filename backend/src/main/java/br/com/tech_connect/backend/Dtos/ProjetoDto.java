package br.com.tech_connect.backend.Dtos;

public record ProjetoDto( Long id,
                          Long tecnicoId,
                          String titulo,
                          String descricao,
                          String imagem) {
}
