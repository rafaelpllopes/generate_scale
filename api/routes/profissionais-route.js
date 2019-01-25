const ProfissionalDao = require('../models/profissional-dao');
const BaseRoute = require('./base-route');
const Joi = require('joi');

class ProfissionaisRoute extends BaseRoute {
    constructor() {
        super();
        this._profissionalDao = new ProfissionalDao;
    }

    listar() {
        return {
            path: '/profissionais',
            method: 'GET',
            handler: async (request, headers) => {
                try {
                    return await this._profissionalDao.listar();
                } catch (error) {
                    return error.message;
                }
            }
        };
    }

    buscaPorId() {
        return {
            path: '/profissionais/{id}',
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
                    return await this._profissionalDao.buscaPorId(id);
                } catch (error) {
                    return error.message;
                }
            }
        };
    }

    cadastrar() {
        return {
            path: '/profissionais',
            method: 'POST',
            config: {
                validate: {
                    payload: {
                        nome: Joi.string().min(3).required(),
                        conselho: Joi.string(),
                        funcao: Joi.string(),
                        especialidade: Joi.string(),
                        telefone: Joi.string(),
                        email: Joi.string().email()
                    }
                }
            },
            handler: async (request, headers) => {
                try {
                    const { payload } = request;
                    return await this._profissionalDao.cadastrar(payload);
                } catch (error) {
                    return error.message;
                }
            }
        };
    }

    atualizar() {
        return {
            path: '/profissionais/{id}',
            method: 'PUT',
            config: {
                validate: {
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        nome: Joi.string().min(3).required(),
                        conselho: Joi.string(),
                        funcao: Joi.string(),
                        especialidade: Joi.string(),
                        telefone: Joi.string(),
                        email: Joi.string().email()
                    }
                }
            },
            handler: async (request, headers) => {
                try {
                    const { id } = request.params;
                    const { payload } = request;
                    return await this._profissionalDao.atualizar(id, payload);
                } catch (error) {
                    return error.message;
                }
            }
        };
    }

    delete() {
        return {
            path: '/profissionais/{id}',
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
                    return await this._profissionalDao.delete(id);
                } catch (error) {
                    return error.message;
                }
            }
        };
    }
}

module.exports = ProfissionaisRoute;