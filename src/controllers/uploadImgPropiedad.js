const fs = require("fs");
const {  ImgPropiedad, Propiedad, ModeloRelacionadoPropiedad   } = require("../db");

const path = require('path');
const carpeta = path.join(__dirname, '../../uploads')
console.log("DIRECTORIO" + carpeta)

const uploadImagenPropiedad = async (req, res) => {
    try {
      console.log(JSON.stringify(req.file))
      const bodyObj = req.body.data;
      const parsedbodyObj = JSON.parse(bodyObj)
      const { nombreDesarrollo, nombreModelo, precio, recamaras, baños, calle, 
        colonia, numeroCasa, numeroInterior} = parsedbodyObj
      console.log("Nombre de la Propiedad " + nombreDesarrollo + " Modelo " + nombreModelo)
      if (req.file == undefined) {
        return res.send(`Selecciona una imagen para tu propiedad`);
      }

      const imagenPropiedad = await ImgPropiedad.create({
        type: req.file.mimetype,
        img_name: req.file.filename
      });
      console.log("Imagen propiedad "+imagenPropiedad);



      /* const propiedad = await Propiedad.findOrCreate({
        where: {
          id:propiedadId
        },
        defaults:{
          nombreDesarrollo,
          precio,
          recamaras, 
          baños, 
          calle,
          colonia,
          numeroCasa,
          numeroInterior
        }   
      }); */
      if(nombreModelo){
        const modelo = await ModeloRelacionadoPropiedad.create({
          nombreModelo,
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
        
        await imagenPropiedad.save();
      }
      else{
        const propiedad = await Propiedad.create({
          nombreDesarrollo,
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
      }
      

      //res.json(`Se creo la imagen de propiedad ` + imagenPropiedad + " de la propiedad " );
      
    } catch (error) {
      console.log(error);
      return res.send(`Error al intentar crear la imagen de la propiedad: ${error}`);
    }
  };

  module.exports = {
    uploadImagenPropiedad
  };