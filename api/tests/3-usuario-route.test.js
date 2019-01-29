const assert = require('assert');
const server = require('../server');
const sha256 = require('sha256');
let app;
let lastId;
let postId;
const headers = {
    Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibm9tZSI6IkFkbWluaXN0cmFkb3IiLCJ1c3VhcmlvIjoiYWRtaW4iLCJpYXQiOjE1NDg3MjI0MTJ9.cMSbXpisp5mf6hDzGxwgqFPi0h2YmmnwmbmR4QaT6rU' 
};

describe('Testando rota /usuarios', function () {
    this.beforeAll(async () => {
        app = await server;
        const payload = JSON.stringify({ usuario: 'teste', senha: sha256('testeteste'), nome: 'TESTE' });

        let { result } = await app.inject({
            method: 'POST',
            headers,
            url: '/usuarios',
            payload
        });
        lastId = result.id;
    });

    this.afterAll(async () => {
        await app.inject({
            method: 'DELETE',
            headers,
            url: `/usuarios/${postId}`
        });
        app.stop();
    });

    it('/usuarios - POST cadastrar um usuario', async () => {
        const payload = JSON.stringify({ usuario: `teste${new Date().toTimeString()}`, senha: sha256('testeteste'), nome: 'Teste' });

        let { result } = await app.inject({
            method: 'POST',
            headers,
            url: '/usuarios',
            payload
        });
        postId = result.id;
        assert.deepEqual(result.message, 'Usuario cadastro com sucesso');
    });

    it('/usuarios - POST erro no cadastro', async () => {
        const payload = JSON.stringify({ usuario: `admin`, senha: sha256('testeteste'), nome: 'Teste' });

        let { result } = await app.inject({
            method: 'POST',
            headers,
            url: '/usuarios',
            payload
        });
        assert.deepEqual(result, 'Não foi possivel cadastrar o usuario');
    });

    it('/usuarios - GET rota esta ativa', async () => {
        let result = await app.inject({
            method: 'GET',
            headers,
            url: '/usuarios'
        });
        assert.deepEqual(result.statusCode, 200);
    });

    it('/usuarios - GET listar os usuarios', async () => {
        const { result } = await app.inject({
            method: 'GET',
            headers,
            url: '/usuarios'
        });
        delete result[0].id;
        assert.deepEqual(result[0], { usuario: 'admin', nome: 'Administrador' });
    });

    it('/usuarios/id - GET buscar usuario por ID', async () => {
        let { result } = await app.inject({
            method: 'GET',
            headers,
            url: `/usuarios/${lastId}`
        });
        delete result.id;
        assert.deepEqual(result, { usuario: 'teste', nome: 'TESTE' });
    });

    it('/usuarios/id - PATCH atualizar o nome de um usuario', async () => {
        const payload = JSON.stringify({ nome: 'Scale Teste' });

        let { result } = await app.inject({
            method: 'PATCH',
            headers,
            url: `/usuarios/${lastId}`,
            payload
        });

        assert.deepEqual(result.message, 'Usuario atualizado com sucesso');
    });

    it('/usuarios/id - PATCH atualizar a senha de um usuario', async () => {
        const payload = JSON.stringify({ senha: '12345678' });

        let { result } = await app.inject({
            method: 'PATCH',
            headers,
            url: `/usuarios/${lastId}`,
            payload
        });

        assert.deepEqual(result.message, 'Usuario atualizado com sucesso');
    });

    it('/usuarios/id - PATCH atualizar o nome e a senha de um usuario', async () => {
        const payload = JSON.stringify({ nome: 'Super Scale Teste', senha: '12345678' });

        let { result } = await app.inject({
            method: 'PATCH',
            headers,
            url: `/usuarios/${lastId}`,
            payload
        });

        assert.deepEqual(result.message, 'Usuario atualizado com sucesso');
    });

    it('/usuarios/id - PATCH enviar dados vazio', async () => {
        const payload = JSON.stringify({});

        let { result } = await app.inject({
            method: 'PATCH',
            headers,
            url: `/usuarios/${lastId}`,
            payload
        });

        assert.deepEqual(result, 'Não foi possivel atualizar o usuario');
    });

    it('/usuarios/id - PATCH id invalido', async () => {
        const payload = JSON.stringify({});

        let { result } = await app.inject({
            method: 'PATCH',
            headers,
            url: `/usuarios/a`,
            payload
        });

        assert.deepEqual(result, 'Não foi possivel atualizar o usuario');
    });

    it('/usuarios/id - DELETE deletar um usuario', async () => {
        let { result } = await app.inject({
            method: 'DELETE',
            headers,
            url: `/usuarios/${lastId}`
        });

        assert.deepEqual(result.message, 'Usuario deletado com sucesso');
    });

    it('/usuarios/id - DELETE não pode deletar o usuario admin', async () => {
        let { result } = await app.inject({
            method: 'DELETE',
            headers,
            url: `/usuarios/1`
        });
        assert.deepEqual(result, 'Usuario admin não pode ser removido');
    });
});