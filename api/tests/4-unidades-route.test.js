const assert = require('assert');
const server = require('../server');
let app;

describe('Testando rota /unidades', function () {
    this.beforeAll(async () => {
        app = await server;
    });

    this.afterAll(async () => {
        app.stop();
    });

    it('/unidades - GET listar as unidades', async () => {
        const { result } = await app.inject({
            method: 'GET',
            url: '/unidades'
        });
        const [current] = result;
        delete current.id;
        assert.deepEqual(current, { cnes: '2027151', unidade: 'AMBULATORIO MUNICIPAL MATERNO INFANTIL ITAPEVA' });
    });
});