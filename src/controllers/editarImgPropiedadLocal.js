const fs = require("fs");
const {  ImgPropiedad, Propiedad, AmenidadesDesarrolloPropiedad } = require("../db");

const path = require('path');
const carpeta = path.join(__dirname, '../../uploads')
console.log("DIRECTORIO" + carpeta)

const editarPropiedad = async (req, res, next) => {
  console.log("upload Imagen Propiedad" )
    try {
      // Se obtienen los datos de la form que estan en un objeto FormData y se pasan a JSON
      const bodyObj = req.body.data;
      //console.log("Body OBJ -> " +bodyObj);
      const parsedbodyObj = JSON.parse(bodyObj);
      const { id, nombreDesarrollo, añodeConstruccion, amenidadesDesarrollo, 
        calle, numeroPropiedad, numeroInterior, colonia, estado, municipio,ciudad, posicion, 
        TipodePropiedadId, TipoOperacionId, EstiloArquitecturaId, ordenImagen} = parsedbodyObj   

      console.log("Upload Multiple Img Controller Property -> " + nombreDesarrollo);
      //console.log("Orden Imagen "+JSON.stringify(ordenImagen))

      const PropiedadBuscada = await Propiedad.findByPk(id);
      PropiedadBuscada.nombreDesarrollo = nombreDesarrollo;
      PropiedadBuscada.EstadoId = estado;
      PropiedadBuscada.MunicipioId = municipio;
      PropiedadBuscada.CiudadId = ciudad;
      PropiedadBuscada.TipodePropiedadId = TipodePropiedadId;
      PropiedadBuscada.TipoOperacionId = TipoOperacionId;
      PropiedadBuscada.EstiloArquitecturaId = EstiloArquitecturaId;
      PropiedadBuscada.añodeConstruccion = añodeConstruccion;
      PropiedadBuscada.calle = calle;
      PropiedadBuscada.numeroPropiedad = numeroPropiedad;
      PropiedadBuscada.numeroInterior = numeroInterior;
      PropiedadBuscada.ColoniumId = colonia;
      PropiedadBuscada.posicion = posicion;

      PropiedadBuscada.save();

      for (let i = 0; i < amenidadesDesarrollo.length; i++) {        
        await AmenidadesDesarrolloPropiedad.findOrCreate({ 
          where:{
            PropiedadId:id, 
            AmenidadesDesarrolloId:amenidadesDesarrollo[i] 
          }
        })
      }
      
      // buscamos si hay fotos
      const files = req.files;

      // Si hay imagenes nuevas cargadas
      if(files.length>0) {

        console.log("Files en creacion de Instancia " + JSON.stringify(files))
        for (let i = 0; i < ordenImagen.length; i++) {
          if(ordenImagen[i].editar===1){ // 1 = editar
            const imagenPropiedad = await ImgPropiedad.findByPk(ordenImagen[i].id);
            console.log("Orden Id "+ordenImagen[i].id +  " Editar "+ ordenImagen[i].editar+  " Orden Editado " +JSON.stringify(imagenPropiedad))
            imagenPropiedad.orden= ordenImagen[i].orden
            await imagenPropiedad.save();
          }
          else if (ordenImagen[i].editar===2){ // 2 = borrar
            const imagenPropiedad = await ImgPropiedad.findByPk(ordenImagen[i].id);
            await imagenPropiedad.destroy();
            fs.unlink(carpeta+"/"+ordenImagen[i].img_name, (err) => {
                if (err) {
                    throw err;
                }
                console.log("Delete File successfully " + ordenImagen[i].img_name);
              });
          }
        }
        // se crea una imagen por cada archivo y se liga a la Propiedad
        files.forEach(async (file) => {
          //console.log("Image File " + JSON.stringify(file));
          ordenImagen.forEach((imagen) =>{
            
            console.log("Orden Data Image Name "+imagen.img_name + " Image File " + file.originalname)
          })
          const ordenData = ordenImagen.filter((imagen)=>imagen.img_name === file.originalname);
          
          //console.log("Orden Data "+JSON.stringify(ordenImagen))
            const nombre_imagen = file.filename.slice(0, file.filename.length - 4);
            const imagenPropiedad = await ImgPropiedad.create({
              orden:ordenData[0].orden,
              type: file.mimetype,
              img_name: file.filename,
              thumbnail_img:"Thumbnail_WebP_"+nombre_imagen+".webp",
              detalles_imgGde:"Detalles_Img_Gde_"+nombre_imagen+".webp",
              detalles_imgChica:"Detalles_Img_Chica_"+nombre_imagen+".webp",
              PropiedadId: PropiedadBuscada.id
            });
        })
      }
      else console.log("No hay imagenes nuevas a cargar");
      
      //res.json(`Se creo la Propiedad `+ PropiedadBuscada[0].nombrePropiedad +  " y sus imagenes " );
      console.log("Se Edito la Propiedad");
      const propCreadaJSON = {
        Confirmacion:`Se edito la Propiedad `+ PropiedadBuscada.nombreDesarrollo
      }
      res.json(propCreadaJSON? propCreadaJSON :{mensaje:"No Se pudo crear la propieda"} );
    } catch (error) {
      console.log("Error al editar la imagen "+error);
      //res.json(`Error al intentar crear la imagen de la propiedad: ${error}`);
    }
  };

  module.exports = {
    editarPropiedad
  };