const IndexRoute = require('./routes/index-route');
const UsuariosRoute = require('./routes/usuarios-route');
const ProfissionaisRoute = require('./routes/profissionais-route');
const Hapi = require('hapi');
const server = Hapi.server({
    port: 8000
});

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}
server.route([
    ...mapRoutes(new IndexRoute(), IndexRoute.methods()),
    ...mapRoutes(new UsuariosRoute(), UsuariosRoute.methods()),
    ...mapRoutes(new ProfissionaisRoute(), ProfissionaisRoute.methods())
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

