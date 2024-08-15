const fs = require("fs");
const {  ImgPropiedad, Propiedad, AmenidadesDesarrolloPropiedad } = require("../db");

const path = require('path');
const carpeta = path.join(__dirname, '../../uploads')
console.log("DIRECTORIO" + carpeta)

const uploadDataImagenDesarrollo = async (req, res, next) => {
  console.log("upload Imagen Propiedad" )
    try {
      // Se obtienen los datos de la form que estan en un objeto FormData y se pasan a JSON
      const bodyObj = req.body.data;
      //console.log("Body OBJ -> " +bodyObj);
      const parsedbodyObj = JSON.parse(bodyObj);
      const { nombreDesarrollo, añodeConstruccion, amenidadesDesarrollo, 
        calle, numeroPropiedad, numeroInterior, colonia, estado, municipio,ciudad, posicion, 
        TipodePropiedadId, TipoOperacionId, EstiloArquitecturaId, ordenImagen} = parsedbodyObj   

      console.log("Upload Multiple Img Controller Property -> " + nombreDesarrollo);
      console.log(ordenImagen)

      const PropiedadCreada = await Propiedad.findOrCreate({
        where:{ 
          nombreDesarrollo,
          EstadoId:estado,
          MunicipioId: municipio,
          CiudadId:ciudad,
        },
        defaults:{
          TipodePropiedadId,
          TipoOperacionId,
          EstiloArquitecturaId,
          añodeConstruccion,
          calle,
          numeroPropiedad,
          numeroInterior,
          ColoniumId:colonia,
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
      //console.log("Files en creacion de Instancia " + JSON.stringify(files))
      // se crea una imagen por cada archivo y se liga a la Propiedad
      files.forEach(async (file) => {
        //console.log("Image File " + JSON.stringify(file));
          /* const imagenPropiedad = await ImgPropiedad.create({
            type: file.mimetype,
            img_name: file.filename,
            PropiedadId: PropiedadCreada[0].id
          }); */
        console.log("File Original Name " + file.originalname)
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
          
          const imagenPropiedad = await ImgPropiedad.create({
            orden:ordenData[0].orden,
            type: file.mimetype,
            img_name: file.filename,
            thumbnail_img:"Thumbnail_WebP_"+nombre_imagen+".webp",
            detalles_imgGde:"Detalles_Img_Gde_"+nombre_imagen+".webp",
            PropiedadId: PropiedadCreada[0].id
          });
          if(ordenData[0].orden === 1 || ordenData[0].orden === 2 || ordenData[0].orden === 3){
            imagenPropiedad.detalles_imgChica="Detalles_Img_Chica_"+nombre_imagen+".webp";
            imagenPropiedad.save();
          }
      })

      //Agregando Detalles Imagen Chica a los primeros files
      /* if(files[1]){
        const imagenPropiedad = await ImgPropiedad.findOne(
          { where: 
            { img_name:files[1].filename,
              PropiedadId: PropiedadCreada[0].id
             } 
          }) 
        const nombre_imagen = files[1].filename.slice(0, files[1].filename.length - 4);
        console.log("Img Prop Det Img Chica"+imagenPropiedad)
        //imagenPropiedad.detalles_imgChica= "Detalles_Img_Chica_"+nombre_imagen+".webp";
      }
      if(files[2]){
        const imagenPropiedad = await ImgPropiedad.findOne(
          { where: 
            { img_name:files[2].filename,
              PropiedadId: PropiedadCreada[0].id
             } 
          }) 
        const nombre_imagen = files[2].filename.slice(0, files[2].filename.length - 4);
        //imagenPropiedad.detalles_imgChica= "Detalles_Img_Chica_"+nombre_imagen+".webp";
      } */

      //res.json(`Se creo la Propiedad `+ PropiedadCreada[0].nombrePropiedad +  " y sus imagenes " );
      console.log("Se Creo El Desarrollo ");
      const propCreadaJSON = {
        codigo:1, Confirmacion:`Se creo el Desarrollo `+ PropiedadCreada[0].nombreDesarrollo
      }
      res.json(propCreadaJSON? propCreadaJSON :{mensaje:"No Se pudo crear la propieda"} );
    } catch (error) {
      console.log("Error al cargar el Desarrollo "+error);
      //res.json(`Error al intentar crear la imagen de la propiedad: ${error}`);
      res.json({
        codigo:0,
        Mensaje:`Error al intentar crear el Desarrollo`,
        Error:error
      });
    }
  };

  module.exports = {
    uploadDataImagenDesarrollo
  };