const server = require("express").Router();

// EDITAR PROPIEDADES
const { editarDesarrollo } = require('../editarProps/editarDesarrollo.js');
const editarModelo = require('../editarProps/editarModelo.js');
const editarPropIndependiente = require('../editarProps/editarPropIndependiente.js');

const { validarImagenes } = require('../crearProps/validarImagenes.js');
const { cargarImagenGCPyLocal } = require('../crearProps/cargarImgGCPyLocal.js');// Upload Solo Imagenes

const editarTablaImg = require('../editarProps/editarTablaImg.js');
const crearTablaImg = require('../crearProps/crearTablaImg.js');


//Desarrollo
server.post('/editarDesarrollo', editarDesarrollo, editarTablaImg);
server.post('/editarModelo', editarModelo, editarTablaImg);
server.post('/editarPropiedadIndependiente', editarPropIndependiente, editarTablaImg);


// Editar Imagenes
server.post("/editarImagen", validarImagenes, cargarImagenGCPyLocal, crearTablaImg); 


module.exports =  server;