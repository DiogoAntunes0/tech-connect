package br.com.tech_connect.backend.Controller;

import br.com.tech_connect.backend.Dtos.UsuarioDto;
import br.com.tech_connect.backend.Service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    // GET /api/usuarios/{id}
    // Chamado por: auth.js → btnMeuPerfil.onclick → preenche campos do perfil-usuario.html
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDto> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    // PUT /api/usuarios/{id}
    // Chamado por: auth.js → salvarPerfilUsuario.onclick
    // Atualiza: nome, email, bio, idade, valorHora, especialidades, projetos
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDto> atualizar(
            @PathVariable Long id,
            @RequestBody UsuarioDto dto) {
        return ResponseEntity.ok(usuarioService.atualizar(id, dto));
    }

    // PATCH /api/usuarios/{id}/foto
    // Chamado por: auth.js → inputFoto.onchange (envia base64 da imagem)
    @PatchMapping("/{id}/foto")
    public ResponseEntity<Map<String, String>> atualizarFoto(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String fotoUrl = usuarioService.atualizarFoto(id, body.get("foto"));
        return ResponseEntity.ok(Map.of("foto", fotoUrl));
    }
}
