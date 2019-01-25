const db = require('../libs/database');
const sha256 = require('sha256');

class UsuarioDao {

    listar() {
        return new Promise((resolve, reject) => {
            db.all('SELECT id, usuario, nome FROM usuarios ORDER BY nome',
                (error, rows) => {
                    if (error) {
                        console.error(`Erros: ${error}`);
                        reject('Não foi possivel obter os usuarios');
                        return;
                    }
                    rows ? resolve(rows) : reject({ message: 'Não ha dados encontrados' });
                })
        });
    }

    buscaPorId(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT id, usuario, nome FROM usuarios WHERE id = ?',
                [id],
                (error, rows) => {
                    if (error) {
                        reject({ message: 'Não foi possivel obter os usuarios' });
                        return;
                    }
                    rows ? resolve(rows) : reject({ message: 'Não ha dados encontrados' });
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
                    sha256.x2(usuario.senha)
                ],
                function (error, rows) {
                    if (error) {
                        reject({ message: 'Não foi possivel cadastrar o usuario' });
                        return;
                    }
                    resolve({ message: 'Usuario cadastro com sucesso', id: this.lastID });
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
                parametros.push(sha256.x2(senha));
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
            if (id === '1') {
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

    login(usuario, senha) {
        const password = sha256.x2(senha);
        return new Promise((resolve, reject) => {
            db.get('SELECT id, nome, usuario FROM usuarios WHERE usuario = ? AND senha = ?',
                [
                    usuario,
                    password
                ],
                async (error, rows) => {
                    if (error) {
                        reject({ message: 'Não foi possivel fazer o login' });
                        return;
                    }
                    rows ? resolve(rows) : reject({ message: 'Usuario ou senha invalido' });
                });
        });
    }
}

module.exports = UsuarioDao;
