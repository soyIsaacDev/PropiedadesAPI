'use strict';
const sharp = require('sharp');
const config = require('../../configCloudBucket');
// Load the module for Cloud Storage
const {Storage} = require('@google-cloud/storage');
// Get the GCLOUD_BUCKET environment variable
// Recall that earlier you exported the bucket name into an
// environment variable.
// The config module provides access to this environment
// variable so you can use it in code
const MOD_ASOC_BUCKET_GCLOUD_BUCKET = config.get('GCLOUD_MOD_ASOC_BUCKET');
const DESARROLLO_GCLOUD_BUCKET = config.get('GCLOUD_BUCKET');

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
// Get a reference to the Cloud Storage bucket
const modeloBucket = storage.bucket(MOD_ASOC_BUCKET_GCLOUD_BUCKET);
const desarrolloBucket = storage.bucket(DESARROLLO_GCLOUD_BUCKET);

const path = require('path')
const carpeta = path.join(__dirname, '../../uploads')

const DEVMODE = process.env.DEVELOPMENT;


const cargarImagenGCPyLocal = async (req, res, next) => {
  try {
    // Se obtienen los datos de la form que estan en un objeto FormData y se pasan a JSON
    const bodyObj = req.body.data;
    const parsedbodyObj = JSON.parse(bodyObj);
    const { ordenImagen, tipodeDesarrollo } = parsedbodyObj
    const file = req.files;

    // Agregando Nombre Unico segun la fecha
    const nombreUnicoFecha = Date.now()+"_" + file.originalname;
    const esJpeg = file.originalname.includes("jpeg")
    let uniqueDateName = undefined;
    if(esJpeg){
      uniqueDateName = nombreUnicoFecha.slice(0, nombreUnicoFecha.length - 5);
    }
    else{
      uniqueDateName = nombreUnicoFecha.slice(0, nombreUnicoFecha.length - 4);
    }

    if(DEVMODE === "Production" ){
      // Cambia el tamaño y lo sube a Google Cloud
      const thumbnail_img = await imgCambioTamaño(file, 393, 388, `Thumbnail_WebP_${uniqueDateName}.webp`);
      const uploadThumbnail = await uploadFile(thumbnail_img, tipodeDesarrollo);
  
      const imgGde = await imgCambioTamaño(file, 704, 504, `Detalles_Img_Gde_${uniqueDateName}.webp`);      
      const uploadBig = await uploadFile(imgGde, tipodeDesarrollo);
    }
    else {
      // Cambia el tamaño y lo guarda en local
      //resizeImage(img_name, width, height, output_name)
      resizeImage(file.filename, uniqueDateName, 393, 388, "Thumbnail_WebP_" );
      resizeImage(file.filename, uniqueDateName, 704, 504, "Detalles_Img_Gde_" );
    }

    const ordenData = ordenImagen.filter((imagen)=>imagen.img_name === file.originalname);

    // Si estan ordenadas al principio se cambia el tamaño a Chico
    if( ordenData.length>0 && ordenData[0].orden === 1 || 
        ordenData.length>0 && ordenData[0].orden === 2 || 
        ordenData.length>0 && ordenData[0].orden === 3)
    {
      if(DEVMODE === "Production" ){
        const imagenChica = await imgCambioTamaño(file, 428, 242, `Detalles_Img_Chica_${uniqueDateName}.webp`);
        const uploadImgDetChica = await uploadFile(imagenChica, tipodeDesarrollo);
      }
      else{
        resizeImage(file.filename, uniqueDateName, 428, 242, "Detalles_Img_Chica_");
      }

    }

    req.data = {file, ordenData, MOD_ASOC_BUCKET_GCLOUD_BUCKET, DESARROLLO_GCLOUD_BUCKET, uniqueDateName};
    next();
    
  } catch (e) {
    console.log("Error " + e)
    res.send(e)
  }
}

// Funciones 

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

const uploadFile = async (file, tipodeDesarrollo) => new Promise((resolve, reject) => {
 let fileUpload = "";
 
 if(tipodeDesarrollo=== "Desarrollo"){
  fileUpload = desarrolloBucket.file(file.originalname);
 }
 else{
  fileUpload = modeloBucket.file(file.originalname);
 }

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
  
})

async function resizeImage(filename, img_name, width, height, output_name) {
  try {
    await sharp(carpeta+"/"+filename)
      .resize({
        width,
        height,
        fit:'fill'
      })
      .toFormat('webp')
      .webp({ quality: 100 })
      .toFile(carpeta+"/"+output_name+img_name+'.webp');
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  cargarImagenGCPyLocal
};