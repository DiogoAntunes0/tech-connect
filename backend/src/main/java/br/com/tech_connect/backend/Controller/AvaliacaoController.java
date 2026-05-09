package br.com.tech_connect.backend.Controller;

import br.com.tech_connect.backend.Dtos.AvaliacaoDto;
import br.com.tech_connect.backend.Service.AvaliacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/avaliacoes")
@RequiredArgsConstructor
public class AvaliacaoController {

    @Autowired
    private final AvaliacaoService avaliacaoService;

    // GET /api/avaliacoes/tecnico/{tecnicoId}
    // Chamado por: avaliacoes.js → carregarAvaliacoes()
    // Substitui: localStorage.getItem("avaliacoes_" + nome)
    // Retorna feedbacks fixos + avaliações dos usuários para o técnico
    @GetMapping("/tecnico/{tecnicoId}")
    public ResponseEntity<List<AvaliacaoDto>> listarPorTecnico(@PathVariable Long tecnicoId) {
        return ResponseEntity.ok(avaliacaoService.listarPorTecnico(tecnicoId));
    }

    // POST /api/avaliacoes
    // Chamado por: avaliacoes.js → btnAvaliar.onclick → salvarAvaliacao()
    // Substitui: localStorage.setItem("avaliacoes_" + nome, ...)
    // Após salvar, recalcula o rating médio do técnico automaticamente
    @PostMapping
    public ResponseEntity<AvaliacaoDto> criar(@RequestBody @Valid AvaliacaoDto dto) {
        AvaliacaoDto criada = avaliacaoService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criada);
    }

    // DELETE /api/avaliacoes/{id}
    // Remoção de avaliação (moderação / admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        avaliacaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
