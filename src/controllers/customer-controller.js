"use strict";
const mongoose = require("mongoose");
const customer = mongoose.model("Customer");
const customerRepository = require("../repositories/customer-repository");
const Contract = require("../shared/validators/fluent-validator");
const response = require("../shared/request-status-message");
const md5 = require("md5");
const emailservice = require("../services/email-service");
const authService = require("../services/auth-service");


exports.post = async (req, res, next) => {
    const contract = new Contract();
    contract.hasMinLen(req.body.name, 3, "O nome deve conter no mínimo 3 caracteres")
    contract.hasMinLen(req.body.password, 6, "O password deve conter no mínimo 6 caracteres");
    contract.isEmail(req.body.email, "E-mail inválido");

    if (!contract.isValid())
        return response.badRequest(res, contract.errors());

    try {
        await customerRepository.create({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY),
            roles: req.body.roles,
        });

        emailservice.send(
            req.body.email,
            "Bem vindo ao Node Store",
            global.EMAIL_TMPL.replace("{0}", req.body.name));

        response.ok(res, "Cliente cadastrado com sucesso!");
    } catch (error) {
        response.internalError(res, error);
    };
}

exports.authenticate = async (req, res, next) => {
    const contract = new Contract();
    contract.hasMinLen(req.body.password, 6, "O password deve conter no mínimo 6 caracteres");
    contract.isEmail(req.body.email, "E-mail inválido");

    if (!contract.isValid())
        return response.badRequest(res, contract.errors());

    try {
        const customer = await customerRepository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        });

        if (!customer)
            return response.notFound(res, "Usuário ou senha inválidos");

        const token = await authService.generateToken({
            id: customer._id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        });

        res.status(200).send({
            token: token,
            result: {
                email: customer.email,
                name: customer.name,
                roles: customer.roles
            }
        });

    } catch (error) {
        response.internalError(res, error);
    };
}

exports.refreshToken = async (req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers["x-access-token"];
        const data = await authService.decodeToken(token);
        const customer = await customerRepository.getById(data.id);

        if (!customer)
            return response.notFound(res, "Cliente não encontrado");

        const tokenData = await authService.generateToken({
            id: customer._id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        });

        res.status(200).send({
            token: token,
            result: {
                email: customer.email,
                name: customer.name
            }
        });
    } catch (error) {
        response.internalError(res, error);
    };
}