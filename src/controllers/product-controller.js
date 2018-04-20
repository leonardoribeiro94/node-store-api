"use strict";

const mongoose = require("mongoose");
const Product = mongoose.model("Product");
const productRepository = require("../repositories/product-repository");
const Contract = require("../shared/validators/fluent-validator");
const response = require("../shared/request-status-message");

exports.get = async (req, res, next) => {
    try {
        let data = await productRepository.get();
        response.ok(res, data);
        return data;
    } catch (error) {
        response.internalError(res, error);
    }
}

exports.getBySlug = async (req, res, next) => {
    try {
        let data = await productRepository.getBySlug(req.params.slug);
        request.ok(res, data);
        return data;
    } catch (error) {
        request.internalError(res, error);
    }
}

exports.getById = async (req, res, next) => {
    try {
        let data = await productRepository.getById(req.params.id);
        response.ok(res, data);
        return data;
    } catch (error) {
        response.internalError(res, error);
    }
}

exports.getByTag = async (req, res, next) => {
    try {
        let data = await productRepository.getByTag(req.params.tag);
        response.ok(res, data);
        return data;
    } catch (error) {
        response.internalError(res, error);
    }
}

exports.post = async (req, res, next) => {
    const contract = new Contract();
    contract.hasMinLen(req.body.title, 3, "O título deve conter pelo menos 3 caracteres");
    contract.hasMinLen(req.body.description, 3, "A descrição deve conter pelo menos 3 caracteres");
    contract.hasMinLen(req.body.slug, 3, "slug deve conter pelo menos 3 caracteres");

    if (!contract.isValid())
        return response.badRequest(res, contract.errors());

    try {
        await productRepository.create({
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            price: req.body.price,
            active: true,
            tags: req.body.tags,
        });
        
        response.ok(res, "Produto cadastrado com sucesso!");
    } catch (error) {
        response.internalError(res, error);
    };
}

exports.put = async (req, res, next) => {
    try {
        await productRepository.update(req.params.id, req.body);
        response.ok(res, "Produto atualizado com sucesso!");
    } catch (error) {
        response.internalError(res, error);
    }
}

exports.delete = async (req, res, next) => {
    try {
        await productRepository.delete(req.body.id);
        response.ok(res, "Produto removido com sucesso!");
    } catch (error) {
        response.internalError(res, data);
    }
}
