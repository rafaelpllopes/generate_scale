const assert = require('assert');
const server = require('../server');
let app;
const headers = {
    Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibm9tZSI6IkFkbWluaXN0cmFkb3IiLCJ1c3VhcmlvIjoiYWRtaW4iLCJpYXQiOjE1NDg3MjI0MTJ9.cMSbXpisp5mf6hDzGxwgqFPi0h2YmmnwmbmR4QaT6rU' 
};

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
            headers,
            url: '/unidades'
        });
        const [current] = result;
        delete current.id;
        assert.deepEqual(current, { cnes: '2027151', unidade: 'AMBULATORIO MUNICIPAL MATERNO INFANTIL ITAPEVA' });
    });
});