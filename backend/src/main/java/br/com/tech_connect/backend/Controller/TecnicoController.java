package br.com.tech_connect.backend.Controller;

import br.com.tech_connect.backend.Dtos.TecnicoDto;

import br.com.tech_connect.backend.Service.TecnicoService;
import br.com.tech_connect.backend.Service.TecnicoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tecnicos")
@RequiredArgsConstructor
public class TecnicoController {

    private final TecnicoService tecnicoService;

    @GetMapping
    public ResponseEntity<List<TecnicoDto>> listar() {
        return ResponseEntity.ok(tecnicoService.listarTodos());
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<TecnicoDto>> buscar(@RequestParam String termo) {
        return ResponseEntity.ok(tecnicoService.buscarPorTermo(termo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TecnicoDto> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(tecnicoService.buscarPorId(id));
    }


    @PostMapping
    public ResponseEntity<TecnicoDto> cadastrar(@RequestBody @Valid TecnicoDto dto) {
        TecnicoDto criado = tecnicoService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }


    @PutMapping("/{id}")
    public ResponseEntity<TecnicoDto> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid TecnicoDto dto) {
        return ResponseEntity.ok(tecnicoService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        tecnicoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
