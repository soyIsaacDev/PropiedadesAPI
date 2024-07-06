'use strict';
const config = require('../../configCloudBucket');
const sharp = require('sharp');
// https://www.cloudskillsboost.google/focuses/19196?parent=catalog
// https://www.npmjs.com/package/@google-cloud/storage

// Load the module for Cloud Storage
const {Storage} = require('@google-cloud/storage');

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
const GCLOUD_BUCKET = config.get('GCLOUD_BUCKET');

// Get a reference to the Cloud Storage bucket
const bucket = storage.bucket(GCLOUD_BUCKET);

// Express middleware that will automatically pass uploads to Cloud Storage.
// req.file is processed and will have a new property:
// * ``cloudStoragePublicUrl`` the public url to the object.
// [START sendUploadToGCS]
const sendUploadToGCSAsync = async (req, res, next) => {
  try {
    console.log("Send Upload To GCS")
    // buscamos si hay fotos
    const files = req.files;
    for (let i = 0; i < files.length; i++) {
      console.log("req.file en SUTGCS " + JSON.stringify(files[i].originalname))
    }
    if (files == undefined) {
      console.log("req.file Undefined")
      return next()
    }
    if (!files) {
      console.log("No hay archivos a subir")
      return next();
    }

    /* const filename =  Date.now() + '-' + file.originalname;
    } */


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

      // Agregro el nombre con sello unico de fecha tomandolo de thumbnail
      file.uniqueDateName = uniqueDateName;
      
      const thumbnail = await imgCambioTamaño(file, 298, 240, uniqueDateName, "Thumbnail_WebP_");
      file.resizeNameThumbnail = `https://storage.googleapis.com/${GCLOUD_BUCKET}/${thumbnail.originalname}`;
      const uploadThumbnail = await uploadFile(thumbnail);

      const imgGde = await imgCambioTamaño(file, 704, 504, uniqueDateName, "Detalles_Img_Gde_");
      file.resizeNameGde = `https://storage.googleapis.com/${GCLOUD_BUCKET}/${imgGde.originalname}`;
      const uploadBig = await uploadFile(imgGde);
      
      

      const ordenData = ordenImagen.filter((imagen)=>imagen.img_name === file.originalname);

      // Si estan ordenadas al principio se cambia el tamaño a Chico
      if( ordenData.length>0 && ordenData[0].orden === 1 || 
          ordenData.length>0 && ordenData[0].orden === 2 || 
          ordenData.length>0 && ordenData[0].orden === 3)
          {
            const imagenChica = await imgCambioTamaño(file, 428, 242, uniqueDateName, "Detalles_Img_Chica_");
            file.resizeNameChico = `https://storage.googleapis.com/${GCLOUD_BUCKET}/${imagenChica.originalname}`;
            const uploadImgDetChica = await uploadFile(imagenChica);
          }
    })

    req.files = files
    console.log("File despues de Resize  = " + JSON.stringify(files))
    next();
    
  } catch (e) {
    console.log("Error " + e)
    res.send(e)
  }
}


async function imgCambioTamaño (archivo, width, height, uniqueDateName, nuevoNombre){
  const fileName = `${nuevoNombre+uniqueDateName}.webp`;
  
  const img_a_cambiar = {
      fieldname: archivo.fieldname,
      originalname: fileName,
      encoding: archivo.encoding,
      mimetype: archivo.mimetype,
      buffer: await sharp(archivo.buffer)
          .resize({
              width,
              height
          })
          .toFormat('webp')
          .webp({ quality: 50 })
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
      console.log("Upload success");
  });

  uploadStream.end(file.buffer);
})


module.exports = {
  sendUploadToGCSAsync
};