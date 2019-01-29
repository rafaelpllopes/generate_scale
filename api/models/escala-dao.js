const db = require('../libs/database');
/*
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data DATE,
    turno VARCHAR(50),
    descricao VARCHAR(100),
    profissional_id INTEGER,
    unidade_id INTEGER
*/

class EscalaslDao {

    constructor() {
        this._db = db;
    }

    create(escala) {
        return new Promise((resolve, reject) => {
            this._db.run(`INSERT INTO escalas(
                data,
                turno,
                descricao,
                profissional_id,
                unidade_id
            ) VALUES (?, ?, ?, ?, ?)`,
                [
                    escala.data,
                    escala.turno,
                    escala.descricao,
                    escala.profissional_id,
                    escala.unidade_id
                ],
                function (error, rows) {
                    if (error) {
                        console.error(`Erros: ${error}`);
                        reject('Não foi possivel cadastrar a escala');
                    }
                    resolve({ message: 'Escala cadastrada com sucesso', id: this.lastID });
                });
        });
    }

    escalasMesProfissional(profissional, mes, ano) {
        return new Promise((resolve, reject) => {
            this._db.run(`SELECT e.*, p.*, u.unidade FROM escalas e
                INNER JOIN profissionais p ON e.profissional_id = p.id
                INNER JOIN unidades u ON e.unidade_id = u.id
                WHERE e.profissional_id = ?
                e.data BETWEEN '${ano}-${mes}-01' AND '${ano}-${mes}-31'
                ORDER BY data`,
                [profissional],
                (error, rows) => {
                    if (error) {
                        console.error(`Erros: ${error}`);
                        reject('Não foi possivel obter as escalas');
                    }
                    rows ? resolve(rows) : reject('Não existe escalas no perido para o profissional');
                });
        });
    }

    escalasMesUnidade(unidade, mes, ano) {
        return new Promise((resolve, reject) => {
            this._db.run(`SELECT e.*, p.*, u.unidade FROM escalas e
                INNER JOIN profissionais p ON e.profissional_id = p.id
                INNER JOIN unidades u ON e.unidade_id = u.id
                WHERE e.unidade_id = ?
                e.data BETWEEN '${ano}-${mes}-01' AND '${ano}-${mes}-31'
                ORDER BY data`,
                [unidade],
                (error, rows) => {
                    if (error) {
                        console.error(`Erros: ${error}`);
                        reject('Não foi possivel obter as escalas');
                    }
                    rows ? resolve(rows) : reject('Não existe escalas no perido para unidade');
                });
        });
    }

    update(id, escala) {
        return new Promise((resolve, reject) => {
            this._db.run(`UPDATE escalas SET
                data = ?,
                turno = ?,
                descricao = ?,
                profissional_id = ?,
                unidade_id = ?
                WHERE id = ?
            `,
                [
                    escala.data,
                    escala.turno,
                    escala.descricao,
                    escala.profissional_id,
                    escala.unidade_id,
                    id
                ],
                function (error, rows) {
                    if (error) {
                        console.error(`Erros: ${error}`);
                        reject('Não foi possivel atualizar a escala');
                    }
                    resolve({ message: 'Escala atualizada com sucesso' });
                });
        });
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM escalas WHERE id = ?',
                [id],
                (error, rows) => {
                    if (error) {
                        reject({ message: 'Não foi possivel deletar a escala' });
                        return;
                    }
                    resolve({ message: 'Escala deletado com sucesso' });
                });
        });
    }
}

module.exports = EscalaslDao;
