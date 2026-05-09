package br.com.tech_connect.backend.Model;

public enum TipoUsuario {
    RECRUTADOR(""),
    CANDIDATO("");

    private String tipoUsuario;

    TipoUsuario(String tipoUsuario){
        this.tipoUsuario = tipoUsuario;
    }

    //busca se o tipoUsuario existe (ex: candidato ou recrutador)
    public static TipoUsuario fromString(String text) {
        for (TipoUsuario tipoUsuario: TipoUsuario.values()) {
            if (tipoUsuario.tipoUsuario.equalsIgnoreCase(text)) {
                return tipoUsuario;
            }
        }
        throw new IllegalArgumentException("Tipo de usúario não suportador: " + text);
    }
}
