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

const getNombre = (Nombre, caracteres) =>{
  //Borrando el sufijo de "https://storage.googleapis.com/dadinumco-media/"  ->  47 caracteres 47-7
  //https://storage.googleapis.com/dadinumco_mod_asociado/   ->  54 caracteres
  const NombreExtraido = Nombre.slice(caracteres, Nombre.length);
  return NombreExtraido;
}

server.post("/hardDeleteDesarrolloAlt", async (req, res) => {
    try {
      const { IdDesarrolloABorrar} = req.body;
      
      const desarrolloABorrar = await Propiedad.findByPk(IdDesarrolloABorrar);
      
      
      const imagenPropiedad = await ImgPropiedad.findAll({
        where:{PropiedadId:IdDesarrolloABorrar}
      });

      for (let i = 0; i < imagenPropiedad.length; i++) {
        console.log("Nombre Imagen A Borrar " + imagenPropiedad[i].img_name);
        const ThumbnailImgName = getNombre(imagenPropiedad[i].thumbnail_img, 47)
        const ImgGrandeName = getNombre(imagenPropiedad[i].detalles_imgGde, 47);
        
        //deleteImgDesarrollo(imagenPropiedad[i].img_name).catch(console.error);
        deleteImgDesarrollo(ThumbnailImgName).catch(console.error);
        deleteImgDesarrollo(ImgGrandeName).catch(console.error);
        if(imagenPropiedad[i].detalles_imgChica !== null){
          const ImgChicaName = getNombre(imagenPropiedad[i].detalles_imgChica, 47);
          deleteImgDesarrollo(ImgChicaName).catch(console.error);
        }
      }

      async function deleteImgDesarrollo(fileName) {
        const archivoABorrar = await storageBucket_Desarrollo.file(fileName).delete();
        console.log(`Se Borro el ` + JSON.stringify(archivoABorrar));
      }

      if (desarrolloABorrar === null) {
        console.log('No se puede buscar el desarrollo por PK');
      } else {
        console.log("Desarrollo a Borrar " + JSON.stringify(desarrolloABorrar))
        await desarrolloABorrar.destroy();
      }
      await imagenPropiedad.destroy();

            
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
      const ThumbnailImgName = getNombre(imagenModelo[i].thumbnail_img, 54);
      const ImgGrandeName = getNombre(imagenModelo[i].detalles_imgGde, 54);

      //deleteImgModelo(imagenModelo[i].img_name).catch(console.error);
      deleteImgModelo(ThumbnailImgName).catch(console.error);
      deleteImgModelo(ImgGrandeName).catch(console.error);
      if(imagenModelo[i].detalles_imgChica !== null){
        const ImgChicaName = getNombre(imagenModelo[i].detalles_imgChica, 54)
        deleteImgModelo(ImgChicaName).catch(console.error);
      }
    }

    async function deleteImgModelo(fileName) {
      const archivoABorrar = await storageBucket_Mod_Asoc.file(fileName).delete();  
      console.log(`Se Borro el ` + JSON.stringify(archivoABorrar));
    }

    await modeloRelacionadoABorrar.destroy();
    await imagenModelo.destroy();

    res.json("Se Borro el modelo ID " + IdModeloABorrar);
  } catch (e) {
    res.send(e)
  }
});

server.post("/hardDeleteDesarrollo", async (req, res) => {
  try {
    const { IdDesarrolloABorrar} = req.body;
    const desarrolloABorrar = await Propiedad.findByPk(IdDesarrolloABorrar);
    const imagenDesarrollo = await ImgPropiedad.findAll({
      where:{PropiedadId:IdDesarrolloABorrar}
    });

    for (let i = 0; i < imagenDesarrollo.length; i++) {
      const ThumbnailImgName = getNombre(imagenDesarrollo[i].thumbnail_img, 47);
      const ImgGrandeName = getNombre(imagenDesarrollo[i].detalles_imgGde, 47);

      //deleteImgModelo(imagenDesarrollo[i].img_name).catch(console.error);
      deleteImagenDesarrollo(ThumbnailImgName).catch(console.error);
      deleteImagenDesarrollo(ImgGrandeName).catch(console.error);
      if(imagenDesarrollo[i].detalles_imgChica !== null){
        const ImgChicaName = getNombre(imagenDesarrollo[i].detalles_imgChica, 47)
        deleteImagenDesarrollo(ImgChicaName).catch(console.error);
      }
    }

    async function deleteImagenDesarrollo(fileName) {
      const archivoABorrar = await storageBucket_Mod_Asoc.file(fileName).delete();  
      console.log(`Se Borro el ` + JSON.stringify(archivoABorrar));
    }

    await desarrolloABorrar.destroy();
    await imagenDesarrollo.destroy();

    res.json("Se Borro el Desarrollo Id " + IdDesarrolloABorrar);
  } catch (e) {
    res.send(e)
  }
});

module.exports =  server;