"use strict";

exports.ok = (res, value) => {
    res.status(200).send({ result: value })
}

exports.internalError = (res, error) => {
    return res.status(500).send({
        result: "Falha ao processar sua requisição ", 
        data: error
    });
}

exports.badRequest = (res, message) => {
    return res.status(400).send({
        result: message
    });
}

exports.unauthorized = (res, message) => {
    return res.status(401).send({
        result: message
    });
}

exports.forbidden = (res, message) => {
    return res.status(403).send({
        result: message
    });
}

exports.notFound = (res, message) => {
    return res.status(404).send({
        result: message
    });
}

