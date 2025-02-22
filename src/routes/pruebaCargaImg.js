const server = require("express").Router();
const multer = require('multer');

// Upload Google Cloud 

const { pruebaUploadModeloImages }= require('../middleware/PruebaUploadImgGCPmulter');
const { pruebaSendModeloUploadToGCSAsync } = require('../middleware/PruebaUploadImgGCP');// Upload Solo Imagenes
const { pruebaGcpUploadImagenModeloRelacionado } = require('../controllers/pruebaUploadDataImgModeloGCP')
const { pruebaMiddleware } = require('../middleware/pruebaMiddleware');
const upload = multer();

// Modelo

// Procesar datos de FormData --> https://khendrikse.netlify.app/blog/send-data-with-formdata/
                                    // multer.none permite revisar un form data sin cargar archivos
server.post("/dataNuevoModeloAsociadoPropiedad", pruebaGcpUploadImagenModeloRelacionado); 
server.post("/nuevoModeloAsociadoPropiedad", pruebaUploadModeloImages, pruebaSendModeloUploadToGCSAsync); 

//server.post("/nuevoModeloAsociadoPropiedad", pruebaUploadModeloImages, pruebaSendModeloUploadToGCSAsync); 
/* server.post("/nuevoModeloAsociadoPropiedad", async (req,res)=>{
  console.log("SE RECIBEN ARCHIVOS GRANDES")
  res.json({
    codigo:1, 
    Mensaje:`Si pasaron las imagenes`
  });
}); */

server.get("/funcionando", async (req,res)=>{
  res.json("Funcionando OK")
}); 

module.exports =  server;