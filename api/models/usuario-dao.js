const db = require('../libs/database');

class UsuarioDao {
    listar() {
        return new Promise((resolve, reject) => {
            db.all('SELECT usuario, nome FROM usuarios ORDER BY nome',
                (error, rows) => {
                    if (error) {
                        console.error(`Erros: ${error}`);
                        reject('Não foi possivel obter os usuarios');
                        return;
                    }
                    rows ? resolve(rows) : resolve();
                })
        });
    }

    buscaPorId(id) {
        return new Promise((resolve, reject) => {
            db.all('SELECT usuario, nome FROM usuarios WHERE id = ?',
                [id],
                (error, rows) => {
                    if (error) {
                        reject({ message: 'Não foi possivel obter os usuarios' });
                        return;
                    }
                    rows ? resolve(rows) : resolve();
                })
        });
    }

    cadastrar(usuario) {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO 
                usuarios (usuario, nome, senha)
                VALUES (?, ?, ?)`,
                [
                    usuario.usuario,
                    usuario.nome,
                    usuario.senha
                ],
                function (error, rows) {
                    if (error) {
                        reject({ message: 'Não foi possivel cadastrar o usuario' });
                        return;
                    }
                    resolve({ message:'Usuario cadastro com sucesso', id: this.lastID });
                });
        });
    }

    atualizar(id, nome, senha) {
        return new Promise((resolve, reject) => {
            let set = 'SET ';
            let parametros = []

            if (nome) {
                set += `nome = ?${senha ? ',' : ''}`;
                parametros.push(nome);
            }

            if (senha) {
                set += 'senha = ?';
                parametros.push(senha);
            }

            parametros.push(id);

            db.run(`UPDATE usuarios
                ${set}
                WHERE id = ?
            `,
                parametros,
                (error, rows) => {
                    if (error) {
                        reject({ message: 'Não foi possivel atualizar o usuario' });
                        return;
                    }
                    resolve({ message: 'Usuario atualizado com sucesso' });
                });
        });
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            if(id === '1') {
                reject({ message: 'Usuario admin não pode ser removido' });
                return;
            }

            db.run('DELETE FROM usuarios WHERE id = ?',
                [id],
                (error, rows) => {
                    if (error) {
                        reject({ message: 'Não foi possivel deletar o usuario' });
                        return;
                    }
                    resolve({ message: 'Usuario deletado com sucesso' });
                });
        });
    }
}

module.exports = UsuarioDao;
