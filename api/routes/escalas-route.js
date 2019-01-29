const EscalaDao = require('../models/escala-dao');
const BaseRoute = require('./base-route');
const Joi = require('joi');

const failAction = (request, hearders, erro) => {
    throw erro;
}

class EscalasRoute extends BaseRoute {
    constructor() {
        super();
        this._escalaDao = new EscalaDao;
    }

    escalasMesProfissional() {
        return {
            path: '/escalas/profissional',
            method: 'GET',
            config: {
                validate: {
                    failAction,
                    query: {
                        profissionais: Joi.number().required(),
                        mes: Joi.string().required(),
                        ano: Joi.string().required()
                    }
                }
            },
            handler: async (request, headers) => {
                try {
                    const { profissional, mes, ano } = request.query;
                    return await this._escalaDao.escalasMesProfissional(profissional, mes, ano);
                } catch (error) {
                    return error.message;
                }
            }
        };
    }

    escalasMesUnidade() {
        return {
            path: '/escalas/unidade',
            method: 'GET',
            config: {
                validate: {
                    failAction,
                    query: {
                        unidade: Joi.number().required(),
                        mes: Joi.string().required(),
                        ano: Joi.string().required()
                    }
                }
            },
            handler: async (request, headers) => {
                try {
                    const { unidade, mes, ano } = request.query;
                    return await this._escalaDao.escalasMesUnidade(unidade, mes, ano);
                } catch (error) {
                    return error.message;
                }
            }
        };
    }
}

module.exports = EscalasRoute;