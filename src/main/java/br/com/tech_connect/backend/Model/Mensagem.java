package br.com.tech_connect.backend.Model;

import java.time.LocalDateTime;

public class Mensagem {
    private Long id;
    private String conteudo;
    private LocalDateTime dataHora;
    //remetente(recrutador_id) para tecnico;
    //destinatario(tecnico_id) de recrutador ;
}
