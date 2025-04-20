-- Criar o banco de dados
CREATE DATABASE sistema_financeiro;

-- Conectar ao banco de dados
\c sistema_financeiro;

-- Criar extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tabela de usuários
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de clientes
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(2) NOT NULL CHECK (tipo IN ('PF', 'PJ')),
    cpf_cnpj VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255),
    telefone VARCHAR(20),
    endereco VARCHAR(255),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(10),
    observacoes TEXT,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de fornecedores
CREATE TABLE fornecedores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(2) NOT NULL CHECK (tipo IN ('PF', 'PJ')),
    cpf_cnpj VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255),
    telefone VARCHAR(20),
    endereco VARCHAR(255),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(10),
    observacoes TEXT,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de contas bancárias
CREATE TABLE contas_bancarias (
    id SERIAL PRIMARY KEY,
    banco VARCHAR(100) NOT NULL,
    agencia VARCHAR(20) NOT NULL,
    conta VARCHAR(20) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('CORRENTE', 'POUPANCA', 'SALARIO', 'INVESTIMENTO')),
    saldo DECIMAL(10,2) NOT NULL DEFAULT 0,
    saldo_conciliado DECIMAL(10,2) NOT NULL DEFAULT 0,
    data_ultima_conciliacao DATE,
    observacoes TEXT,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de cartões de crédito
CREATE TABLE cartoes_credito (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    bandeira VARCHAR(20) NOT NULL CHECK (bandeira IN ('VISA', 'MASTERCARD', 'AMERICAN_EXPRESS', 'ELO', 'HIPERCARD', 'OUTROS')),
    numero VARCHAR(20) NOT NULL,
    limite DECIMAL(10,2) NOT NULL,
    dia_vencimento INTEGER NOT NULL CHECK (dia_vencimento BETWEEN 1 AND 31),
    dia_fechamento INTEGER NOT NULL CHECK (dia_fechamento BETWEEN 1 AND 31),
    fatura_atual DECIMAL(10,2) NOT NULL DEFAULT 0,
    fatura_proxima DECIMAL(10,2) NOT NULL DEFAULT 0,
    observacoes TEXT,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de contas a pagar
CREATE TABLE contas_pagar (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento DATE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO')),
    forma_pagamento VARCHAR(20) NOT NULL CHECK (forma_pagamento IN ('DINHEIRO', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'PIX', 'BOLETO', 'TRANSFERENCIA')),
    categoria VARCHAR(50) NOT NULL,
    observacoes TEXT,
    fornecedor_id INTEGER NOT NULL REFERENCES fornecedores(id),
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    conta_bancaria_id INTEGER REFERENCES contas_bancarias(id),
    cartao_credito_id INTEGER REFERENCES cartoes_credito(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de contas a receber
CREATE TABLE contas_receber (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_vencimento DATE NOT NULL,
    data_recebimento DATE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDENTE', 'RECEBIDO', 'ATRASADO', 'CANCELADO')),
    forma_recebimento VARCHAR(20) NOT NULL CHECK (forma_recebimento IN ('DINHEIRO', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'PIX', 'BOLETO', 'TRANSFERENCIA')),
    categoria VARCHAR(50) NOT NULL,
    observacoes TEXT,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id),
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    conta_bancaria_id INTEGER REFERENCES contas_bancarias(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de investimentos
CREATE TABLE investimentos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('RENDA_FIXA', 'RENDA_VARIAVEL', 'FUNDOS_IMOBILIARIOS', 'CRIPTOMOEDAS', 'OUTROS')),
    valor_investido DECIMAL(10,2) NOT NULL,
    valor_atual DECIMAL(10,2) NOT NULL,
    rentabilidade DECIMAL(5,2),
    data_inicio DATE NOT NULL,
    data_vencimento DATE,
    instituicao VARCHAR(100),
    observacoes TEXT,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices
CREATE INDEX idx_contas_pagar_usuario ON contas_pagar(usuario_id);
CREATE INDEX idx_contas_pagar_fornecedor ON contas_pagar(fornecedor_id);
CREATE INDEX idx_contas_pagar_data_vencimento ON contas_pagar(data_vencimento);
CREATE INDEX idx_contas_pagar_status ON contas_pagar(status);

CREATE INDEX idx_contas_receber_usuario ON contas_receber(usuario_id);
CREATE INDEX idx_contas_receber_cliente ON contas_receber(cliente_id);
CREATE INDEX idx_contas_receber_data_vencimento ON contas_receber(data_vencimento);
CREATE INDEX idx_contas_receber_status ON contas_receber(status);

CREATE INDEX idx_contas_bancarias_usuario ON contas_bancarias(usuario_id);
CREATE INDEX idx_cartoes_credito_usuario ON cartoes_credito(usuario_id);
CREATE INDEX idx_investimentos_usuario ON investimentos(usuario_id);
CREATE INDEX idx_clientes_usuario ON clientes(usuario_id);
CREATE INDEX idx_fornecedores_usuario ON fornecedores(usuario_id); 