const server = require("express").Router();

// Upload Local

const uploadImagenesLocal = require("../middleware/uploadImagenesLocal"); // Upload Solo Imagenes
// Desarrollo
const { uploadDataImagenDesarrollo } = require("../controllers/uploadDataImgDesarrolloLocal");
const { editarDataDesarrollo } = require("../controllers/editarDataImgDesarrolloLocal");
  // Modelo
const { uploadDataImagenModelo} = require("../controllers/uploadDataImgModeloLocal");
const { editarDataModelo } = require("../controllers/editarDataImgModeloLocal");


// Upload Google Cloud 

  // Upload Imagenes separado entre Desarrollo y Modelo ya que el buket donde se guardan las imagenes es diferente 
const {uploadImagenesGCP, sendUploadToGCSAsync } = require('../middleware/uploadImagenesGCPDesarrollo'); // Upload Solo Imagenes
const {uploadModeloImages, sendModeloUploadToGCSAsync} = require('../middleware/uploadImagenesGCPModelo');// Upload Solo Imagenes
  
  // Desarrollo
const {gcpUploadDataImagenDesarrollo} = require("../controllers/uploadDataImgDesarrolloGCP");
const {gcpEditarImagenDesarrollo} = require("../controllers/editarDataImgDesarrolloGCP");
  // Modelo
const {gcpUploadImagenModeloRelacionado} = require("../controllers/uploadDataImgModeloGCP");
const { gcpEditarImagenModelo } = require("../controllers/editarDataImgModeloGCP"); 

const { Propiedad  } = require("../db");

const DEVMODE = process.env.DEVELOPMENT;

if(DEVMODE === "build" ){
  server.post('/nuevaPropiedad',  uploadImagenesLocal, uploadDataImagenDesarrollo);
  server.post('/editarPropiedad', uploadImagenesLocal, editarDataDesarrollo);
  // Modelo
                // Ver si se puede simplificar borrado UploadDataImagenModelo y gcpUploadDataImagenDesarrollo para hacer uno solo
  server.post('/nuevoModeloAsociadoPropiedad',  uploadImagenesLocal, uploadDataImagenModelo);
  server.post('/editarModeloAsociadoPropiedad', uploadImagenesLocal, editarDataModelo);
}
else{
  server.post("/nuevaPropiedad", uploadImagenesGCP, sendUploadToGCSAsync,
    gcpUploadDataImagenDesarrollo,
  ); 
  server.post('/editarPropiedad', uploadImagenesGCP, sendUploadToGCSAsync,
    gcpEditarImagenDesarrollo
  )
  // Modelo
  server.post("/nuevoModeloAsociadoPropiedad", uploadModeloImages, sendModeloUploadToGCSAsync,
    gcpUploadImagenModeloRelacionado
  ); 
  server.post('/editarModeloAsociadoPropiedad', uploadModeloImages, sendModeloUploadToGCSAsync,
    gcpEditarImagenModelo
  );
}

server.post("/hardDeleteDesarrollo", async (req, res) => {
    try {
      const { IdDesarrolloABorrar} = req.body;
      const DesarrolloABorrar = await Propiedad.findByPk(IdDesarrolloABorrar);
      await DesarrolloABorrar.destroy();
      
      res.json("Se borrro el desarrollo ID " + IdDesarrolloABorrar);
    } catch (e) {
      res.send(e)
    }
})

server.post("/hardDeleteModeloRelacionado", async (req, res) => {
  try {
    const { IdModeloABorrar} = req.body;
    const modeloRelacionadoABorrar = await ModeloAsociadoPropiedad.findByPk(IdModeloABorrar);
    await modeloRelacionadoABorrar.destroy();
    
    res.json("Se Borro el modelo ID " + IdModeloABorrar);
  } catch (e) {
    res.send(e)
  }
})
module.exports =  server;