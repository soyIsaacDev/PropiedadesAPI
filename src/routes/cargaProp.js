const server = require("express").Router();
const {Storage} = require('@google-cloud/storage');
// Creates a client
const storage = new Storage();

const config = require('../../configCloudBucket');
// variable so you can use it in code
const GCLOUD_BUCKET_NAME_Desarrollo = config.get('GCLOUD_BUCKET');

// Get a reference to the Cloud Storage bucket
const storageBucket_Desarrollo = storage.bucket(GCLOUD_BUCKET_NAME_Desarrollo);

const GCLOUD_BUCKET_NAME_Mod_Asoc = config.get('GCLOUD_MOD_ASOC_BUCKET');
const storageBucket_Mod_Asoc = storage.bucket(GCLOUD_BUCKET_NAME_Mod_Asoc);

const { Propiedad, ImgPropiedad, ModeloAsociadoPropiedad, ImgModeloAsociado  } = require("../db");

const DEVMODE = process.env.DEVELOPMENT;

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

      const imagenPropiedad = await ImgPropiedad.findAll({
        where:{PropiedadId:IdDesarrolloABorrar}
      });

      console.log(imagenPropiedad);

      for (let i = 0; i < imagenPropiedad.length; i++) {
        console.log("Nombre Imagen A Borrar " + imagenPropiedad[i].img_name);
        deleteImgDesarrollo(imagenPropiedad[i].img_name).catch(console.error);
        deleteImgDesarrollo(imagenPropiedad[i].thumbnail_img).catch(console.error);
        deleteImgDesarrollo(imagenPropiedad[i].detalles_imgGde).catch(console.error);
        if(imagenPropiedad[i].detalles_imgChica !== null){
          deleteImgDesarrollo(imagenPropiedad[i].detalles_imgChica).catch(console.error);
        }
      }

      async function deleteImgDesarrollo(fileName) {
        console.log("Delete Imagen Desarrollo "+fileName);
        const archivoABorrar = await storageBucket_Desarrollo.file(fileName).delete();
        console.log(`Se Borro el ${ultimoFile}`);
      }
      const ultimoFile = storageBucket_Desarrollo.file(imagenPropiedad[imagenPropiedad.length-1].detalles_imgGde);
      ultimoFile.exists(function(err, exists) {});

      ultimoFile.exists().then(async function(data) {
        const exists = data[0];
        console.log(exists)
        if(exists===0){
          await imagenPropiedad.destroy();
          await DesarrolloABorrar.destroy();
        }
      });
      
      res.json("Se borrro el desarrollo ID " + IdDesarrolloABorrar);
    } catch (e) {
      res.send(e)
    }
})

server.post("/hardDeleteModeloRelacionado", async (req, res) => {
  try {
    const { IdModeloABorrar} = req.body;
    const modeloRelacionadoABorrar = await ModeloAsociadoPropiedad.findByPk(IdModeloABorrar);
    const imagenModelo = await ImgModeloAsociado.findAll({
      where:{ModeloAsociadoPropiedadId:IdModeloABorrar}
    });

    for (let i = 0; i < imagenModelo.length; i++) {
      console.log("Nombre Imagen A Borrar " + imagenModelo[i].img_name);
      deleteImgModelo(imagenModelo[i].img_name).catch(console.error);
      deleteImgModelo(imagenModelo[i].thumbnail_img).catch(console.error);
      deleteImgModelo(imagenModelo[i].detalles_imgGde).catch(console.error);
      if(imagenModelo[i].detalles_imgChica !== null){
        deleteImgModelo(imagenModelo[i].detalles_imgChica).catch(console.error);
      }
    }

    async function deleteImgModelo(fileName) {
      await storageBucket_Mod_Asoc.file(fileName).delete();  
      console.log(`gs://${GCLOUD_BUCKET_NAME_Mod_Asoc}/${fileName} deleted`);
    }

    await modeloRelacionadoABorrar.destroy();
    await imagenModelo.destroy();

    res.json("Se Borro el modelo ID " + IdModeloABorrar);
  } catch (e) {
    res.send(e)
  }
})
module.exports =  server;