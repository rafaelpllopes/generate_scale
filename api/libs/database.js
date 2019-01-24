const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('scaleDB.db');
const sha256 = require('sha256');

const USUARIOS_SCHEMA = `
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    nome VARCHAR(250) NOT NULL,
    senha VARCHAR(250) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT (datetime('now','localtime')) NOT NULL
)
`;

const INSERT_DEFAULT_USUARIO =
    `
INSERT INTO usuarios (usuario, nome, senha)
    SELECT 'admin', 'Administrador', ? WHERE NOT EXISTS (SELECT * FROM usuarios WHERE usuario = 'admin')
`;

db.serialize(() => {
    db.run("PRAGMA foreign_keys=ON");
    db.run(USUARIOS_SCHEMA);
    db.run(INSERT_DEFAULT_USUARIO, [sha256.x2('admin')]);
});

process.on('SIGINT', () =>
    db.close(() => {
        console.log('Database closed');
        process.exit(0);
    })
);

module.exports = db;