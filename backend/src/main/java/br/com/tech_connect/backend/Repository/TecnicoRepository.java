package br.com.tech_connect.backend.Repository;

import br.com.tech_connect.backend.Model.Tecnico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TecnicoRepository extends JpaRepository<Tecnico, Long> {
    // Busca por nome, área, cidade ou skills (searchInput → btnBuscar)
    @Query("""
        SELECT DISTINCT t FROM Tecnico t
        LEFT JOIN t.skills s
        WHERE LOWER(t.nome)   LIKE LOWER(CONCAT('%',:termo,'%'))
           OR LOWER(t.area)   LIKE LOWER(CONCAT('%',:termo,'%'))
           OR LOWER(t.cidade) LIKE LOWER(CONCAT('%',:termo,'%'))
           OR LOWER(s)        LIKE LOWER(CONCAT('%',:termo,'%'))
    """)
    List<Tecnico> buscarPorTermo(@Param("termo") String termo);
}
