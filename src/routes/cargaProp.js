const server = require("express").Router();

const uploadMultipleImgLocal = require("../controllers/uploadImgPropiedadLocal");
const editarPropiedad = require("../controllers/editarImgPropiedadLocal");
const uploadMultiple = require("../middleware/uploadMultipleLocal");
const gcpUploadImagenesPropiedad = require("../controllers/uploadMultipleImgGCP");
const gcpeditarPropiedad = require("../controllers/editarMultipleImgGCP");
const gcpImageUpload = require('../middleware/uploadMulipleGCP');

const uploadImagenesModeloAsociado = require("../controllers/uploadImgModelo");
const gcpUploadImagenesModeloRelacionado = require("../controllers/uploadMultipleImgModeloRelacionado");
const gcpImageUploadModAsociado = require('../middleware/uploadMulipleGCPModAsociado');

const { Propiedad  } = require("../db");

const DEVMODE = process.env.DEVELOPMENT;

if(DEVMODE === "build" ){
  server.post('/nuevaPropiedad', uploadMultiple, uploadMultipleImgLocal.uploadImagenPropiedad);
  server.post('/editarPropiedad', uploadMultiple, editarPropiedad.editarPropiedad);
}
else{
  server.post("/nuevaPropiedad", 
    gcpImageUpload.sendUploadToGCSAsync,
    gcpUploadImagenesPropiedad.uploadImagenPropiedad,
  ); 
  server.post('/editarPropiedad',
    gcpImageUpload.sendUploadToGCSAsync,
    gcpeditarPropiedad.editarImagenPropiedad
  )
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

if(DEVMODE === "build"){
    server.post('/nuevoModeloAsociadoPropiedad', uploadMultiple, uploadImagenesModeloAsociado.uploadImagenModeloAsociadoPropiedad);
}
else{
    server.post("/nuevoModeloAsociadoPropiedad", 
      gcpImageUploadModAsociado.uploadImages,
      gcpImageUploadModAsociado.sendUploadToGCSAsync,
      gcpUploadImagenesModeloRelacionado.uploadImagenPropiedad
    ); 
}

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