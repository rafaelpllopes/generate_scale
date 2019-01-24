const assert = require('assert');
const server = require('../server');
let app;
let lastId;
let postId;

describe('Testando rota /usuarios', function () {
    this.beforeAll(async () => {
        const payload = JSON.stringify({ usuario: 'teste', nome: 'TESTE', senha: 'scaleteste' });
        app = await server;

        const { result } = await app.inject({
            method: 'POST',
            url: '/usuarios',
            payload
        });

        lastId = result.id
    });

    this.afterAll(async () => {
        await app.inject({
            method: 'DELETE',
            url: `/usuarios/${postId}`
        });
    });

    it('/usuarios - GET rota esta ativa', async () => {
        let result = await app.inject({
            method: 'GET',
            url: '/usuarios'
        });
        assert.deepEqual(result.statusCode, 200);
    });

    it('/usuarios - GET listar os usuarios', async () => {
        const { result } = await app.inject({
            method: 'GET',
            url: '/usuarios'
        });
        assert.deepEqual(result[0], { usuario: 'admin', nome: 'Administrador' });
    });

    it('/usuarios/id - GET buscar usuario por ID', async () => {
        let { result } = await app.inject({
            method: 'GET',
            url: `/usuarios/${lastId}`
        });

        assert.deepEqual(result[0], { usuario: 'teste', nome: 'TESTE' });
    });

    it('/usuarios - POST cadastrar um usuario', async () => {
        const payload = JSON.stringify({ usuario: `teste${new Date().toTimeString()}`, senha: 'testeteste', nome: 'Teste' });

        let { result } = await app.inject({
            method: 'POST',
            url: '/usuarios',
            payload
        });
        postId = result.id;
        assert.deepEqual(result.message, 'Usuario cadastro com sucesso');
    });

    it('/usuarios - POST erro no cadastro', async () => {
        const payload = JSON.stringify({ usuario: `admin`, senha: 'testeteste', nome: 'Teste' });

        let { result } = await app.inject({
            method: 'POST',
            url: '/usuarios',
            payload
        });
        assert.deepEqual(result, 'Não foi possivel cadastrar o usuario');
    });

    it('/usuarios/id - PATCH atualizar o nome de um usuario', async () => {
        const payload = JSON.stringify({ nome: 'Scale Teste' });

        let { result } = await app.inject({
            method: 'PATCH',
            url: `/usuarios/${lastId}`,
            payload
        });

        assert.deepEqual(result.message, 'Usuario atualizado com sucesso');
    });

    it('/usuarios/id - PATCH atualizar a senha de um usuario', async () => {
        const payload = JSON.stringify({ senha: '12345678' });

        let { result } = await app.inject({
            method: 'PATCH',
            url: `/usuarios/${lastId}`,
            payload
        });

        assert.deepEqual(result.message, 'Usuario atualizado com sucesso');
    });

    it('/usuarios/id - PATCH atualizar o nome e a senha de um usuario', async () => {
        const payload = JSON.stringify({ nome: 'Super Scale Teste', senha: '12345678' });

        let { result } = await app.inject({
            method: 'PATCH',
            url: `/usuarios/${lastId}`,
            payload
        });

        assert.deepEqual(result.message, 'Usuario atualizado com sucesso');
    });

    it('/usuarios/id - PATCH enviar dados vazio', async () => {
        const payload = JSON.stringify({});

        let { result } = await app.inject({
            method: 'PATCH',
            url: `/usuarios/${lastId}`,
            payload
        });

        assert.deepEqual(result, 'Não foi possivel atualizar o usuario');
    });

    it('/usuarios/id - PATCH id invalido', async () => {
        const payload = JSON.stringify({});

        let { result } = await app.inject({
            method: 'PATCH',
            url: `/usuarios/a`,
            payload
        });

        assert.deepEqual(result, 'Não foi possivel atualizar o usuario');
    });

    it('/usuarios/id - DELETE deletar um usuario', async () => {
        let { result } = await app.inject({
            method: 'DELETE',
            url: `/usuarios/${lastId}`
        });

        assert.deepEqual(result.message, 'Usuario deletado com sucesso');
    });

    it('/usuarios/id - DELETE não pode deletar o usuario admin', async () => {
        let { result } = await app.inject({
            method: 'DELETE',
            url: `/usuarios/1`
        });
        assert.deepEqual(result, 'Usuario admin não pode ser removido');
    });
});