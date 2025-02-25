'use strict';
const sharp = require('sharp');
const config = require('../../configCloudBucket');
// Load the module for Cloud Storage
const {Storage} = require('@google-cloud/storage');
const GCLOUD_BUCKET = config.get('GCLOUD_MOD_ASOC_BUCKET');
const { ImgModeloAsociado, ModeloAsociadoPropiedad } = require("../db");


const storage = new Storage({
  projectId: config.get('GCLOUD_PROJECT')
});
const bucket = storage.bucket(GCLOUD_BUCKET);

const cargarImagenGCP = async (req, res, next) => {
  try {
    console.log("Probando Send")
    // Se obtienen los datos de la form que estan en un objeto FormData y se pasan a JSON
    const bodyObj = req.body.data;
    const parsedbodyObj = JSON.parse(bodyObj);
    const { ordenImagen, modeloId, nombreModelo, nombreDesarrollo, ciudad, estado } = parsedbodyObj

    console.log("Modelo Id " + modeloId)
    // buscamos si hay fotos
    const file = req.files;
    if (file == undefined) {
      console.log("req.file Undefined")
      res.json({
        codigo:0, 
        Mensaje:`El archivo a subir esta Undefined`
      });
    }
    else if (!file) {
      console.log("No hay archivos a subir")
      res.json({
        codigo:0, 
        Mensaje:`No hay archivos a subir`
      });
    }

    /* const ModeloRelacionado = await ModeloAsociadoPropiedad.findOne({
      where: {
        nombreModelo,
        PropiedadId:parseInt(nombreDesarrollo),
        CiudadId:ciudad,
        EstadoId:estado,
      }
    }) */

    else{

      // Agregando Nombre Unico segun la fecha
      const nombreUnicoFecha = Date.now()+"_" + file[0].originalname;
      const esJpeg = file[0].originalname.includes("jpeg")
      var uniqueDateName = undefined;
      if(esJpeg){
        uniqueDateName = nombreUnicoFecha.slice(0, nombreUnicoFecha.length - 5);
      }
      else{
        uniqueDateName = nombreUnicoFecha.slice(0, nombreUnicoFecha.length - 4);
      }
  
      const thumbnail_img = await imgCambioTamaño(file[0], 393, 388, `Thumbnail_WebP_${uniqueDateName}.webp`);
      const uploadThumbnail = await uploadFile(thumbnail_img);
  
      const imgGde = await imgCambioTamaño(file[0], 704, 504, `Detalles_Img_Gde_${uniqueDateName}.webp`);      
      const uploadBig = await uploadFile(imgGde);
      
      const ordenData = ordenImagen.filter((imagen)=>imagen.img_name === file[0].originalname);
  
      // Si estan ordenadas al principio se cambia el tamaño a Chico
      if( ordenData.length>0 && ordenData[0].orden === 1 || 
          ordenData.length>0 && ordenData[0].orden === 2 || 
          ordenData.length>0 && ordenData[0].orden === 3)
      {
        const imagenChica = await imgCambioTamaño(file[0], 428, 242, `Detalles_Img_Chica_${uniqueDateName}.webp`);
        const uploadImgDetChica = await uploadFile(imagenChica);
      }
  
      req.data = {file, ordenData, GCLOUD_BUCKET, uniqueDateName};

      next();
    }
    
    // Agregro al file los nombres segun tamaño

    /* const imagenModeloAsociado = await ImgModeloAsociado.create({
      orden:ordenData[0].orden,
      type: file.mimetype,
      ModeloAsociadoPropiedadId: ModeloRelacionado.id,
      img_name: uniqueDateName,
      detalles_imgGde: `https://storage.googleapis.com/${GCLOUD_BUCKET}/Detalles_Img_Gde_${uniqueDateName}.webp`,
      thumbnail_img: `https://storage.googleapis.com/${GCLOUD_BUCKET}/Thumbnail_WebP_${uniqueDateName}.webp`,
      detalles_imgChica: `https://storage.googleapis.com/${GCLOUD_BUCKET}/Detalles_Img_Chica_${uniqueDateName}.webp`,
    });
 
    console.log(imagenModeloAsociado)
    console.log("Termino de Cargar la imagen") */
    
    

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

const uploadFile = async (file) => new Promise((resolve, reject) => {
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
  
})

module.exports = {
  cargarImagenGCP
};