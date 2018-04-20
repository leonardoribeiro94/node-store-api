"use strict";
const jwt = require("jsonwebtoken");
const response = require("../shared/request-status-message");

exports.generateToken = async (data) => {
    return jwt.sign(data, global.SALT_KEY, { expiresIn: '1d' });
}

exports.decodeToken = async (token) => {
    let data = await jwt.verify(token, global.SALT_KEY);
    return data;
}

exports.authorize = (req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token)
        response.unauthorized(res, "Acesso Restrito");
    else {
        jwt.verify(token, global.SALT_KEY, function (error, decoded) {
            if (error)
                response.unauthorized(res, "Token Inválido");
            else
                next();
        });
    }
}

exports.isAdmin = async (req, res, next) => {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token)
        response.unauthorized(res, "Token Inválido");
    else {
        jwt.verify(token, global.SALT_KEY, function (error, decoded) {
            if (error)
                response.unauthorized(res, "Token Inválido");
            else {
                if (decoded.roles.includes("admin")) {
                    next();
                }
                else {
                    response.forbidden(res, "Esta funcionalidade é restrita para administradores!");
                }
            }
        });
    }
}