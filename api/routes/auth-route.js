const BaseRoute = require('./base-route');
const UsuarioDao = require('../models/usuario-dao');
const Jwt = require('jsonwebtoken');
const Joi = require('joi');

const failAction = (request, hearders, erro) => {
    throw erro;
}

class AuthRoute extends BaseRoute {
    constructor(secret) {
        super();
        this._usuarioDao = new UsuarioDao;
        this.secret = secret;
    }

    login() {
        return {
            path: '/auth',
            method: 'POST',
            config: {
                auth: false,
                validate: {
                    failAction,
                    payload: {
                        usuario: Joi.string().required(),
                        senha: Joi.string().required()
                    }
                }
            },
            handler: async (request, headers) => {
                try {
                    const { usuario, senha } = request.payload;
                    const result = await this._usuarioDao.login(usuario, senha);
                    if (result) {
                        const token = Jwt.sign({
                            ...result
                        }, this.secret);
                        return { token };
                    } else {
                        return "Usuario ou senha invalido";
                    }
                } catch (error) {
                    return error.message;
                }
            }
        };
    }
}

module.exports = AuthRoute;