package br.com.tech_connect.backend.Repository;

import br.com.tech_connect.backend.Model.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {
    List<Avaliacao> findByTecnicoId(Long tecnicoId);
    Double avgByTecnicoId(Long tecnicoId); // para recalcular rating
}
