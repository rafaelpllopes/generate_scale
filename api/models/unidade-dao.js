const db = require('../libs/database');

class UnidadesDao {
    listar() {
        return new Promise((resolve, reject) => {
            db.all('SELECT id, unidade, cnes FROM unidades ORDER BY unidade',
                (error, rows) => {
                    if (error) {
                        console.error(`Erros: ${error}`);
                        reject('Não foi possivel obter os unidades');
                        return;
                    }
                    rows ? resolve(rows) : reject({ message: 'Não ha dados encontrados' });
                })
        });
    }
}

module.exports = UnidadesDao;
