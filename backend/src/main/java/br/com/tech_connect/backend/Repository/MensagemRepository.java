package br.com.tech_connect.backend.Repository;

import br.com.tech_connect.backend.Model.Mensagem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MensagemRepository extends JpaRepository<Mensagem, Long> {
    List<Mensagem> findByUsuarioIdAndTecnicoIdOrderByEnviadoEmAsc(
            Long usuarioId, Long tecnicoId
    );
}
