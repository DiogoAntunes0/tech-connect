package br.com.tech_connect.backend.Controller;

import br.com.tech_connect.backend.Dtos.CadastroDto;
import br.com.tech_connect.backend.Dtos.LoginDto;
import br.com.tech_connect.backend.Dtos.UsuarioDto;
import br.com.tech_connect.backend.Model.Usuario;
import br.com.tech_connect.backend.Repository.UsuarioRepository;
import br.com.tech_connect.backend.Service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;

    // POST /api/auth/cadastrar
    @PostMapping("/cadastrar")
    public ResponseEntity<UsuarioDto> cadastrar(@RequestBody CadastroDto dto) {
        return ResponseEntity.ok(usuarioService.cadastrar(dto));
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginDto dto) {
        String token = usuarioService.autenticar(dto);
        Usuario usuario = usuarioRepository.findByEmail(dto.email()).orElseThrow();

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("id", usuario.getId());
        response.put("nome", usuario.getNome());
        response.put("email", usuario.getEmail());
        response.put("foto", usuario.getFoto());

        return ResponseEntity.ok(response);
    }
}