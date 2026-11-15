-- Executar em um banco PostgreSQL vazio.
CREATE TABLE cliente (
    cliente_id uuid PRIMARY KEY,
    cliente_nome varchar(80) NOT NULL,
    cliente_cpf varchar(11) NOT NULL,
    cliente_datanascimento timestamp with time zone NOT NULL,
    cliente_email varchar(100)
);

CREATE UNIQUE INDEX ux_cliente_cpf ON cliente (cliente_cpf);

CREATE TABLE divida (
    divida_id uuid PRIMARY KEY,
    cliente_id uuid NOT NULL REFERENCES cliente (cliente_id) ON DELETE CASCADE,
    divida_valor numeric NOT NULL,
    divida_situacao boolean NOT NULL,
    divida_datacriacao timestamp with time zone NOT NULL,
    divida_datapagamento timestamp with time zone
);

CREATE UNIQUE INDEX ux_divida_cliente_aberta ON divida (cliente_id) WHERE NOT divida_situacao;
