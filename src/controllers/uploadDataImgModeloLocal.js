
const {  ImgModeloAsociado, ModeloAsociadoPropiedad, AmenidadesModeloAmenidad, Propiedad } = require("../db");
const ciudad = require("../models/ciudad");

const uploadDataImagenModelo = async (req, res) => {
    try {
      const bodyObj = req.body.data;
      const parsedbodyObj = JSON.parse(bodyObj)
      const { nombreModelo, nombreDesarrollo, ciudad, precio, recamaras, niveles,
        baños, medio_baño, espaciosCochera, cocheraTechada, tipodePropiedad,
        tipodeOperacion, m2Construccion, m2Terreno, m2Total, amenidadesPropiedad, 
        estado, posicion, ordenImagen
      } = parsedbodyObj

      console.log("Nombre del Modelo " + nombreModelo)

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
        console.log("Modelo Asociado " + ModeloRelacionadoCreado[0].id);
    
        const ordenData = ordenImagen.filter((imagen)=>imagen.img_name === file.originalname);
        console.log("Orden Data "+JSON.stringify(ordenData))
        const esJpeg = file.filename.includes("jpeg");
        var nombre_imagen = undefined;
        if(esJpeg){
          nombre_imagen = file.filename.slice(0, file.filename.length - 5);
        }
        else{
          nombre_imagen = file.filename.slice(0, file.filename.length - 4);
        }
          const imagenModeloAsociado = await ImgModeloAsociado.create({
            orden:ordenData[0].orden,
            type: file.mimetype,
            img_name: file.filename,
            thumbnail_img:"Thumbnail_WebP_"+nombre_imagen+".webp",
            detalles_imgGde:"Detalles_Img_Gde_"+nombre_imagen+".webp",
            detalles_imgChica:"Detalles_Img_Chica_"+nombre_imagen+".webp",
            ModeloAsociadoPropiedadId: ModeloRelacionadoCreado[0].id
          });
          console.log("Imagen propiedad "+imagenModeloAsociado);
      })
      
      for (let i = 0; i < amenidadesPropiedad.length; i++) {        
        await AmenidadesModeloAmenidad.create({ 
          ModeloAsociadoPropiedadId:ModeloRelacionadoCreado[0].id, 
          AmenidadesPropiedadId:amenidadesPropiedad[i] 
        })
      }

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

      console.log(`Se Creo el Modelo `+ ModeloRelacionadoCreado[0].nombreModelo +  " y sus imagenes ");
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
    uploadDataImagenModelo
  };