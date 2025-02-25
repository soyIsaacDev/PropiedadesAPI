const server = require("express").Router();
const multer = require('multer');

// Upload Google Cloud 
// Se carga cada imagen por separado, permitiendo cargar imagenes de tamaños grandes

const { validarImagenes }= require('../crearProps/validarImagenes');
const { cargarImagenGCP } = require('../crearProps/cargarImgGCP');// Upload Solo Imagenes
const { pruebaMiddleware } = require('../middleware/pruebaMiddleware');

const { crearPropIndependiente } = require('../crearProps/crearPropIndependiente');
const { crearModeloRelacionado } = require('../crearProps/crearModeloRelacionado');
const upload = multer();

// Modelo

// Procesar datos de FormData --> https://khendrikse.netlify.app/blog/send-data-with-formdata/
                                    // multer.none permite revisar un form data sin cargar archivos
server.post("/dataNuevoModeloAsociadoPropiedad", crearModeloRelacionado); 
server.post("/nuevoModeloAsociadoPropiedad", validarImagenes, cargarImagenGCP); 

server.post("/dataPropIndependiente", crearPropIndependiente, validarImagenes );

//server.post("/nuevoModeloAsociadoPropiedad", validarImagenes, cargarImagenGCP); 
/* server.post("/nuevoModeloAsociadoPropiedad", async (req,res)=>{
  console.log("SE RECIBEN ARCHIVOS GRANDES")
  res.json({
    codigo:1, 
    Mensaje:`Si pasaron las imagenes`
  });
}); */

server.post("/funcionando", async (req,res)=>{
  console.log("Funcionando OK")
  res.json("Funcionando OK")
}); 

module.exports =  server;