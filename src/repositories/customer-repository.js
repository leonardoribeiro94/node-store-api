"use strict";
const mongoose = require("mongoose");
const Customer = require("../models/customer");

exports.authenticate = async (data) => {
    const res = await Customer.findOne({
        email: data.email,
        password: data.password
    });

    return res;
}

exports.create = async (data) => {
    // recupera o token
    let customer = new Customer(data);
    await customer.save();
}

exports.getById = async (id) => {
    return await Customer.findById(id);
}