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
          m2Construccion,
          m2Terreno,
          m2Total,     
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
        return res.send(`Selecciona una imagen para tu propiedad`);
      }
      console.log("Files en creacion de Instancia " + JSON.stringify(files))
      // se crea una imagen por cada archivo y se liga a la Propiedad
      files.forEach(async (file) => {
        console.log("Image File " + JSON.stringify(file))
        console.log("CloudStoragePublicUrl Image File " + JSON.stringify(file.cloudStoragePublicUrl))
          const imagenModeloAsociado = await ImgModeloAsociado.create({
            type: file.mimetype,
            img_name: file.cloudStoragePublicUrl,
            ModeloAsociadoPropiedadId: ModeloRelacionadoCreado[0].id
          });
          console.log("Imagen propiedad "+imagenModeloAsociado);
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
        console.log("Desarrollo " + Desarrollo.nombreDesarrollo);
        console.log("Desarrollo Precio" + Desarrollo.precioMin + "Precio Max " + Desarrollo.precioMax)
      }
      else if(precio < Desarrollo.precioMin){
        Desarrollo.precioMin = precio;
        await Desarrollo.save();
        console.log("Desarrollo Precio Min" + Desarrollo.precioMin)
      }
      else if(precio > Desarrollo.precioMax){
        Desarrollo.precioMax = precio;
        await Desarrollo.save();
        console.log("Desarrollo Precio Max" + Desarrollo.precioMax)
      }

      //res.json(`Se creo la Propiedad `+ ModeloRelacionadoCreado[0].nombrePropiedad +  " y sus imagenes " );
      console.log("Se Creo el Modelo");
      res.json("Se Creo el Modelo")
    } catch (error) {
      console.log("Error en Upload Multiple Img "+error);
      //res.json(`Error al intentar crear la imagen de la propiedad: ${error}`);
    }
  };

  module.exports = {
    uploadImagenPropiedad
  };