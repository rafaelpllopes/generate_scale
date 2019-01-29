const IndexRoute = require('./routes/index-route');
const UsuariosRoute = require('./routes/usuarios-route');
const ProfissionaisRoute = require('./routes/profissionais-route');
const UnidadesRoute = require('./routes/unidades-route');
const AuthRoute = require('./routes/auth-route');
const EscalasRoute = require('./routes/escalas-route');
const Hapi = require('hapi');
const HapiJwt = require('hapi-auth-jwt2');
const server = Hapi.server({
    port: 8000
});

const secret = "secret";

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

server.route([
    ...mapRoutes(new IndexRoute(), IndexRoute.methods()),
    ...mapRoutes(new AuthRoute(secret), AuthRoute.methods()),
    ...mapRoutes(new UsuariosRoute(), UsuariosRoute.methods()),
    ...mapRoutes(new ProfissionaisRoute(), ProfissionaisRoute.methods()),
    ...mapRoutes(new UnidadesRoute(), UnidadesRoute.methods()),
    ...mapRoutes(new EscalasRoute(), EscalasRoute.methods())
]);

const main =  async function() {

    try {
        await server.register(HapiJwt);
        await server.start();
        server.auth.strategy('jwt', 'jwt', {
            key: secret,
            options: {
                expiresIn: 3600
            },
            validate: (dado, request) => {
                return {
                    isValid: true
                }
            }
        });
        server.auth.default('jwt');
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    //console.log('Servidor rodando na porta:', server.info.port);

    return server;
};

module.exports = main();

