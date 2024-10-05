'use strict';
const config = require('../../configCloudBucket');
const sharp = require('sharp');
// Load the module for Cloud Storage
const {Storage} = require('@google-cloud/storage');

// Multer handles parsing multipart/form-data requests.
// This instance is configured to store images in memory.
// This makes it straightforward to upload to Cloud Storage.
// [START multer]
const Multer = require('multer');
const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // no larger than 10mb
    fieldSize: 25 * 1024 * 1024 
  }
});

// Custom file upload middleware
const uploadModeloImages = (req, res, next) => {
  // Use multer upload instance
  multer.array('imagenesfiles', 40)(req, res, (err) => {
    if (err) {
      console.log(err)
      return res.status(400).json({ error: err.message });
    }

    // Retrieve uploaded files
    const files = req.files;
    const errors = [];

    const data = req.body;
    
    // Validate file types and sizes
    files.forEach((file) => {
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
      // Remove uploaded files
      /* files.forEach((file) => {
        fs.unlinkSync(file.path, (err) => {
          if (err) {
              throw err;
          }
          console.log("Delete File successfully.");
        });
      }); */
      const respuestaError = {
        codigo:0, 
        Mensaje:`Error al intentar crear la imagen`,
        Error:errors
      }
      return res.status(400).json(respuestaError);
    }

    // Attach files to the request object
    req.files = files;

    // Proceed to the next middleware or route handler
    next();
  });
};

// [END multer]

// Create the storage client
// The Storage(...) factory function accepts an options
// object which is used to specify which project's Cloud
// Storage buckets should be used via the projectId
// property.
// The projectId is retrieved from the config module.
// This module retrieves the project ID from the
// GCLOUD_PROJECT environment variable.
const storage = new Storage({
  projectId: config.get('GCLOUD_PROJECT')
});

// Get the GCLOUD_BUCKET environment variable
// Recall that earlier you exported the bucket name into an
// environment variable.
// The config module provides access to this environment
// variable so you can use it in code
const GCLOUD_BUCKET = config.get('GCLOUD_MOD_ASOC_BUCKET');

// Get a reference to the Cloud Storage bucket
const bucket = storage.bucket(GCLOUD_BUCKET);

// Express middleware that will automatically pass uploads to Cloud Storage.
// req.file is processed and will have a new property:
// * ``cloudStoragePublicUrl`` the public url to the object.
// [START sendUploadToGCS]
const sendModeloUploadToGCSAsync = async (req, res, next) => {
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
  
    const bodyObj = req.body.data;
    const parsedbodyObj = JSON.parse(bodyObj);
    const { ordenImagen } = parsedbodyObj;

    files.forEach(async (file) => {

      // Agregando Nombre Unico segun la fecha
      const nombreUnicoFecha = Date.now()+"_" + file.originalname;
      const esJpeg = file.originalname.includes("jpeg")
      var uniqueDateName = undefined;
      if(esJpeg){
        uniqueDateName = nombreUnicoFecha.slice(0, nombreUnicoFecha.length - 5);
      }
      else{

        uniqueDateName = nombreUnicoFecha.slice(0, nombreUnicoFecha.length - 4);
      }

      const resizeNameThumbnail = `Thumbnail_WebP_${uniqueDateName}.webp`;
      const resizeNameGde = `Detalles_Img_Gde_${uniqueDateName}.webp`;
      const resizeNameChico = `Detalles_Img_Chica_${uniqueDateName}.webp`;

      // Agregro al file los nombres segun tamaño
      file.uniqueDateName = uniqueDateName;
      file.resizeNameGde = `https://storage.googleapis.com/${GCLOUD_BUCKET}/${resizeNameGde}`;
      file.resizeNameThumbnail = `https://storage.googleapis.com/${GCLOUD_BUCKET}/${resizeNameThumbnail}`;
      file.resizeNameChico = `https://storage.googleapis.com/${GCLOUD_BUCKET}/${resizeNameChico}`;
      
      // Deben agregarse los nombres al file antes del cambio de tamaño, pq de lo contrario no lo agrega
      const thumbnail = await imgCambioTamaño(file, 393, 388, resizeNameThumbnail);
      const uploadThumbnail = await uploadFile(thumbnail);

      const imgGde = await imgCambioTamaño(file, 704, 504, resizeNameGde);      
      const uploadBig = await uploadFile(imgGde);
      
      const ordenData = ordenImagen.filter((imagen)=>imagen.img_name === file.originalname);

      // Si estan ordenadas al principio se cambia el tamaño a Chico
      if( ordenData.length>0 && ordenData[0].orden === 1 || 
          ordenData.length>0 && ordenData[0].orden === 2 || 
          ordenData.length>0 && ordenData[0].orden === 3)
        {
            const imagenChica = await imgCambioTamaño(file, 428, 242, resizeNameChico);
            const uploadImgDetChica = await uploadFile(imagenChica);
        }

    })

    req.files = files;
    next();

  } catch (e) {
    console.log("Error " + e)
    res.send(e)
  }
}

async function imgCambioTamaño (archivo, width, height, nuevoNombre){
    
  const img_a_cambiar = {
      fieldname: archivo.fieldname,
      originalname: nuevoNombre,
      encoding: archivo.encoding,
      mimetype: archivo.mimetype,
      buffer: await sharp(archivo.buffer)
          .resize({
              width,
              height,
              fit:'fill'
          })
          .toFormat('webp')
          .webp({ quality: 100 })
          .toBuffer()
  }
  return img_a_cambiar;
}

const uploadFile = async (file) => new Promise((resolve, reject) => {
  const fileName = file.originalname;
  const fileUpload = bucket.file(fileName);

  const uploadStream = fileUpload.createWriteStream({
      resumable: false,
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
          name: fileName
      });
      await fileUpload.setMetadata({ 
          contentType: "webp",
          mimetype: "webp"
      });
  });

  uploadStream.end(file.buffer);
  
})


module.exports = {
  multer,
  uploadModeloImages,
  sendModeloUploadToGCSAsync
};