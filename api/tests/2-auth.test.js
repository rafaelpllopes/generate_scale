const assert = require('assert');
const server = require('../server');
const sha256 = require('sha256');
const Jwt = require('jsonwebtoken');
let app;

describe('Testando auth rote /auth', function () {
    this.beforeAll(async () => {
        app = await server;
    });

    this.afterAll(async () => {
        app.stop();
    });

    it('/auth - POST realizar um login e receber o token', async () => {
        const payload = JSON.stringify({ usuario: 'admin', senha: sha256('admin') });
        let { result } = await app.inject({
            method: 'POST',
            url: `/auth`,
            payload
        });

        const token = Jwt.decode(result.token);
        delete token.iat;
        assert.deepEqual(token, { id: 1, nome: 'Administrador', usuario: 'admin' });
    });

    it('/auth - POST realizar um login invalido', async () => {
        const payload = JSON.stringify({ usuario: 'admin', senha: sha256('12345678') });
        let { result } = await app.inject({
            method: 'POST',
            url: `/auth`,
            payload
        });

        assert.deepEqual(result, 'Usuario ou senha invalido');
    });
});