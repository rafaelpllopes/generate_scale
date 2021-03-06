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
    unidade VARCHAR(100) NOT NULL,
    cnes VARCHAR(30),
    unique(unidade)
)`;

const INSERT_DEFAULT_UNIDADES = [
    `INSERT INTO unidades (unidade, cnes) SELECT 'SAE SERVICO DE ASSISTENCIA ESPECIALIZADA M I ITAPEVA', '6644813' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'SAE SERVICO DE ASSISTENCIA ESPECIALIZADA M I ITAPEVA' AND cnes = '6644813')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'CENTRO DE REFERENCIA EM SAUDE DO TRABALHADOR DE ITAPEVA', '6197353' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'CENTRO DE REFERENCIA EM SAUDE DO TRABALHADOR DE ITAPEVA' AND cnes = '6197353')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'CENTRO DE DIAGNOSTICO DE ITAPEVA CDI', '2048876' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'CENTRO DE DIAGNOSTICO DE ITAPEVA CDI' AND cnes = '2048876')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'CASA DO ADOLESCENTE', '6824625' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'CASA DO ADOLESCENTE' AND cnes = '6824625')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'HOSPITAL DIA SANTA RITA', '6971199' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'HOSPITAL DIA SANTA RITA' AND cnes = '6971199')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'UNIDADE DE SAUDE PACOVA', '2048833' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'UNIDADE DE SAUDE PACOVA' AND cnes = '2048833')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'UNIDADE PSF VILA SAO BENEDITO ITAPEVA', '2096390' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'UNIDADE PSF VILA SAO BENEDITO ITAPEVA' AND cnes = '2096390')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'UNIDADE PSF VILA SAO MIGUEL ITAPEVA', '2053071' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'UNIDADE PSF VILA SAO MIGUEL ITAPEVA' AND cnes = '2053071')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'UNIDADE PSF ALTO DA BRANCAL ITAPEVA', '2058219' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'UNIDADE PSF ALTO DA BRANCAL ITAPEVA' AND cnes = '2058219')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'UNIDADE PSF GUARIZINHO JAO', '2047446' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'UNIDADE PSF GUARIZINHO JAO' AND cnes = '2047446')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'UNIDADE PSF JARDIM IMPERADOR ITAPEVA', '2059134' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'UNIDADE PSF JARDIM IMPERADOR ITAPEVA' AND cnes = '2059134')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'UBS JARDIM MARINGA ITAPEVA', '2034301' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'UBS JARDIM MARINGA ITAPEVA' AND cnes = '2034301')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'EACS AGROVILAS ITAPEVA', '2051273' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'EACS AGROVILAS ITAPEVA' AND cnes = '2051273')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'UNIDADE PSF JARDIM GRAJAU ITAPEVA', '2027216' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'UNIDADE PSF JARDIM GRAJAU ITAPEVA' AND cnes = '2027216')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'AMBULATORIO MUNICIPAL MATERNO INFANTIL ITAPEVA', '2027151' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'AMBULATORIO MUNICIPAL MATERNO INFANTIL ITAPEVA' AND cnes = '2027151')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'UBS CSI ITAPEVA', '2059142' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'UBS CSI ITAPEVA' AND cnes = '2059142')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'UBS VILA SANTA MARIA ITAPEVA', '2048884' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'UBS VILA SANTA MARIA ITAPEVA' AND cnes = '2048884')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'UNIDADE DE SAUDE CAPUTERA AMARELA VELHA', '6985890' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'UNIDADE DE SAUDE CAPUTERA AMARELA VELHA' AND cnes = '6985890')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'UNIDADE PSF VILA DOM BOSCO CIMENTOLANDIA ITAPEVA', '2056259' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'UNIDADE PSF VILA DOM BOSCO CIMENTOLANDIA ITAPEVA' AND cnes = '2056259')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'UNIDADE PSF VILA SAO CAMILO ITAPEVA', '2048493' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'UNIDADE PSF VILA SAO CAMILO ITAPEVA' AND cnes = '2048493')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'UNIDADE PSF VILA TAQUARI ITAPEVA', '2065436' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'UNIDADE PSF VILA TAQUARI ITAPEVA' AND cnes = '2065436')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'UBS VILA APARECIDA ITAPEVA', '2070995' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'UBS VILA APARECIDA ITAPEVA' AND cnes = '2070995')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'UBS PARQUE SAO JORGE ITAPEVA', '2051559' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'UBS PARQUE SAO JORGE ITAPEVA' AND cnes = '2051559')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'UNIDADE PSF JARDIM BELA VISTA ITAPEVA', '2070979' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'UNIDADE PSF JARDIM BELA VISTA ITAPEVA' AND cnes = '2070979')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'UNIDADE PSF VILA BOM JESUS ITAPEVA', '2027143' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'UNIDADE PSF VILA BOM JESUS ITAPEVA' AND cnes = '2027143')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'UNIDADE DE SAUDE SAO ROQUE AREIA BRANCA', '7323859' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'UNIDADE DE SAUDE SAO ROQUE AREIA BRANCA' AND cnes = '7323859')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'CAPS II ITAPEVA SAO PAULO', '5859433' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'CAPS II ITAPEVA SAO PAULO' AND cnes = '5859433')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'UNIDADE DE PRONTO ATENDIMENTO UPA PORTE 1', '7278438' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'UNIDADE DE PRONTO ATENDIMENTO UPA PORTE 1' AND cnes = '7278438')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'UNIDADE PSF JARDIM VIRGINIA ITAPEVA', '2027208' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'UNIDADE PSF JARDIM VIRGINIA ITAPEVA' AND cnes = '2027208')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'UNIDADE PSF VILA MARIANA ITAPEVA', '2045443' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'UNIDADE PSF VILA MARIANA ITAPEVA' AND cnes = '2045443')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'UNIDADE PSF VILA CAMARGO ITAPEVA', '2027178' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'UNIDADE PSF VILA CAMARGO ITAPEVA' AND cnes = '2027178')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'CENTRO DE REFERENCIA DO IDOSO', '7832753' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'CENTRO DE REFERENCIA DO IDOSO' AND cnes = '7832753')`,
    `INSERT INTO unidades (unidade, cnes) SELECT 'UBS RESIDENCIAL MORADA DO BOSQUE', '9634827' WHERE NOT EXISTS (SELECT * FROM unidades WHERE unidade = 'UBS RESIDENCIAL MORADA DO BOSQUE' AND cnes = '9634827')`
];

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
    INSERT_DEFAULT_UNIDADES.forEach(unidade => db.run(unidade));
    db.run(INSERT_DEFAULT_USUARIO, [sha256.x2(password)]);
});

process.on('SIGINT', () =>
    db.close(() => {
        console.log('Database closed');
        process.exit(0);
    })
);

module.exports = db;