const fs = require("fs");
const {  ImgModeloAsociado, AmenidadesPropiedadAmenidad, ModeloAsociadoPropiedad } = require("../db");

const path = require('path');
const carpeta = path.join(__dirname, '../../uploads')
console.log("DIRECTORIO" + carpeta)

const uploadImagenPropiedad = async (req, res, next) => {
  console.log("upload Imagen ModeloAsociado")
    try {
      // Se obtienen los datos de la form que estan en un objeto FormData y se pasan a JSON
      const bodyObj = req.body.data;
      //console.log("Body OBJ -> " +bodyObj);
      const parsedbodyObj = JSON.parse(bodyObj);
      const { nombreModelo, nombreDesarrollo, ciudad, precio, recamaras,
        baños, medio_baño, espaciosCochera, cocheraTechada, tipodePropiedad,
        tipodeOperacion, m2Construccion, m2Terreno, m2Total, amenidadesPropiedad, 
        estado,
      } = parsedbodyObj

      console.log("Upload Multiple Img Controller Property -> " + nombreModelo);

      const ModeloRelacionadoCreado = await ModeloAsociadoPropiedad.findOrCreate({
        where: {
          nombreModelo,
          PropiedadId:parseInt(nombreDesarrollo),
          CiudadId:ciudad,
          EstadoId:estado,
        },
        defaults: {
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
          amenidadesPropiedad,        
        }  
      });
      

      for (let i = 0; i < amenidadesPropiedad.length; i++) {        
        await AmenidadesPropiedadAmenidad.create({ 
          ModeloAsociadoPropiedadId:ModeloRelacionadoCreado[0].id, 
          AmenidadesPropiedadId:amenidadesPropiedad[i] })
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
        console.log("Image File " + JSON.stringify(file))
        console.log("CloudStoragePublicUrl Image File " + JSON.stringify(file.cloudStoragePublicUrl))
          const imagenPropiedad = await ImgModeloAsociado.create({
            type: file.mimetype,
            img_name: file.cloudStoragePublicUrl,
            ModeloAsociadoPropiedadId: ModeloRelacionadoCreado[0].id
          });
      })

      //res.json(`Se creo la Propiedad `+ ModeloRelacionadoCreado[0].nombrePropiedad +  " y sus imagenes " );
      console.log("Se Creo el Modelo");
      res.send("Se Creo el Modelo")
    } catch (error) {
      console.log("Error en Upload Multiple Img "+error);
      //res.json(`Error al intentar crear la imagen de la propiedad: ${error}`);
    }
  };

  module.exports = {
    uploadImagenPropiedad
  };