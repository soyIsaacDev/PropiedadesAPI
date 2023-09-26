const fs = require("fs");
const {  ImgPropiedad, Propiedad  } = require("../db");

const path = require('path');
const carpeta = path.join(__dirname, '../../uploads')
console.log("DIRECTORIO" + carpeta)

const uploadImagenPropiedad = async (req, res) => {
    try {
      const bodyObj = req.body.data;
      const parsedbodyObj = JSON.parse(bodyObj)
      const {propiedadId, nombrePropiedad, precio, recamaras, baños, calle, 
        colonia, numeroCasa, numeroInterior} = parsedbodyObj
      console.log("Nombre de la Propiedad " + nombrePropiedad )
      if (req.file == undefined) {
        return res.send(`Selecciona una imagen para tu propiedad`);
      }

      const imagenPropiedad = await ImgPropiedad.create({
        type: req.file.mimetype,
        img_name: req.file.filename,
        PropiedadId: propiedadId
      });
      console.log("Imagen propiedad "+imagenPropiedad);



      /* const propiedad = await Propiedad.findOrCreate({
        where: {
          id:propiedadId
        },
        defaults:{
          nombrePropiedad,
          precio,
          recamaras, 
          baños, 
          calle,
          colonia,
          numeroCasa,
          numeroInterior
        }   
      }); */
      const propiedad = await Propiedad.create({
          nombrePropiedad,
          precio,
          recamaras, 
          baños, 
          calle,
          colonia,
          numeroCasa,
          numeroInterior
           
      }).then((response) => {
        imagenPropiedad.PropiedadId = response.id
      });
     /* propiedad[0].idImagen = imagenPropiedad.id;
     await propiedad[0].save(); */
    
     await imagenPropiedad.save();

      res.json(`Se creo la imagen de propiedad ` + imagenPropiedad + " de la propiedad " );
      
    } catch (error) {
      console.log(error);
      return res.send(`Error al intentar crear la imagen de la propiedad: ${error}`);
    }
  };

  module.exports = {
    uploadImagenPropiedad
  };