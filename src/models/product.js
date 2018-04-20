"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    // o schema cria automaticamente o id {_id}
    title: {
        type: String,
        require: true,
        trim: true
    },
    slug: {
        type: String,
        required: [true, "O slug é obrigatório"],
        trim: true,
        index: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    },
    tags: [{
        type: String,
        required: true
    }]
});

module.exports = mongoose.model("Product", schema);
