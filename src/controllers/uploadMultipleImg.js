const fs = require("fs");
const {  ImgPropiedad, Propiedad, TipodePropiedad, AmenidadesDesarrollo, AmenidadesPropiedad, 
  TipoOperacion, Estado , Municipio, Ciudad, AmenidadesDesarrolloPropiedad, AmenidadesPropiedadAmenidad } = require("../db");

const path = require('path');
const carpeta = path.join(__dirname, '../../uploads')
console.log("DIRECTORIO" + carpeta)

const uploadImagenPropiedad = async (req, res) => {
  console.log("upload Imagen Propiedad")
    try {
      // Se obtienen los datos de la form que estan en un objeto FormData y se pasan a JSON
      const bodyObj = req.body.data;
      //console.log("Body OBJ -> " +bodyObj);
      const parsedbodyObj = JSON.parse(bodyObj);
      const { nombreDesarrollo, precio, recamaras, baños, medio_baño, espaciosCochera, cocheraTechada,
        tipodePropiedad, tipodeOperacion, m2Construccion, m2Terreno, m2Total, añodeConstruccion, 
        amenidadesPropiedad,amenidadesDesarrollo, calle, numeroPropiedad, numeroInterior, colonia, 
        estado, municipio,ciudad, posicion} = parsedbodyObj   

      console.log("Upload Multiple Img Controller Property -> " + nombreDesarrollo);

      const PropiedadCreada = await Propiedad.findOrCreate({
        where:{ nombreDesarrollo },
        defaults:{
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
          posicion
        }
      });

      for (let i = 0; i < amenidadesDesarrollo.length; i++) {        
        await AmenidadesDesarrolloPropiedad.create({ PropiedadId:PropiedadCreada[0].id, AmenidadesDesarrolloId:amenidadesDesarrollo[i] })
      }

      for (let i = 0; i < amenidadesPropiedad.length; i++) {        
        await AmenidadesPropiedadAmenidad.create({ PropiedadId:PropiedadCreada[0].id, AmenidadesPropiedadId:amenidadesPropiedad[i] })
      }
      
      
      // buscamos si hay fotos
      const files = req.files;

      if (files == undefined) {
        return res.send(`Selecciona una imagen para tu propiedad`);
      }
      
      // se crea una imagen por cada archivo y se liga a la Propiedad
      files.forEach(async (file) => {
          const imagenPropiedad = await ImgPropiedad.create({
            type: file.mimetype,
            img_name: file.filename,
            PropiedadId: PropiedadCreada[0].id
          });
      })

      //res.json(`Se creo la Propiedad `+ PropiedadCreada[0].nombrePropiedad +  " y sus imagenes " );
      res.json(`Se creo la Propiedad` );
    } catch (error) {
      console.log(error);
      return res.send(`Error al intentar crear la imagen de la propiedad: ${error}`);
    }
  };

  module.exports = {
    uploadImagenPropiedad
  };