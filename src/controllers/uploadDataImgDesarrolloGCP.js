const fs = require("fs");
const {  ImgPropiedad, Propiedad, AmenidadesDesarrolloPropiedad } = require("../db");

const path = require('path');
const carpeta = path.join(__dirname, '../../uploads')
console.log("DIRECTORIO" + carpeta)

const gcpUploadDataImagenDesarrollo = async (req, res, next) => {
  console.log("upload Imagen Propiedad")
  
    try {
      // Se obtienen los datos de la form que estan en un objeto FormData y se pasan a JSON
      const bodyObj = req.body.data;
      //console.log("Body OBJ -> " +bodyObj);
      const parsedbodyObj = JSON.parse(bodyObj);
      const { nombreDesarrollo, añodeConstruccion, amenidadesDesarrollo, calle, numeroPropiedad, numeroInterior, 
        colonia, estado, municipio,ciudad, posicion, TipodePropiedadId, TipoOperacionId, EstiloArquitecturaId, ordenImagen} = parsedbodyObj   

      console.log("Upload Multiple Img Controller Property -> " + nombreDesarrollo);
      console.log("Orden Imagen "+JSON.stringify(ordenImagen))

      const PropiedadCreada = await Propiedad.findOrCreate({
        where:{ 
          nombreDesarrollo,
          EstadoId:estado,
          MunicipioId: municipio,
          CiudadId:ciudad,
        },
        defaults:{
          añodeConstruccion,
          calle,
          numeroPropiedad,
          numeroInterior,
          ColoniumId:colonia,
          TipodePropiedadId,
          TipoOperacionId,
          EstiloArquitecturaId,
          posicion
        }
      });

      for (let i = 0; i < amenidadesDesarrollo.length; i++) {        
        await AmenidadesDesarrolloPropiedad.create({ PropiedadId:PropiedadCreada[0].id, AmenidadesDesarrolloId:amenidadesDesarrollo[i] })
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
        console.log("Image File " + JSON.stringify(file));

        console.log("File OriginalName  " + file.originalname)
        const ordenData = ordenImagen.filter((imagen)=>imagen.img_name === file.originalname);
        console.log("Orden Data "+JSON.stringify(ordenData))

          const imagenPropiedad = await ImgPropiedad.create({
            orden:ordenData[0].orden,
            type: file.mimetype,
            img_name:file.originalname,
            thumbnail_img:file.resizeNameThumbnail,
            detalles_imgGde:file.resizeNameGde,
            PropiedadId: PropiedadCreada[0].id
          });
          if(ordenData[0].orden === 1 || ordenData[0].orden === 2 || ordenData[0].orden === 3){
            imagenPropiedad.detalles_imgChica=file.resizeNameChico;
            imagenPropiedad.save();
          }
          console.log("Se Creo la Propiedad" + JSON.stringify(imagenPropiedad));
      })

      //res.json(`Se creo la Propiedad `+ PropiedadCreada[0].nombrePropiedad +  " y sus imagenes " );
      console.log("Se Creo El Desarrollo");
      const propCreadaJSON = {
        codigo:1, 
        Confirmacion:`Se creo el Desarrollo `+ PropiedadCreada[0].nombreDesarrollo
      }
      res.json(propCreadaJSON? propCreadaJSON :{mensaje:"No Se pudo crear la propieda"} );
    } catch (error) {
      console.log("Error al cargar el Desarrollo "+error);
      res.json({
        codigo:0, 
        Mensaje:`Error al intentar crear el Desarrollo`,
        Error:error
      });
    }
  };

  module.exports = {
    gcpUploadDataImagenDesarrollo
  };