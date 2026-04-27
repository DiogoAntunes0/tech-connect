-- 1. Tabela Base: Usuarios
CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL -- 'CANDIDATO' ou 'RECRUTADOR'
);

-- 2. Tabela Filha: Candidatos
CREATE TABLE candidatos (
    usuario_id BIGINT PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    area VARCHAR(100),
    cidade VARCHAR(100),
    data_nascimento DATE, 
    valor_medio NUMERIC(10, 2), 
    rating DOUBLE PRECISION DEFAULT 0.0,
    bio TEXT,
    foto TEXT
);

-- 3. Tabela Filha: Recrutadores
CREATE TABLE recrutadores (
    usuario_id BIGINT PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    empresa VARCHAR(255),
    cargo VARCHAR(150)
);

-- 4. Tabela: Avaliações
CREATE TABLE avaliacoes (
    id BIGSERIAL PRIMARY KEY,
    nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT,
    candidato_id BIGINT REFERENCES candidatos(usuario_id),
    recrutador_id BIGINT REFERENCES recrutadores(usuario_id),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabela: Mensagens
CREATE TABLE mensagens (
    id BIGSERIAL PRIMARY KEY,
    conteudo TEXT NOT NULL,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remetente_id BIGINT REFERENCES usuarios(id),
    destinatario_id BIGINT REFERENCES usuarios(id)
);