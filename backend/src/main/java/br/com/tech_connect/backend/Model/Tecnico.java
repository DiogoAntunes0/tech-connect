package br.com.tech_connect.backend.Model;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tecnicos")
public class Tecnico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String area;
    private String cidade;
    private Integer idade;
    private Double valorHora;
    private Double rating;
    private String foto;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String sucesso;
    private String resposta;
    private Integer atendimentos;

    @ElementCollection
    @CollectionTable(name = "tecnico_skills", joinColumns = @JoinColumn(name = "tecnico_id"))
    @Column(name = "skill")
    private List<String> skills;

    @OneToMany(mappedBy = "tecnico", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Projeto> projetos;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm = LocalDateTime.now();

    public List<Projeto> getProjetos() { return projetos; }
    public void setProjetos(List<Projeto> projetos) { this.projetos = projetos; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }
    public Integer getAtendimentos() { return atendimentos; }
    public void setAtendimentos(Integer atendimentos) { this.atendimentos = atendimentos; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getIdade() { return idade; }
    public void setIdade(Integer idade) { this.idade = idade; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public String getResposta() { return resposta; }
    public void setResposta(String resposta) { this.resposta = resposta; }
    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }
    public String getSucesso() { return sucesso; }
    public void setSucesso(String sucesso) { this.sucesso = sucesso; }
    public Double getValorHora() { return valorHora; }
    public void setValorHora(Double valorHora) { this.valorHora = valorHora; }
}