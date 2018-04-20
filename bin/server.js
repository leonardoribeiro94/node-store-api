//importação
const app = require("../src/app");
const debug = require("debug")("leonardo:server");
const http = require("http");

const port = normalizePort(process.env.port || "3000");

app.set("port", port);

//criando servidor
const server = http.createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

console.log("Api rodando na porta " + port);

//função para normalizar uma porta disponivel
function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(val))
        return val;

    if (port >= 0)
        return port;
}

//tratando error comuns do servidor
function onError(error) {
    if (error.syscall !== 'listen')
        throw error;

    const bind = typeof port === 'string' ? "Pipe" + port : "Port" + port;

    switch (error.code) {
        case "EACCES":
            console.error(bind + "requires elevated privileges");
            process.exit(1);
            break;

        case "EADDINUSE":
            console.error(bind + "is already in use");
            process.exit(1);
            break;

        default:
            throw error;
    }
}

//Startando o debug
function onListening() {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe" + addr : "port" + addr.port;
    debug("Listening on" + bind)
}