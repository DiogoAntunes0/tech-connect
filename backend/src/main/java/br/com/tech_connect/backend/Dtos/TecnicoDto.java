package br.com.tech_connect.backend.Dtos;

import java.util.List;

public record TecnicoDto(Long id, String nome, String area, String cidade,
                         Integer idade, Double valorHora, Double rating,
                         String foto, String bio, String sucesso,
                         String resposta, Integer atendimentos,
                         List<String> skills, List<ProjetoDto> projetos) {
}
