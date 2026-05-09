package br.com.tech_connect.backend.Model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "mensagens")
public class Mensagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;     // remetente

    @ManyToOne
    @JoinColumn(name = "tecnico_id", nullable = false)
    private Tecnico tecnico;     // destinatário

    @Column(columnDefinition = "TEXT", nullable = false)
    private String texto;        // chatInput

    private Boolean enviadoPeloUsuario; // true = usuário, false = técnico

    @Column(name = "enviado_em")
    private LocalDateTime enviadoEm = LocalDateTime.now();

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public Tecnico getTecnico() {
        return tecnico;
    }

    public void setTecnico(Tecnico tecnico) {
        this.tecnico = tecnico;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getEnviadoPeloUsuario() {
        return enviadoPeloUsuario;
    }

    public void setEnviadoPeloUsuario(Boolean enviadoPeloUsuario) {
        this.enviadoPeloUsuario = enviadoPeloUsuario;
    }

    public LocalDateTime getEnviadoEm() {
        return enviadoEm;
    }

    public void setEnviadoEm(LocalDateTime enviadoEm) {
        this.enviadoEm = enviadoEm;
    }
}
