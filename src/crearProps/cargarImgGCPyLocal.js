'use strict';
const sharp = require('sharp');
const config = require('../../configCloudBucket');
const path = require('path');
const fs = require('fs');
const carpeta = path.join(__dirname, '../../uploads');

// Asegurarse de que el directorio de uploads exista
if (!fs.existsSync(carpeta)) {
  fs.mkdirSync(carpeta, { recursive: true });
}

// Variables para el almacenamiento
let storage = null;
let modeloBucket = null;
let desarrolloBucket = null;

// Configurar Google Cloud Storage solo en producción
if (process.env.NODE_ENV === 'production') {
  const { Storage } = require('@google-cloud/storage');
  
  // Verificar que las variables de configuración estén presentes
  if (!config.nconf.get('GCLOUD_PROJECT') || !config.nconf.get('GCLOUD_MOD_ASOC_BUCKET') || !config.nconf.get('GCLOUD_BUCKET')) {
    throw new Error('Las variables de configuración de Google Cloud Storage son requeridas en producción');
  }

  // Configurar el cliente de almacenamiento
  storage = new Storage({
    projectId: config.nconf.get('GCLOUD_PROJECT')
  });
  
  // Configurar los buckets
  modeloBucket = storage.bucket(config.nconf.get('GCLOUD_MOD_ASOC_BUCKET'));
  desarrolloBucket = storage.bucket(config.nconf.get('GCLOUD_BUCKET'));

  console.log('Configuración de Google Cloud Storage inicializada en modo producción');
} else {
  console.log('Modo desarrollo: Usando almacenamiento local en', carpeta);
}

const DEVMODE = process.env.DEVELOPMENT;

const cargarImagenGCPyLocal = async (req, res, next) => {
  try {
    // Se obtienen los datos de la form que estan en un objeto FormData y se pasan a JSON
    const bodyObj = req.body.data;
    const parsedbodyObj = JSON.parse(bodyObj);
    const { ordenImagen, tipodeDesarrollo } = parsedbodyObj;
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

      const imagenChica = await imgCambioTamaño(file, 428, 242, `Detalles_Img_Chica_${uniqueDateName}.webp`);
      const uploadImgDetChica = await uploadFile(imagenChica, tipodeDesarrollo);
    }
    else {
      // Cambia el tamaño y lo guarda en local
      //resizeImage(img_name, width, height, output_name)
      resizeImage(file.filename, uniqueDateName, 393, 388, "Thumbnail_WebP_" );
      resizeImage(file.filename, uniqueDateName, 704, 504, "Detalles_Img_Gde_" );
      resizeImage(file.filename, uniqueDateName, 428, 242, "Detalles_Img_Chica_");
    }

    const ordenData = ordenImagen.filter((imagen)=>imagen.img_name === file.originalname);

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