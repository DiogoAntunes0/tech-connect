package br.com.tech_connect.backend.Repository;

import br.com.tech_connect.backend.Model.Avaliacao;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {
    List<Avaliacao> findByTecnicoId(Long tecnicoId);

    @Query("SELECT AVG(a.nota) FROM Avaliacao a WHERE a.tecnico.id = :tecnicoId")
    Double calcularMediaByTecnicoId(@Param("tecnicoId") Long tecnicoId);
}