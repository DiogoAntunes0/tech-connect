package br.com.tech_connect.backend.Controller;

import br.com.tech_connect.backend.Dtos.TecnicoDto;
import br.com.tech_connect.backend.Service.FavoritoService;
import br.com.tech_connect.backend.Dtos.FavoritoDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favoritos")
@RequiredArgsConstructor
public class FavoritoController {

    private final FavoritoService favoritoService;

    // GET /api/favoritos?usuarioId=1
    // Chamado por: tecnicos.js → getFavoritos()
    // Substitui: localStorage.getItem("favoritos")
    // Retorna lista de TecnicoDTO que o usuário favoritou
    @GetMapping
    public ResponseEntity<List<TecnicoDto>> listar(@RequestParam Long usuarioId) {
        return ResponseEntity.ok(favoritoService.listarPorUsuario(usuarioId));
    }

    // POST /api/favoritos
    // Chamado por: tecnicos.js → toggleFavorito() quando ♡ → ♥
    @PostMapping
    public ResponseEntity<Void> adicionar(@RequestBody FavoritoDto dto) {
        favoritoService.adicionar(dto.usuarioId(), dto.tecnicoId());
        return ResponseEntity.ok().build();
    }

    // DELETE /api/favoritos?usuarioId=1&tecnicoId=2
    // Chamado por: tecnicos.js → toggleFavorito() quando ♥ → ♡
    @DeleteMapping
    public ResponseEntity<Void> remover(
            @RequestParam Long usuarioId,
            @RequestParam Long tecnicoId) {
        favoritoService.remover(usuarioId, tecnicoId);
        return ResponseEntity.noContent().build();
    }
}
