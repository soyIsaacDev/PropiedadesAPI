
const {  ImgModeloAsociado, ModeloAsociadoPropiedad, AmenidadesModeloAmenidad } = require("../db");
const ciudad = require("../models/ciudad");

const uploadImagenModeloAsociadoPropiedad = async (req, res) => {
    try {
      const bodyObj = req.body.data;
      const parsedbodyObj = JSON.parse(bodyObj)
      const { nombreModelo, nombreDesarrollo, ciudad, precio, recamaras,
        baños, medio_baño, espaciosCochera, cocheraTechada, tipodePropiedad,
        tipodeOperacion, m2Construccion, m2Terreno, m2Total, amenidadesPropiedad, 
        numeroCasa, numeroInterior, municipio, estado, posicion,
      } = parsedbodyObj

      console.log("Nombre del Modelo " + nombreModelo)
      
      const modelo = await ModeloAsociadoPropiedad.findOrCreate({
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
          numeroCasa,
          numeroInterior,
          posicion,          
        }
         
      })

      const files = req.files;

      if (files === undefined) {
        console.log("Selecciona una imagen para tu propiedad")
        return res.send(`Selecciona una imagen para tu propiedad`);
      }
      console.log("Files en creacion de Instancia " + JSON.stringify(files))

      // se crea una imagen por cada archivo y se liga a la Propiedad
      files.forEach(async (file) => {
        console.log("Image File " + JSON.stringify(file))
        console.log("Modelo Asociado " + modelo[0].id);
          
          const imagenModeloAsociado = await ImgModeloAsociado.create({
            type: file.mimetype,
            img_name: file.filename,
            ModeloAsociadoPropiedadId: modelo[0].id
          });
          console.log("Imagen propiedad "+imagenModeloAsociado);
      })
      
      for (let i = 0; i < amenidadesPropiedad.length; i++) {        
        await AmenidadesModeloAmenidad.create({ 
          ModeloAsociadoPropiedadId:modelo[0].id, 
          AmenidadesPropiedadId:amenidadesPropiedad[i] 
        })
      }

      console.log("Se Creo el Modelo")
      res.json(`Se Creo el Modelo` );
      
    } catch (error) {
      console.log("Error " + error);
      return res.send(`Error al intentar crear la imagen de la propiedad: ${error}`);
    }
  };

  module.exports = {
    uploadImagenModeloAsociadoPropiedad
  };