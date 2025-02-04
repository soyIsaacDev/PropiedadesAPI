const server = require("express").Router();
/* const cors = require("cors");

server.use(cors()); */
const { confirmaAutorizacion } = require("../middleware/checkAutorizacion");
module.exports = {
    clientes: require("./clienteServer"),
    imagen: require("./imgPropiedad"),
    propiedad:require("./propiedad"),
    authCliente:require("./authCliente"),
    dbconstants:require("./dBConstants"),
    apikeys:require("./Apikeys"),
    favoritos:require("./favoritos"),
    modeloRelacionado: require("./modeloRelacionado"),
    allPropiedades: require("./allPropiedades"),
    bulk:require("./bulk"),
    tipoUsuario:require("./tipodeUsuario"),
    cargaProp:require("./cargaProp"),
    addBucketCors:require("./addBucketCors"),
    pruebaCargarImg:require("./pruebaCargaImg"),
    agente:require("./agenteServer"),
    historialdePagos:require("./historialdepagos"),
    autorizacionUsuario:confirmaAutorizacion,
    index: server,
  };