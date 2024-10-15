const server = require("express").Router();

// Upload Google Cloud 

const {pruebaUploadModeloImages, pruebaSendModeloUploadToGCSAsync} = require('../middleware/PruebaUploadImgGCP');// Upload Solo Imagenes


// Modelo
server.post("/nuevoModeloAsociadoPropiedad", pruebaUploadModeloImages); 
//server.post("/nuevoModeloAsociadoPropiedad", pruebaUploadModeloImages, pruebaSendModeloUploadToGCSAsync); 

server.get("/funcionando", async (req,res)=>{
  res.json("Funcionando OK")
}); 

module.exports =  server;