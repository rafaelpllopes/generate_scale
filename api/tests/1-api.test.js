const assert = require('assert');
const server = require('../server');
let app;


describe('Testando a API', function() {
    this.beforeAll(async () => {
        app = await server;
    });
    
    this.afterAll(async () => {
        app.stop();
    });

    it('Verica se servidor esta rodando', async () => {
        result = await app.inject('/');
        assert.deepEqual(result.statusCode, 200);
    });
});
