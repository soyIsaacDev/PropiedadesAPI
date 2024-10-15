'use strict';
const multer = require('multer');
const path = require('path')
const config = require('../../configCloudBucket');
// Load the module for Cloud Storage
const {Storage} = require('@google-cloud/storage');
const carpeta = path.join(__dirname, '../../uploads')
const GCLOUD_BUCKET = config.get('GCLOUD_MOD_ASOC_BUCKET');

const storage = new Storage({
  projectId: config.get('GCLOUD_PROJECT')
});
const bucket = storage.bucket(GCLOUD_BUCKET);


const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, carpeta);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  }
});

const multerUpload = multer({
  storage: multerStorage,
  limits: {
    fileSize: 200 * 1024 * 1024, // no larger than 10mb
    fieldSize: 500 * 1024 * 1024 
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
      const ConsoleLog_NombrePara = Buffer.from(file.originalname, 'ascii').toString('utf8');
      console.log("Nombre Original " + ConsoleLog_NombrePara );

      const allowedTypes = ['image/jpeg', 'image/png'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!allowedTypes.includes(file.mimetype)) {
        console.log(`Invalid file type`)
        errors.push(`Invalid file type: ${file.originalname}`);
      }

      if (file.size > maxSize) {
        console.log("File too large")
        errors.push(`File too large: ${file.originalname}`);
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
    next();
    
  });
};



const pruebaSendModeloUploadToGCSAsync = async (req, res, next) => {
  try {
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
  
        reject(err);
      });
  
      uploadStream.on("finish", async () => {
          resolve({ 
              name: file.originalname
          });
          await fileUpload.setMetadata({ 
              contentType: "webp",
              mimetype: "webp"
          });
      });
    
      uploadStream.end(file.buffer);
    });
    
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