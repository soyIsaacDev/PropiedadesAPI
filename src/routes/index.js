const server = require("express").Router();
/* const cors = require("cors");

server.use(cors()); */
const { servidorAutorizacion } = require("../middleware/checkAutorizacion");
const { servidorPago } = require("../middleware/checkPago");

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
    cargarPropMultiples:require("./cargarPropMultiples"),
    autorizacionUsuario:servidorAutorizacion,
    pagodeServicio:servidorPago,
    paquetesdePago:require("./paquetesdePago"),
    index: server,
  };