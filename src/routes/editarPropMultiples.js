const server = require("express").Router();

// EDITAR PROPIEDADES
const { editarDesarrollo } = require('../editarProps/editarDesarrollo.js');

const { validarImagenes } = require('../crearProps/validarImagenes.js');
const { cargarImagenGCPyLocal } = require('../crearProps/cargarImgGCPyLocal.js');// Upload Solo Imagenes

const editarTablaImg = require('../editarProps/editarTablaImg.js');
const crearTablaImg = require('../crearProps/crearTablaImg.js');


//Desarrollo
server.post('/editarDesarrollo', editarDesarrollo, editarTablaImg);
/* server.get('/edDesarrollo', async (req, res)=>{
    try {
       console.log("Editar Desarrollo Multiple")
       res.json("Editar Propiedades")
       
    } catch (error) {
       res.send(error)
    }
   }); */

// Editar Imagenes
server.post("/editarImagen", validarImagenes, cargarImagenGCPyLocal, crearTablaImg); 


module.exports =  server;