const sqlite3 = require('sqlite3').verbose();
const sha256 = require('sha256');
let db = '';

switch (process.env.NODE_ENV) {
    case 'production': db = new sqlite3.Database('scaleDB.db'); break;
    case 'development': db = new sqlite3.Database('scaleDBdevelopment.db');; break;
    case 'tests': db = new sqlite3.Database('scaleDBtest.db'); break;
}

const USUARIOS_SCHEMA = `
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    nome VARCHAR(250) NOT NULL,
    senha VARCHAR(300) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT (datetime('now','localtime')) NOT NULL
)
`;

const INSERT_DEFAULT_USUARIO =
    `
INSERT INTO usuarios (usuario, nome, senha)
    SELECT 'admin', 'Administrador', ? WHERE NOT EXISTS (SELECT * FROM usuarios WHERE usuario = 'admin')
`;

const PROFISSIONAL_SCHEMA = `
CREATE TABLE IF NOT EXISTS profissionais (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    conselho VARCHAR(30),
    funcao VARCHAR(30),
    especialidade VARCHAR(30),
    telefone VARCHAR(11),
    email VARCHAR(50)
)`;

const UNIDADES_SCHEMA = `
CREATE TABLE IF NOT EXISTS unidades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    cnes VARCHAR(30),
    logradouro VARCHAR(100),
    numero VARCHAR(10),
    bairro VARCHAR(100),
    municipio VARCHAR(100),
    estado VARCHAR(100),
    telefone VARCHAR(10),
    email VARCHAR(100)
)`;

const ESCALAS_SCHEMA = `
CREATE TABLE IF NOT EXISTS escalas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data DATE,
    turno VARCHAR(50),
    descricao VARCHAR(100),
    profissional_id INTEGER,
    unidade_id INTEGER
)`;

db.serialize(() => {
    const password = sha256('admin');
    db.run("PRAGMA foreign_keys=ON");
    db.run(USUARIOS_SCHEMA);
    db.run(PROFISSIONAL_SCHEMA);
    db.run(UNIDADES_SCHEMA);
    db.run(ESCALAS_SCHEMA);
    db.run(INSERT_DEFAULT_USUARIO, [sha256.x2(password)]);
});

process.on('SIGINT', () =>
    db.close(() => {
        console.log('Database closed');
        process.exit(0);
    })
);

module.exports = db;