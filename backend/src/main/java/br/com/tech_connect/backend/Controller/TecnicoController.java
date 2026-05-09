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

    // GET /api/tecnicos
    // Chamado por: tecnicos.js → renderTecnicos() sem filtro
    // Retorna todos os técnicos para popular o #listaTecnicos
    @GetMapping
    public ResponseEntity<List<TecnicoDto>> listar() {
        return ResponseEntity.ok(tecnicoService.listarTodos());
    }

    // GET /api/tecnicos/buscar?termo=redes
    // Chamado por: tecnicos.js → btnBuscar.onclick → renderTecnicos(filtro)
    // Filtra por nome, área, cidade ou skills (ver TecnicoRepository)
    @GetMapping("/buscar")
    public ResponseEntity<List<TecnicoDto>> buscar(@RequestParam String termo) {
        return ResponseEntity.ok(tecnicoService.buscarPorTermo(termo));
    }

    // GET /api/tecnicos/{id}
    // Chamado por: tecnicos.js → abrirPerfil(tecnico) para carregar perfil-drawer.html
    // Retorna técnico com projetos e skills embutidos no TecnicoDTO
    @GetMapping("/{id}")
    public ResponseEntity<TecnicoDto> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(tecnicoService.buscarPorId(id));
    }

    // POST /api/tecnicos
    // Usado para cadastro de técnico (admin ou fluxo futuro de cadastro de técnico)
    // Nota: endpoint atual no front é /tecnicos/cadastrarTecnicos — padronizar para este
    @PostMapping
    public ResponseEntity<TecnicoDto> cadastrar(@RequestBody @Valid TecnicoDto dto) {
        TecnicoDto criado = tecnicoService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    // PUT /api/tecnicos/{id}
    // Atualiza dados do técnico (nome, área, bio, valor/hora, etc.)
    @PutMapping("/{id}")
    public ResponseEntity<TecnicoDto> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid TecnicoDto dto) {
        return ResponseEntity.ok(tecnicoService.atualizar(id, dto));
    }

    // DELETE /api/tecnicos/{id}
    // Remoção de técnico (uso administrativo)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        tecnicoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
