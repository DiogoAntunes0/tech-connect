package br.com.tech_connect.backend.Model;

import java.util.Date;
import java.util.List;

public class Tecnico extends Usuario {
    //usuario_ID;
    private String area;
    private String cidade;
    private Date dataNascimento;
    private Double valorHora;
    private List<Double> avaliacoesRecebidas;
    private String biografia;
    //foto

    public Tecnico(long id, boolean lembrarMe, String nome, String senha, Enum tipousuario, String area, List<Double> avaliacoesRecebidas, String biografia, String cidade, Date dataNascimento, Double valorHora) {
        super(id, lembrarMe, nome, senha, tipousuario);
        this.area = area;
        this.avaliacoesRecebidas = avaliacoesRecebidas;
        this.biografia = biografia;
        this.cidade = cidade;
        this.dataNascimento = dataNascimento;
        this.valorHora = valorHora;
    }

    public String getArea() {
        return area;
    }

    public List<Double> getAvaliacoes() {
        return avaliacoesRecebidas;
    }

    public String getBiografia() {
        return biografia;
    }

    public String getCidade() {
        return cidade;
    }

    public Date getDataNascimento() {
        return dataNascimento;
    }

    public Double getValorHora() {
        return valorHora;
    }
}
