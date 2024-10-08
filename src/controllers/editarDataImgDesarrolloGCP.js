// https://cloud.google.com/storage/docs/samples/storage-delete-file?hl=es-419

// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');
const { Buffer } = require('node:buffer');

const fs = require("fs");
const {  ImgPropiedad, Propiedad, AmenidadesDesarrolloPropiedad } = require("../db");

// Creates a client
const storage = new Storage();

const config = require('../../configCloudBucket');
// variable so you can use it in code
const GCLOUD_BUCKET_NAME = config.get('GCLOUD_BUCKET');

// Get a reference to the Cloud Storage bucket
const storageBucket = storage.bucket(GCLOUD_BUCKET_NAME);


const path = require('path');
//const carpeta = path.join(__dirname, '../../uploads')
//console.log("DIRECTORIO" + carpeta)

const gcpEditarImagenDesarrollo = async (req, res, next) => {
  console.log("upload Imagen Propiedad to GCP")
  
    try {
      // Se obtienen los datos de la form que estan en un objeto FormData y se pasan a JSON
      const bodyObj = req.body.data;
      //console.log("Body OBJ -> " +bodyObj);
      const parsedbodyObj = JSON.parse(bodyObj);
      const {id, nombreDesarrollo, añodeConstruccion, amenidadesDesarrollo, 
        calle, numeroPropiedad, numeroInterior, colonia, estado, municipio, ciudad, posicion,
        TipodePropiedadId, TipoOperacionId, EstiloArquitecturaId, ordenImagen, quitarAmenidadesDesarrollo} = parsedbodyObj   

      console.log("GCP Upload Multiple Img Controller Property -> " + nombreDesarrollo);

      const PropiedadBuscada = await Propiedad.findByPk(id);

      PropiedadBuscada.nombreDesarrollo = nombreDesarrollo;
      PropiedadBuscada.EstadoId = estado;
      PropiedadBuscada.MunicipioId = municipio;
      PropiedadBuscada.CiudadId = ciudad;
      PropiedadBuscada.TipodePropiedadId = TipodePropiedadId;
      PropiedadBuscada.TipoOperacionId = TipoOperacionId;
      PropiedadBuscada.EstiloArquitecturaId = EstiloArquitecturaId;
      PropiedadBuscada.añodeConstruccion = añodeConstruccion;
      PropiedadBuscada.calle = calle;
      PropiedadBuscada.numeroPropiedad = numeroPropiedad;
      PropiedadBuscada.numeroInterior = numeroInterior;
      PropiedadBuscada.ColoniumId = colonia;
      PropiedadBuscada.posicion = posicion;

      PropiedadBuscada.save();

      for (let i = 0; i < amenidadesDesarrollo.length; i++) {        
        await AmenidadesDesarrolloPropiedad.findOrCreate({ 
          where:{
            PropiedadId:id, 
            AmenidadesDesarrolloId:amenidadesDesarrollo[i] 
          }
        })
      }      
      // Borrando las amendidades que se quitaron
      for (let i = 0; i < quitarAmenidadesDesarrollo.length; i++) {        
        const amenidadaQuitar = await AmenidadesDesarrolloPropiedad.findOne({ 
          where:{
            PropiedadId:id,
            AmenidadesDesarrolloId:quitarAmenidadesDesarrollo[i] 
          }
        })
        amenidadaQuitar.destroy();
      }
      
      // buscamos si hay fotos
      const files = req.files;

      for (let i = 0; i < ordenImagen.length; i++) {
        if(ordenImagen[i].editar===1){ // 1 = editar
          const imagenPropiedad = await ImgPropiedad.findByPk(ordenImagen[i].id);
          console.log("Orden Id "+ordenImagen[i].id +  " Editar "+ ordenImagen[i].editar+  " Orden Editado " +JSON.stringify(imagenPropiedad))
          imagenPropiedad.orden= ordenImagen[i].orden
          await imagenPropiedad.save();
        }
        else if (ordenImagen[i].editar===2){ // 2 = borrar

          const imagenPropiedad = await ImgPropiedad.findByPk(ordenImagen[i].id);
          
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
          
          const ThumbnailImgNombre = getNombre(imagenPropiedad.thumbnail_img, 47)
          const ImgGdeNombre = getNombre(imagenPropiedad.detalles_imgGde, 47);

          //deleteFile(imagenPropiedad.img_name).catch(console.error);
          deleteFile(ThumbnailImgNombre).catch(console.error);
          deleteFile(ImgGdeNombre).catch(console.error);
          if(imagenPropiedad.detalles_imgChica !== null){
            const ImgChicaNombre = getNombre(imagenPropiedad.detalles_imgChica, 47);
            deleteFile(ImgChicaNombre).catch(console.error);
          }
          
          // Borrar datos de la imagen de la propiedad
          await imagenPropiedad.destroy();
        }
      }


      //  ---- Si se cargaron imagenes nuevas

      const crearDatosdeImagenProp = async (file, PropId)=>{
        // Considerando caracteres especiales
        const nombreOriginal = Buffer.from(file.originalname, 'ascii').toString('utf8');        
        const ordenData = ordenImagen.filter((imagen)=>imagen.img_name === nombreOriginal);

        console.log("Image File " + JSON.stringify(file))
        console.log("Resize Image File " + JSON.stringify(file.originalname))

        const imagenPropiedad = await ImgPropiedad.create({
          orden:ordenData[0].orden,
          type: file.mimetype,
          img_name: file.uniqueDateName,
          thumbnail_img:file.resizeNameThumbnail,
          detalles_imgGde:file.resizeNameGde,
          PropiedadId: PropId
        });
        if(ordenData[0].orden === 1 || ordenData[0].orden === 2 || ordenData[0].orden === 3){
          imagenPropiedad.detalles_imgChica=file.resizeNameChico;
          imagenPropiedad.save();
        }
      }

      // Si hay imagenes nuevas cargadas
      if(files.length>0) {
        // se crea una imagen por cada archivo  y se liga a la Propiedad
        files.forEach(async (file) => {
          crearDatosdeImagenProp(file, PropiedadBuscada.id );
        })
      }
      else console.log("No hay imagenes nuevas a cargar");
      
      console.log(`Se Edito el Desarrollo `+ PropiedadBuscada.nombreDesarrollo +  " y sus imagenes ");
      const propCreadaJSON = {
        codigo:1, 
        Confirmacion:`Se edito el Desarrollo`+ PropiedadBuscada.nombreDesarrollo
      }
      res.json(propCreadaJSON? propCreadaJSON :{mensaje:"No Se pudo crear la propieda"} );

    } catch (error) {
      console.log("Error al editar el Desarrollo en GCP "+ error);
      res.json({
        codigo:0, 
        Mensaje:`Error al intentar crear la imagen del Desarrollo`,
        Error:error
      });
    }
  };

  module.exports = {
    gcpEditarImagenDesarrollo
  };