package br.com.tech_connect.backend.Repository;

import br.com.tech_connect.backend.Model.Favorito;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

    List<Favorito> findByUsuarioId(Long usuarioId);

    Optional<Favorito> findByUsuarioIdAndTecnicoId(Long usuarioId, Long tecnicoId);

    void deleteByUsuarioIdAndTecnicoId(Long usuarioId, Long tecnicoId);
}
