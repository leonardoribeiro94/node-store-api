"use strict";

const express = require("express"); //ultilizar conceito mvc
const bodyParser = require("body-parser"); //auxilia na conversão para Json
const mongoose = require("mongoose");
const config = require("./config");
const router = express.Router();
const app = express();

//configurando o bodyParser (normalizar formato json)
app.use(bodyParser.json({
    limit: "5mb"
}));
app.use(bodyParser.urlencoded({ extended: false }));

//habilita o CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

//conexao ao banco
mongoose.connect(config.connectionString);

//carregando os models
const product = require("./models/product");
const customer = require("./models/customer");
const order = require("./models/order");

//criando rotas
const indexRoute = require("./routes/index-route");
const productRoute = require("./routes/product-route");
const customerRoute = require("./routes/customer-route");
const orderRoute = require("./routes/order-route");

app.use("/", indexRoute);
app.use("/products", productRoute);
app.use("/customers", customerRoute);
app.use("/orders", orderRoute);

//exportando o app
module.exports = app;
