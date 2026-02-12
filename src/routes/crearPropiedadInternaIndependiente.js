const server = require("express").Router();

// Upload Imagenes
// Se carga cada imagen por separado, permitiendo cargar imagenes de tamaños grandes
const { crearPropiedadInternaIndependiente } = require('../crearProps/crearPropiedadInternaIndependiente');

const { validarImagenes }= require('../crearProps/validarImagenes');
const { cargarImagenGCPyLocal } = require('../crearProps/cargarImgGCPyLocal');// Upload Solo Imagenes

const crearTablaImg = require('../crearProps/crearTablaImg');


// Procesar datos de FormData --> https://khendrikse.netlify.app/blog/send-data-with-formdata/

// Propiedad Independiente
server.post("/crearPropiedadInternaIndependiente", crearPropiedadInternaIndependiente );

// Cargar Imagenes
server.post("/cargarImagen", validarImagenes, cargarImagenGCPyLocal, crearTablaImg); 

module.exports =  server;