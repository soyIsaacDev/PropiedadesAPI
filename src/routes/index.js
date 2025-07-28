const server = require("express").Router();
/* const cors = require("cors");

server.use(cors()); */
const { servidorAutorizacion } = require("../middleware/checkAutorizacion");
const { servidorPago } = require("../middleware/checkPago");

module.exports = {
    clientes: require("./clienteServer"),
    imagen: require("./imgPropiedad"),
    desarrollo:require("./desarrollo"),
    authCliente:require("./authCliente"),
    dbconstants:require("./dBConstants"),
    apikeys:require("./Apikeys"),
    favoritos:require("./favoritos"),
    modeloAsociadoAlDesarrollo: require("./modeloAsociadoAlDesarrollo"),
    allPropiedades: require("./allPropiedades"),
    bulk:require("./bulk"),
    tipoUsuario:require("./tipodeUsuario"),
    addBucketCors:require("./addBucketCors"),
    cargarPropMultiples:require("./cargarPropMultiples"),
    autorizacionUsuario:servidorAutorizacion,
    pagodeServicio:servidorPago,
    paquetesdePago:require("./paquetesdePago"),
    propIndependiente:require("./propIndependiente"),
    editarPropiedades: require("./editarPropMultiples"),
    borrarPropiedades:require("./borrarPropiedades"),
    aliados:require("./aliado"),
    index: server,
  };