const assert = require('assert');
const server = require('../server');
let app;
let lastId;
let postId;
const headers = {
    Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibm9tZSI6IkFkbWluaXN0cmFkb3IiLCJ1c3VhcmlvIjoiYWRtaW4iLCJpYXQiOjE1NDg3MjI0MTJ9.cMSbXpisp5mf6hDzGxwgqFPi0h2YmmnwmbmR4QaT6rU' 
};

describe('Testando rota /profissionais', function () {
    this.beforeAll(async () => {
        const payload = JSON.stringify({ nome: 'teste', conselho: 'teste', funcao: 'teste', especialidade: 'teste', telefone: '00 0000 0000', email: 'teste@teste' });
        app = await server;

        const { result } = await app.inject({
            method: 'POST',
            headers,
            url: '/profissionais',
            payload
        });

        lastId = result.id;
    });

    this.afterAll(async () => {
        await app.inject({
            method: 'DELETE',
            headers,
            url: `/profissionais/${postId}`
        });
        app.stop();
    });

    it('/profissionais - POST cadastrar um usuario', async () => {
        const payload = JSON.stringify({ nome: 'teste-teste', conselho: 'teste', funcao: 'teste', especialidade: 'teste', telefone: '00 0000 0000', email: 'teste@teste' });

        let { result } = await app.inject({
            method: 'POST',
            headers,
            url: '/profissionais',
            payload
        });
        postId = result.id;
        assert.deepEqual(result.message, 'Profissional cadastro com sucesso');
    });

    it('/profissionais - POST sem o campo nome que é obrigatorio', async () => {
        const payload = JSON.stringify({ conselho: 'teste', funcao: 'teste', especialidade: 'teste', telefone: '00 0000 0000', email: 'teste@teste' });

        let { result } = await app.inject({
            method: 'POST',
            headers,
            url: '/profissionais',
            payload
        });
        assert.deepEqual(result.message, 'child "nome" fails because ["nome" is required]');
    });

    it('/profissionais - GET rota esta ativa', async () => {
        let result = await app.inject({
            method: 'GET',
            headers,
            url: '/profissionais'
        });
        assert.deepEqual(result.statusCode, 200);
    });

    it('/profissionais - GET listar os profissionais', async () => {
        const { result } = await app.inject({
            method: 'GET',
            headers,
            url: '/profissionais'
        });
        delete result[0].id;
        assert.deepEqual(result[0], { nome: 'teste',
            conselho: 'teste', 
            funcao: 'teste', 
            especialidade: 'teste', 
            telefone: '00 0000 0000', 
            email: 'teste@teste' 
        });
    });

    it('/profissionais/id - GET buscar usuario por ID', async () => {
        let { result } = await app.inject({
            method: 'GET',
            headers,
            url: `/profissionais/${lastId}`
        });
        delete result.id;
        assert.deepEqual(result, { nome: 'teste', conselho: 'teste', funcao: 'teste', especialidade: 'teste', telefone: '00 0000 0000', email: 'teste@teste' });
    });

    it('/profissionais/id - GET Erro na busca do usuario por ID requisição sem o ID', async () => {
        let { result } = await app.inject({
            method: 'GET',
            headers,
            url: `/profissionais/eee`
        });
        delete result.id;
        assert.deepEqual(result.message, 'child "id" fails because ["id" must be a number]');
    });

    it('/profissionais/id - PUT atualizar o profissional', async () => {
        const payload = JSON.stringify({
            nome: 'teste-novo', 
            conselho: 'teste-novo', 
            funcao: 'teste-novo', 
            especialidade: 'teste-novo', 
            telefone: '00 0000 0000', 
            email: 'teste-novo@teste-novo'
        });

        let { result } = await app.inject({
            method: 'PUT',
            headers,
            url: `/profissionais/${postId}`,
            payload
        });

        assert.deepEqual(result.message, 'Profissional atualizado com sucesso');
    });

    it('/profissionais/id - PUT sem o campo nome que é obrigatorios', async () => {
        const payload = JSON.stringify({ conselho: 'teste', funcao: 'teste', especialidade: 'teste', telefone: '00 0000 0000', email: 'teste@teste' });

        let { result } = await app.inject({
            method: 'PUT',
            headers,
            url: `/profissionais/${postId}`,
            payload
        });

        assert.deepEqual(result.message, 'child "nome" fails because ["nome" is required]');
    });

    it('/profissionais/id - PUT id invalido', async () => {
        const payload = JSON.stringify({
            nome: 'teste-novo', 
            conselho: 'teste-novo', 
            funcao: 'teste-novo', 
            especialidade: 'teste-novo', 
            telefone: '00 0000 0000', 
            email: 'teste-novo@teste-novo'
        });

        let { result } = await app.inject({
            method: 'PUT',
            headers,
            url: `/profissionais/a`,
            payload
        });

        assert.deepEqual(result.message, 'child "id" fails because ["id" must be a number]');
    });

    it('/profissionais/id - DELETE deletar um profissional', async () => {
        let { result } = await app.inject({
            method: 'DELETE',
            headers,
            url: `/profissionais/${lastId}`
        });
        assert.deepEqual(result.message, 'Profissional deletado com sucesso');
    });
});