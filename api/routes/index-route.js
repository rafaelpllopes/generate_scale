const BaseRoute = require('./base-route');

class IndexRoute extends BaseRoute {
    constructor() {
        super();
    }

    index() {
        return {
            path: '/',
            method: 'GET',
            config: {
                auth: false
            },
            handler: (request, headers) => { 
                return {status: 'Servidor rodando'} 
            }
        }
    }
}

module.exports = IndexRoute;