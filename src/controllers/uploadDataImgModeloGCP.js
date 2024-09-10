const fs = require("fs");
const { Buffer } = require('node:buffer');
const {  ImgModeloAsociado, AmenidadesModeloAmenidad, ModeloAsociadoPropiedad, Propiedad } = require("../db");

const path = require('path');
const carpeta = path.join(__dirname, '../../uploads')

const gcpUploadImagenModeloRelacionado = async (req, res, next) => {
    try {
      // Se obtienen los datos de la form que estan en un objeto FormData y se pasan a JSON
      const bodyObj = req.body.data;
      const parsedbodyObj = JSON.parse(bodyObj);
      const { nombreModelo, nombreDesarrollo, ciudad, precio, niveles, recamaras,
        baños, medio_baño, espaciosCochera, cocheraTechada, tipodePropiedad,
        tipodeOperacion, m2Construccion, m2Terreno, m2Total, amenidadesPropiedad, 
        estado, posicion, ordenImagen
      } = parsedbodyObj

      const ModeloRelacionadoExiste = await ModeloAsociadoPropiedad.findOne({
        where: {
          nombreModelo,
          PropiedadId:parseInt(nombreDesarrollo),
          CiudadId:ciudad,
          EstadoId:estado,
        }
      })

      if(ModeloRelacionadoExiste){
        console.log("El modelo ya existe")
        res.json({
          codigo:0, 
          Mensaje:`El Modelo `+ ModeloRelacionadoExiste.nombreModelo + " ya existe",
          Error:"Modelo Existente"
        });
        return;
      }
      
      const ModeloRelacionadoCreado = await ModeloAsociadoPropiedad.findOrCreate({
        where: {
          nombreModelo,
          PropiedadId:parseInt(nombreDesarrollo),
          CiudadId:ciudad,
          EstadoId:estado,
        },
        defaults: {
          posicion,
          precio,
          niveles,
          recamaras, 
          baños,
          medio_baño,
          espaciosCochera,
          cocheraTechada,
          m2Construccion,
          m2Terreno,
          m2Total,     
        }  
      });
      

      for (let i = 0; i < amenidadesPropiedad.length; i++) {        
        await AmenidadesModeloAmenidad.create({ 
          ModeloAsociadoPropiedadId:ModeloRelacionadoCreado[0].id, 
          AmenidadesPropiedadId:amenidadesPropiedad[i] })
      }
      
      
      // buscamos si hay fotos
      const files = req.files;

      if (files === undefined) {
        console.log("Selecciona una imagen para tu propiedad")
        return res.send(`Selecciona una imagen para tu propiedad`);
      }
      // se crea una imagen por cada archivo y se liga a la Propiedad
      files.forEach(async (file) => {
        // Considerando caracteres especiales
        const nombreOriginal = Buffer.from(file.originalname, 'ascii').toString('utf8');
        const ordenData = ordenImagen.filter((imagen)=>imagen.img_name === nombreOriginal);

        const imagenModeloAsociado = await ImgModeloAsociado.create({
            orden:ordenData[0].orden,
            type: file.mimetype,
            //img_name: file.cloudStoragePublicUrl,
            thumbnail_img:file.resizeNameThumbnail,
            detalles_imgGde:file.resizeNameGde,
            detalles_imgChica:file.resizeNameChico,
            ModeloAsociadoPropiedadId: ModeloRelacionadoCreado[0].id
          });
      })

      // Agregar tipo de propiedad y operacion al Desarrollo
      // Modificar Precio Min y Max en Desarrollo
      const Desarrollo = await Propiedad.findByPk(parseInt(nombreDesarrollo));

      if(Desarrollo.TipodePropiedadId === null){
        Desarrollo.TipodePropiedadId = tipodePropiedad;
        await Desarrollo.save();
      }
      if(Desarrollo.TipoOperacionId === null){
        Desarrollo.TipoOperacionId = tipodeOperacion;
        await Desarrollo.save();
      }
      if(Desarrollo.precioMin === null && Desarrollo.precioMax === null){
        Desarrollo.precioMin = precio;
        Desarrollo.precioMax = precio;
        await Desarrollo.save();
      }
      else if(precio < Desarrollo.precioMin){
        Desarrollo.precioMin = precio;
        await Desarrollo.save();
      }
      else if(precio > Desarrollo.precioMax){
        Desarrollo.precioMax = precio;
        await Desarrollo.save();
      }

      const modeloCreadoJSON = { codigo:1, Mensaje:`Se creo el modelo `+ ModeloRelacionadoCreado[0].nombreModelo} ;
      res.json(modeloCreadoJSON? modeloCreadoJSON :{mensaje:"No Se pudo crear el modelo"} );
    } catch (error) {
      console.log("Error al intentar crear la imagen del Modelo " + error);
      res.json({
        codigo:0, 
        Mensaje:`Error al intentar crear la imagen del Modelo`,
        Error:error
      });
    }
  };

  module.exports = {
    gcpUploadImagenModeloRelacionado
  };