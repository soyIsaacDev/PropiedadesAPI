'use strict';
const multer = require('multer');
const path = require('path')
const config = require('../../configCloudBucket');
// Load the module for Cloud Storage
const {Storage} = require('@google-cloud/storage');
const GCLOUD_BUCKET = config.get('GCLOUD_MOD_ASOC_BUCKET');

const storage = new Storage({
  projectId: config.get('GCLOUD_PROJECT')
});
const bucket = storage.bucket(GCLOUD_BUCKET);

const multerUpload = multer({
  limits: {
    fileSize: 31 * 1024 * 1024, // no larger than 31mb
    fieldSize: 31 * 1024 * 1024 
  }
});

const pruebaUploadModeloImages = (req, res, next) => {
  // Use multer upload instance
  multerUpload.array('imagenesfiles', 40)(req, res, (err) => {
    if (err) {
      console.log(err)
      return res.status(400).json({ error: err.message });
    }
    const files = req.files;
    const errors = [];
    
    // Validate file types and sizes
    files.forEach((file) => {
      //const ConsoleLog_NombrePara = Buffer.from(file.originalname, 'ascii').toString('utf8');
      const allowedTypes = ['image/jpeg', 'image/png'];
      const maxSize = 31 * 1024 * 1024; 

      if (!allowedTypes.includes(file.mimetype)) {
        console.log(`Tipo de archivo invalido`)
        errors.push(`Tipo de archivo invalido: ${file.originalname}`);
      }
      if (file.size > maxSize) {
        console.log("Archivo demasiado grande")
        errors.push(`Archivo demasiado grande: ${file.originalname}`);
      }
    });

    // Handle validation errors
    if (errors.length > 0) {
      const respuestaError = {
        codigo:0, 
        Mensaje:`Error al intentar crear la imagen`,
        Error:errors
      }
      return res.status(400).json(respuestaError);
    }

    req.files = files;
    res.json({
      codigo:1, 
      Mensaje:`Se subieron los archivos`
    });
    
  });
};



const pruebaSendModeloUploadToGCSAsync = async (req, res, next) => {
  try {
    console.log("Probando Send")
    // buscamos si hay fotos
    const files = req.files;
    if (files == undefined) {
      console.log("req.file Undefined")
      return next()
    }
    if (!files) {
      console.log("No hay archivos a subir")
      return next();
    }

    files.forEach(async (file) => {

      const fileUpload = bucket.file(file.originalname);
      const uploadStream = fileUpload.createWriteStream({
        resumable: true,
        metadata: {
            contentType: file.mimetype
        }
      });
      uploadStream.on("error", async (err) => {
        console.log("Error uploading image", err);
  
      });
  
      uploadStream.on("finish", async () => {
          
          await fileUpload.setMetadata({ 
              contentType: "webp",
              mimetype: "webp"
          });
          console.log("Imagen subida de "+file.originalname)
      });
    
      uploadStream.end(file.buffer);
    });
    console.log("Termino de Cargar todas las imagenes")
    res.json({
      codigo:1, 
      Mensaje:`Se cargaron las imagenes correctamente`
    });

  } catch (e) {
    console.log("Error " + e)
    res.send(e)
  }
}


module.exports = {
  multer,
  pruebaUploadModeloImages,
  pruebaSendModeloUploadToGCSAsync
};