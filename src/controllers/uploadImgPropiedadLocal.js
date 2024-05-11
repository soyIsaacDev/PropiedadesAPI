const fs = require("fs");
const {  ImgPropiedad, Propiedad, AmenidadesDesarrolloPropiedad } = require("../db");

const path = require('path');
const carpeta = path.join(__dirname, '../../uploads')
console.log("DIRECTORIO" + carpeta)

const uploadImagenPropiedad = async (req, res, next) => {
  console.log("upload Imagen Propiedad" )
    try {
      // Se obtienen los datos de la form que estan en un objeto FormData y se pasan a JSON
      const bodyObj = req.body.data;
      //console.log("Body OBJ -> " +bodyObj);
      const parsedbodyObj = JSON.parse(bodyObj);
      const { nombreDesarrollo, añodeConstruccion, amenidadesDesarrollo, 
        calle, numeroPropiedad, numeroInterior, colonia, estado, municipio,ciudad, posicion} = parsedbodyObj   

      console.log("Upload Multiple Img Controller Property -> " + nombreDesarrollo);

      const PropiedadCreada = await Propiedad.findOrCreate({
        where:{ 
          nombreDesarrollo,
          EstadoId:estado,
          MunicipioId: municipio,
          CiudadId:ciudad,
        },
        defaults:{
          añodeConstruccion,
          calle,
          numeroPropiedad,
          numeroInterior,
          ColoniumId:colonia,
          posicion
        }
      });

      for (let i = 0; i < amenidadesDesarrollo.length; i++) {        
        await AmenidadesDesarrolloPropiedad.create({ PropiedadId:PropiedadCreada[0].id, AmenidadesDesarrolloId:amenidadesDesarrollo[i] })
      }
      
      // buscamos si hay fotos
      const files = req.files;

      if (files === undefined) {
        console.log("Selecciona una imagen para tu propiedad")
        //return res.send(`Selecciona una imagen para tu propiedad`);
      }
      console.log("Files en creacion de Instancia " + JSON.stringify(files))
      // se crea una imagen por cada archivo y se liga a la Propiedad
      files.forEach(async (file) => {
        console.log("Image File " + JSON.stringify(file));
          /* const imagenPropiedad = await ImgPropiedad.create({
            type: file.mimetype,
            img_name: file.filename,
            PropiedadId: PropiedadCreada[0].id
          }); */
          const nombre_imagen = file.filename.slice(0, file.filename.length - 4);
          const imagenPropiedad = await ImgPropiedad.create({
            type: file.mimetype,
            img_name: file.filename,
            thumbnail_img:"Thumbnail_WebP_"+nombre_imagen+".webp",
            details_big_img:"Details_Big_Img_"+nombre_imagen+".webp",
            details_small_img:"Details_Small_Img_"+nombre_imagen+".webp",
            PropiedadId: PropiedadCreada[0].id
          });
      })

      //res.json(`Se creo la Propiedad `+ PropiedadCreada[0].nombrePropiedad +  " y sus imagenes " );
      console.log("Se Creo la Propiedad");
      const propCreadaJSON = {
        Confirmacion:`Se creo la Propiedad `+ PropiedadCreada[0].nombreDesarrollo
      }
      res.json(propCreadaJSON? propCreadaJSON :{mensaje:"No Se pudo crear la propieda"} );
    } catch (error) {
      console.log("Error en Upload Multiple Img "+error);
      //res.json(`Error al intentar crear la imagen de la propiedad: ${error}`);
    }
  };

  module.exports = {
    uploadImagenPropiedad
  };