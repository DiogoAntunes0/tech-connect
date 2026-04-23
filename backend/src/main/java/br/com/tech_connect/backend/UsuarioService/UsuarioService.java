package br.com.tech_connect.backend.UsuarioService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UsuarioService {

    @GetMapping("/teste")
    public String retornarMensagem(){
        return "Hello World!";
    };
}
