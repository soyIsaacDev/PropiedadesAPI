const fs = require("fs");
const {  ImgPropiedad, Propiedad  } = require("../db");

const path = require('path');
const carpeta = path.join(__dirname, '../../uploads')
console.log("DIRECTORIO" + carpeta)

const uploadImagenPropiedad = async (req, res) => {
    try {
      // Se obtienen los datos de la form que estan en un objeto FormDatay se pasan a JSON
      const bodyObj = req.body.data;
      const parsedbodyObj = JSON.parse(bodyObj)
      const { nombrePropiedad, precio, recamaras, baños, calle, 
        colonia, numeroCasa, numeroInterior} = parsedbodyObj
      
      const PropiedadCreada = await Propiedad.findOrCreate({
        where:{ nombrePropiedad },
        defaults:{
            precio,
            recamaras, 
            baños, 
            calle,
            colonia,
            numeroCasa,
            numeroInterior
        }
         
    });
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

      res.json(`Se creo la Proepiedad `+ PropiedadCreada.nombrePropiedad +  " y sus imagenes " );
      
    } catch (error) {
      console.log(error);
      return res.send(`Error al intentar crear la imagen de la propiedad: ${error}`);
    }
  };

  module.exports = {
    uploadImagenPropiedad
  };