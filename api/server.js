const IndexRoute = require('./routes/indexRoute');
const Hapi = require('hapi');
const server = Hapi.server({
    port: 8000
});

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}
server.route([
    ...mapRoutes(new IndexRoute(), IndexRoute.methods())
]);

const main =  async function() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    //console.log('Servidor rodando na porta:', server.info.port);

    return server;
};

module.exports = main();

