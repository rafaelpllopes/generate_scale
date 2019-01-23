const BaseRoute = require('./baseRoute');

class IndexRoute extends BaseRoute {
    constructor() {
        super();
    }

    index() {
        return {
            path: '/',
            method: 'GET',
            handler: (request, headers) => { 
                return {status: 'Servidor rodando'} 
            }
        }
    }
}

module.exports = IndexRoute;