// https://cloud.google.com/storage/docs/samples/storage-delete-file?hl=es-419

// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');
import { Buffer } from 'node:buffer';

const fs = require("fs");
const {  ImgModeloAsociado, ModeloAsociadoPropiedad, AmenidadesModeloAmenidad, Propiedad } = require("../db");
/* 
    Buscar Modelo con FindOrCreate
    Agregar datos como # de Niveles
*/
// Creates a client
const storage = new Storage();

const config = require('../../configCloudBucket');
// variable so you can use it in code
const GCLOUD_BUCKET_NAME = config.get('GCLOUD_MOD_ASOC_BUCKET');

// Get a reference to the Cloud Storage bucket
const storageBucket = storage.bucket(GCLOUD_BUCKET_NAME);


const path = require('path');
//const carpeta = path.join(__dirname, '../../uploads')
//console.log("DIRECTORIO" + carpeta)

const gcpEditarImagenModelo = async (req, res, next) => {
  console.log("upload Imagen Modelo to GCP")
  
    try {
      // Se obtienen los datos de la form que estan en un objeto FormData y se pasan a JSON
      const bodyObj = req.body.data;
      //console.log("Body OBJ -> " +bodyObj);
      const parsedbodyObj = JSON.parse(bodyObj);
      const {modeloId, desarrolloId, nombreModelo, precio, ciudad, estado, posicion, niveles, recamaras,
        baños, medio_baño, espaciosCochera, cocheraTechada, m2Construccion, m2Terreno, m2Total, 
        amenidadesPropiedad, ordenImagen } = parsedbodyObj   

      console.log("Editar Modelo GCP -> " + nombreModelo);

      const ModeloBuscado = await ModeloAsociadoPropiedad.findByPk(modeloId);
      // buscar con findorCreate por modeloId y nombreModelo para evitar que se 
      // repita el nombre del Modelo
      ModeloBuscado.PropiedadId = parseInt(desarrolloId);
      ModeloBuscado.nombreModelo = nombreModelo;
      ModeloBuscado.precio = precio;
      ModeloBuscado.CiudadId = ciudad;
      ModeloBuscado.EstadoId = estado;
      ModeloBuscado.posicion = posicion;
      ModeloBuscado.niveles= niveles;
      ModeloBuscado.recamaras = recamaras;
      ModeloBuscado.baños = baños;
      ModeloBuscado.medio_baño = medio_baño
      ModeloBuscado.espaciosCochera = espaciosCochera;
      ModeloBuscado.cocheraTechada = cocheraTechada;
      ModeloBuscado.m2Construccion = m2Construccion;
      ModeloBuscado.m2Terreno  = m2Terreno;
      ModeloBuscado.m2Total = m2Total;

      ModeloBuscado.save();

      for (let i = 0; i < amenidadesPropiedad.length; i++) {        
        await  AmenidadesModeloAmenidad.findOrCreate({ 
          where:{
            ModeloAsociadoPropiedadId:modeloId, 
            AmenidadesPropiedadId:amenidadesPropiedad[i] 
          }
        })
      }      
      
      // buscamos si hay fotos
      const files = req.files;

      for (let i = 0; i < ordenImagen.length; i++) {
        if(ordenImagen[i].editar===1){ // 1 = editar
          const imagenModelo = await ImgModeloAsociado.findByPk(ordenImagen[i].id);
          console.log("Orden Id "+ordenImagen[i].id +  " Editar "+ ordenImagen[i].editar+  " Orden Editado " +JSON.stringify(imagenModelo))
          imagenModelo.orden= ordenImagen[i].orden
          await imagenModelo.save();
        }
        else if (ordenImagen[i].editar===2){ // 2 = borrar

          const imagenModelo = await ImgModeloAsociado.findByPk(ordenImagen[i].id);
          
          async function deleteFile(fileName) {
            const archivoABorrar = await storageBucket.file(fileName).delete();
            console.log(`Se Borro el ` + JSON.stringify(archivoABorrar));
          }

          const getNombre = (Nombre, caracteres) =>{
            //Borrando el sufijo de "https://storage.googleapis.com/dadinumco-media/"  ->  47 caracteres 47-7
            //https://storage.googleapis.com/dadinumco_mod_asociado/   ->  54 caracteres
            const NombreExtraido = Nombre.slice(caracteres, Nombre.length);
            return NombreExtraido;
          }
          const ThumbnailImgNombre = getNombre(imagenModelo.thumbnail_img, 54)
          const ImgGdeNombre = getNombre(imagenModelo.detalles_imgGde, 54);

          deleteFile(ThumbnailImgNombre).catch(console.error);
          deleteFile(ImgGdeNombre).catch(console.error);
          if(imagenModelo.detalles_imgChica !== null){
            const ImgChicaNombre = getNombre(imagenModelo.detalles_imgChica, 54);
            deleteFile(ImgChicaNombre).catch(console.error);
          }
          
          // Borrar datos de la imagen de la propiedad
          await imagenModelo.destroy();
        }
      }


      //  ---- Si se cargaron imagenes nuevas

      const crearDatosdeImagenModelo = async (file, ModeloId)=>{
        const nombreOriginal = Buffer.from(file.originalname, 'ascii').toString('utf8');
        const ordenData = ordenImagen.filter((imagen)=>imagen.img_name === nombreOriginal);

        console.log("Image File " + JSON.stringify(file))
        console.log("Resize Image File " + JSON.stringify(file.originalname))

        const imagenModelo = await ImgModeloAsociado.create({
          orden:ordenData[0].orden,
          type: file.mimetype,
          img_name: file.uniqueDateName,
          thumbnail_img:file.resizeNameThumbnail,
          detalles_imgGde:file.resizeNameGde,
          ModeloAsociadoPropiedadId: ModeloId
        });
        if(ordenData[0].orden === 1 || ordenData[0].orden === 2 || ordenData[0].orden === 3){
          imagenModelo.detalles_imgChica=file.resizeNameChico;
          imagenModelo.save();
        }
      }

      // Si hay imagenes nuevas cargadas
      if(files.length>0) {
        // se crea una imagen por cada archivo  y se liga a la Propiedad
        files.forEach(async (file) => {
          crearDatosdeImagenModelo(file, ModeloBuscado.id );
        })
      }
      else console.log("No hay imagenes nuevas a cargar");
      
      console.log(`Se Edito el Modelo `+ ModeloBuscado.nombreModelo +  " y sus imagenes ");
      const modeloCreadoJSON = { codigo:1, Mensaje:`Se edito el modelo `+ ModeloBuscado.nombreModelo} ;
      res.json(modeloCreadoJSON? modeloCreadoJSON :{mensaje:"No Se pudo crear la propieda"} );
    } catch (error) {
      console.log("Error al editar la propiedad en GCP "+ error);
      res.json({
        codigo:0, 
        Mensaje:`Error al intentar crear la imagen del Modelo`,
        Error:error
      });
    }
  };

  module.exports = {
    gcpEditarImagenModelo
  };