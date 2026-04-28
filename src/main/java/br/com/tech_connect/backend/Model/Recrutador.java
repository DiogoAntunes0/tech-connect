package br.com.tech_connect.backend.Model;

import java.util.List;

public class Recrutador extends Usuario {
    //usuario_id;
    private String empresa;
    private String cargo;
    private List<Double> avaliacoesFeitas;

    public Recrutador(long id, boolean lembrarMe, String nome, String senha, Enum tipousuario, List<Double> avaliacoesFeitas, String cargo, String empresa) {
        super(id, lembrarMe, nome, senha, tipousuario);
        this.avaliacoesFeitas = avaliacoesFeitas;
        this.cargo = cargo;
        this.empresa = empresa;
    }

    public List<Double> getAvaliacoesFeitas() {
        return avaliacoesFeitas;
    }

    public String getCargo() {
        return cargo;
    }

    public String getEmpresa() {
        return empresa;
    }
}
