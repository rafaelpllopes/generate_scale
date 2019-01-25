const UnidadesDao = require('../models/unidade-dao');
const BaseRoute = require('./base-route');

class UnidadesRoute extends BaseRoute {
    constructor() {
        super();
        this._unidadesDao = new UnidadesDao;
    }

    listar() {
        return {
            path: '/unidades',
            method: 'GET',
            handler: async (request, headers) => {
                try {
                    return await this._unidadesDao.listar();
                } catch (error) {
                    return error.message;
                }
            }
        };
    }
}

module.exports = UnidadesRoute;