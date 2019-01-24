const UsuarioDao = require('../models/usuario-dao');
const BaseRoute = require('./base-route');
const Joi = require('joi');

class UsuarioRoute extends BaseRoute {
    constructor() {
        super();
        this._usuarioDao = new UsuarioDao;
    }

    listar() {
        return {
            path: '/usuarios',
            method: 'GET',
            handler: async (request, headers) => {
                try {
                    return await this._usuarioDao.listar();
                } catch (error) {
                    return error.message;
                }
            }
        };
    }

    buscaPorId() {
        return {
            path: '/usuarios/{id}',
            method: 'GET',
            config: {
                validate: {
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: async (request, headers) => {
                try {
                    const { id } = request.params;
                    return await this._usuarioDao.buscaPorId(id);
                } catch (error) {
                    return error.message;
                }
            }
        };
    }

    cadastrar() {
        return {
            path: '/usuarios',
            method: 'POST',
            config: {
                validate: {
                    payload: {
                        usuario: Joi.string().min(3).required(),
                        senha: Joi.string().min(8).max(50).required(),
                        nome: Joi.string().min(3).max(250).required()
                    }
                }
            },
            handler: async (request, headers) => {
                try {
                    const { usuario, senha, nome } = request.payload;
                    return await this._usuarioDao.cadastrar({ usuario, senha, nome });
                } catch (error) {
                    return error.message;
                }
            }
        };
    }

    atualizar() {
        return {
            path: '/usuarios/{id}',
            method: 'PATCH',
            config: {
                validate: {
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        nome: Joi.string().min(3).max(250),
                        senha: Joi.string().min(8).max(50)
                    }
                }
            },
            handler: async (request, headers) => {
                try {
                    const { id } = request.params;
                    const { senha, nome } = request.payload;
                    return await this._usuarioDao.atualizar(id, nome, senha);
                } catch (error) {
                    return error.message;
                }
            }
        };
    }

    delete() {
        return {
            path: '/usuarios/{id}',
            method: 'DELETE',
            config: {
                validate: {
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: async (request, headers) => {
                try {
                    const { id } = request.params;
                    return await this._usuarioDao.delete(id);
                } catch (error) {
                    return error.message;
                }
            }
        };
    }
}

module.exports = UsuarioRoute;