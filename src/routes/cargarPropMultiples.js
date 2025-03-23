const server = require("express").Router();

// Upload Imagenes
// Se carga cada imagen por separado, permitiendo cargar imagenes de tamaños grandes

const { crearDesarrollo } = require('../crearProps/crearDesarrollo')
const { crearModeloAsociadoDesarrollo } = require('../crearProps/crearModeloAsociadoAlDesarrollo');
const { crearPropIndependiente } = require('../crearProps/crearPropIndependiente');

const { validarImagenes }= require('../crearProps/validarImagenes');
const { cargarImagenGCPyLocal } = require('../crearProps/cargarImgGCPyLocal');// Upload Solo Imagenes

const crearTablaImg = require('../crearProps/crearTablaImg');


// Procesar datos de FormData --> https://khendrikse.netlify.app/blog/send-data-with-formdata/
// Desarrollo
server.post("/crearDesarrollo", crearDesarrollo);
// Modelo
server.post("/crearModeloAsociadoPropiedad", crearModeloAsociadoDesarrollo); 
// Propiedad Independiente
server.post("/crearaPropIndependiente", crearPropIndependiente );

// Cargar Imagenes
server.post("/cargarImagen", validarImagenes, cargarImagenGCPyLocal, crearTablaImg); 

module.exports =  server;