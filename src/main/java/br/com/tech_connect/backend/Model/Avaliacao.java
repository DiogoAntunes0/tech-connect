package br.com.tech_connect.backend.Model;

import java.util.Date;

public class Avaliacao {
    private long id;
    private Double nota;
    private String comentario;
    //tecnico ID FK de usuario
    //recrutador ID FK de usuario
    private Date data_criacao;

    public Avaliacao(String comentario, Date data_criacao, long id, Double nota) {
        this.comentario = comentario;
        this.data_criacao = data_criacao;
        this.id = id;
        this.nota = nota;
    }

    public String getComentario() {
        return comentario;
    }

    public Date getData_criacao() {
        return data_criacao;
    }

    public long getId() {
        return id;
    }

    public Double getNota() {
        return nota;
    }
}
