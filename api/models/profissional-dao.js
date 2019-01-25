const db = require('../libs/database');

class ProfissionalDao {

    listar() {
        return new Promise((resolve, reject) => {
            db.all('SELECT id, nome, conselho, funcao, especialidade, telefone, email FROM profissionais ORDER BY nome',
                (error, rows) => {
                    if (error) {
                        console.error(`Erros: ${error}`);
                        reject('Não foi possivel obter os profissionais');
                        return;
                    }
                    rows ? resolve(rows) : reject({ message: 'Não ha dados encontrados' });
                })
        });
    }

    buscaPorId(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT id, nome, conselho, funcao, especialidade, telefone, email FROM profissionais WHERE id = ?',
                [id],
                (error, rows) => {
                    if (error) {
                        reject({ message: 'Não foi possivel obter o profissional' });
                        return;
                    }
                    rows ? resolve(rows) : reject({ message: 'Não ha dados encontrados' });
                })
        });
    }

    cadastrar(profissional) {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO 
                profissionais (nome, conselho, funcao, especialidade, telefone, email)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    profissional.nome,
                    profissional.conselho,
                    profissional.funcao,
                    profissional.especialidade,
                    profissional.telefone,
                    profissional.email
                ],
                function (error, rows) {
                    if (error) {
                        reject({ message: 'Não foi possivel cadastrar o profissional' });
                        return;
                    }
                    resolve({ message: 'Profissional cadastro com sucesso', id: this.lastID });
                });
        });
    }

    atualizar(id, profissional) {
        return new Promise((resolve, reject) => {
            db.run(`UPDATE profissionais
                SET nome = ?,
                conselho = ?,
                funcao = ?, 
                especialidade = ?, 
                telefone = ?, 
                email =?
                WHERE id = ?
            `,
                [
                    profissional.nome,
                    profissional.conselho,
                    profissional.funcao,
                    profissional.especialidade,
                    profissional.telefone,
                    profissional.email,
                    id
                ],
                (error, rows) => {
                    if (error) {
                        reject({ message: 'Não foi possivel atualizar o profissional' });
                        return;
                    }
                    resolve({ message: 'Profissional atualizado com sucesso' });
                });
        });
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM profissionais WHERE id = ?',
                [id],
                (error, rows) => {
                    if (error) {
                        reject({ message: 'Não foi possivel deletar o profissional' });
                        return;
                    }
                    resolve({ message: 'Profissional deletado com sucesso' });
                });
        });
    }
}

module.exports = ProfissionalDao;
