"use strict";

const mongoose = require("mongoose");
const guid = require("guid");
const response = require("../shared/request-status-message");
const Contract = require("../shared/validators/fluent-validator");
const orderRepository = require("../repositories/order-repository.js");
const authService = require("../services/auth-service");

exports.get = async (req, res, next) => {
    try {
        let data = await orderRepository.get();
        return response.ok(res, data);
    } catch (error) {
        response.badRequest(res, error);
    }

}

exports.post = async (req, res, next) => {
    let contract = new Contract();

    if (!contract.isValid())
        return response.badRequest(res, contract.errors());

    try {

        let token = req.body.token || req.query.token || req.headers["x-access-token"];
        let data = await authService.decodeToken(token);

        await orderRepository.create({
            customer: data.id,
            number: guid.raw().substring(0, 6),
            items: req.body.items
        });
        response.ok(res, "Pedido cadastrado com sucesso!");
    } catch (error) {
        response.internalError(res, error);
    }
}

