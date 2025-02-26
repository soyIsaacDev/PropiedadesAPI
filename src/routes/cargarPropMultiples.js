const server = require("express").Router();

// Upload Imagenes
// Se carga cada imagen por separado, permitiendo cargar imagenes de tamaños grandes

const { crearModeloRelacionado } = require('../crearProps/crearModeloRelacionado');
const { crearPropIndependiente } = require('../crearProps/crearPropIndependiente');

const { validarImagenes }= require('../crearProps/validarImagenes');
const { cargarImagenGCPyLocal } = require('../crearProps/cargarImgGCPyLocal');// Upload Solo Imagenes

const crearTablaImg = require('../crearProps/crearTablaImg');


// Procesar datos de FormData --> https://khendrikse.netlify.app/blog/send-data-with-formdata/

// Modelo
server.post("/crearModeloAsociadoPropiedad", crearModeloRelacionado); 
server.post("/cargarImagen", validarImagenes, cargarImagenGCPyLocal, crearTablaImg); 

// Propiedad Independiente
server.post("/crearaPropIndependiente", crearPropIndependiente );

module.exports =  server;