const fs = require("fs");
const {  ImgPropiedad, Propiedad, TipodePropiedad, AmenidadesDesarrollo, AmenidadesPropiedad, 
  TipoOperacion, Estado , Municipio, Ciudad, AmenidadesDesarrolloPropiedad, AmenidadesPropiedadAmenidad, ModeloRelacionadoPropiedad } = require("../db");

const path = require('path');
const carpeta = path.join(__dirname, '../../uploads')
console.log("DIRECTORIO" + carpeta)

const uploadImagenPropiedad = async (req, res, next) => {
  console.log("upload Imagen Propiedad")
    try {
      // Se obtienen los datos de la form que estan en un objeto FormData y se pasan a JSON
      const bodyObj = req.body.data;
      //console.log("Body OBJ -> " +bodyObj);
      const parsedbodyObj = JSON.parse(bodyObj);
      const { nombreModelo, nombreDesarrollo, precio, recamaras, baños, medio_baño, espaciosCochera, cocheraTechada,
        tipodePropiedad, tipodeOperacion, m2Construccion, m2Terreno, m2Total, añodeConstruccion, 
        amenidadesPropiedad,amenidadesDesarrollo, calle, numeroPropiedad, numeroInterior, colonia, 
        estado, municipio,ciudad, posicion,} = parsedbodyObj   

      console.log("Upload Multiple Img Controller Property -> " + nombreDesarrollo);

      const ModeloRelacionadoCreado = await ModeloRelacionadoPropiedad.create({
        defaults:{
          nombreModelo,
          precio,
          recamaras, 
          baños,
          medio_baño,
          espaciosCochera,
          cocheraTechada,
          TipodePropiedadId:tipodePropiedad,
          TipoOperacionId:tipodeOperacion,
          m2Construccion,
          m2Terreno,
          m2Total,
          añodeConstruccion,
          calle,
          numeroPropiedad,
          numeroInterior,
          ColoniumId:colonia,
          EstadoId:estado,
          MunicipioId: municipio,
          CiudadId:ciudad,
          posicion,
          PropiedadId:nombreDesarrollo
        }
      });
      
      /* for (let i = 0; i < amenidadesDesarrollo.length; i++) {        
        await AmenidadesDesarrolloPropiedad.create({ PropiedadId:ModeloRelacionadoCreado[0].id, AmenidadesDesarrolloId:amenidadesDesarrollo[i] })
      }

      for (let i = 0; i < amenidadesPropiedad.length; i++) {        
        await AmenidadesPropiedadAmenidad.create({ PropiedadId:ModeloRelacionadoCreado[0].id, AmenidadesPropiedadId:amenidadesPropiedad[i] })
      } */
      
      
      // buscamos si hay fotos
      const files = req.files;

      if (files === undefined) {
        console.log("Selecciona una imagen para tu propiedad")
        //return res.send(`Selecciona una imagen para tu propiedad`);
      }
      console.log("Files en creacion de Instancia " + JSON.stringify(files))
      // se crea una imagen por cada archivo y se liga a la Propiedad
      files.forEach(async (file) => {
        console.log("Image File " + JSON.stringify(file))
        console.log("CloudStoragePublicUrl Image File " + JSON.stringify(file.cloudStoragePublicUrl))
          const imagenPropiedad = await ImgPropiedad.create({
            type: file.mimetype,
            img_name: file.cloudStoragePublicUrl,
            PropiedadId: ModeloRelacionadoCreado[0].id
          });
      })

      //res.json(`Se creo la Propiedad `+ ModeloRelacionadoCreado[0].nombrePropiedad +  " y sus imagenes " );
      console.log("Se Creo la Propiedad");
      res.send("Se Creo la propiedad")
    } catch (error) {
      console.log("Error en Upload Multiple Img "+error);
      //res.json(`Error al intentar crear la imagen de la propiedad: ${error}`);
    }
  };

  module.exports = {
    uploadImagenPropiedad
  };