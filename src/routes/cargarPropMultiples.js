const server = require("express").Router();

// Upload Imagenes
// Se carga cada imagen por separado, permitiendo cargar imagenes de tamaños grandes

const { crearModeloRelacionado } = require('../crearProps/crearModeloRelacionado');
const { crearPropIndependiente } = require('../crearProps/crearPropIndependiente');

const { validarImagenes }= require('../crearProps/validarImagenes');
const { cargarImagenGCPyLocal } = require('../crearProps/cargarImgGCPyLocal');// Upload Solo Imagenes

const { crearTablaImgModeloAsociado } = require('../crearProps/crearTablaImgModeloAsociado');


// Procesar datos de FormData --> https://khendrikse.netlify.app/blog/send-data-with-formdata/

// Modelo
server.post("/dataNuevoModeloAsociadoPropiedad", crearModeloRelacionado); 
server.post("/nuevoModeloAsociadoPropiedad", validarImagenes, cargarImagenGCPyLocal, crearTablaImgModeloAsociado); 

// Propiedad Independiente
server.post("/dataPropIndependiente", crearPropIndependiente );
server.post("/nuevaPropIndependiente", validarImagenes, cargarImagenGCPyLocal );

module.exports =  server;