package br.com.tech_connect.backend.Model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "favoritos",
        uniqueConstraints = @UniqueConstraint(columnNames = {"usuario_id","tecnico_id"}))
public class Favorito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "tecnico_id", nullable = false)
    private Tecnico tecnico;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm = LocalDateTime.now();

    public void setUsuario(Usuario usuario) {
    }

    public void setTecnico(Tecnico tecnico) {
    }

    public Tecnico getTecnico() {
        return null;
    }
}
