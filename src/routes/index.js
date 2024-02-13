const server = require("express").Router();
const cors = require("cors");

server.use(cors());

module.exports = {
    clientes: require("./clienteServer"),
    imagen: require("./imgPropiedad"),
    propiedad:require("./propiedad"),
    authCliente:require("./authCliente"),
    dbconstants:require("./dBConstants"),
    apikeys:require("./Apikeys"),
    favoritos:require("./favoritos"),
    modeloRelacionado: require("./modeloRelacionado"),
    index: server,
  };