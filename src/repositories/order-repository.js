"use strict";

var mongoose = require("mongoose");
var Order = require("../models/order");

exports.create = async (data) => {
    let order = new Order(data);
    await order.save();
}

exports.get = async () => {
    return Order.find({}, "number status customer items")
    .populate("customer", "name")
    .populate("items.product", "title");
}

