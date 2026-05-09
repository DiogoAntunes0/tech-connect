package br.com.tech_connect.backend.Dtos;

public record UsuarioDto(Long id, String nome, String email, String foto, Integer idade,
                         Double valorHora, String bio, String especialidades, String projetos) {
}
