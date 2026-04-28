package br.com.tech_connect.backend.Model;

public class Usuario {
    private long id;
    private String nome;
    private String senha;
    private boolean lembrarMe;
    private Enum tipousuario;

    public Usuario(){}

    public Usuario(long id, boolean lembrarMe, String nome, String senha, Enum tipousuario) {
        this.id = id;
        this.lembrarMe = lembrarMe;
        this.nome = nome;
        this.senha = senha;
        this.tipousuario = tipousuario;
    }

    public long getId() {
        return id;
    }

    public boolean isLembrarMe() {
        return lembrarMe;
    }

    public String getNome() {
        return nome;
    }

    public String getSenha() {
        return senha;
    }

    public Enum getTipousuario() {
        return tipousuario;
    }
}
