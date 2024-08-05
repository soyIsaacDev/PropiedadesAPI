const fs = require("fs");
const {  ImgModeloAsociado, ModeloAsociadoPropiedad, AmenidadesModeloAmenidad } = require("../db");

const path = require('path');
const estiloArquitectura = require("../models/estiloArquitectura");
const carpeta = path.join(__dirname, '../../uploads')
console.log("DIRECTORIO" + carpeta)

const editarDataModelo = async (req, res, next) => {
  console.log("upload Imagen Propiedad" )
    try {
      // Se obtienen los datos de la form que estan en un objeto FormData y se pasan a JSON
      const bodyObj = req.body.data;
      const parsedbodyObj = JSON.parse(bodyObj);
      const { modeloId, desarrolloId, nombreModelo, precio, ciudad, estado, posicion, recamaras,
        niveles, baños, medio_baño, espaciosCochera, cocheraTechada, m2Construccion, m2Terreno, 
        m2Total, amenidadesPropiedad, ordenImagen         } = parsedbodyObj   

      //console.log("Upload Multiple Img Controller Modelo -> " + nombreModelo);
      console.log("Desarrollo Id "+desarrolloId)

      const ModelosdelDesarrollo = await ModeloAsociadoPropiedad.findAll({ 
        where: { 
          PropiedadId:desarrolloId
        } 
      });

      const ModeloBuscado = await ModeloAsociadoPropiedad.findByPk(modeloId);
      ModeloBuscado.PropiedadId = parseInt(desarrolloId);
      // Verificando que no se repitan los nombres para el mismo desarrollo
      ModelosdelDesarrollo.map((modelo)=>{
        if(modelo.nombreModelo.includes(nombreModelo) && modelo.id !== modeloId){
          throw "Modelo Repetido";
        }
        else{
          ModeloBuscado.nombreModelo = nombreModelo;
        }
    })
      ModeloBuscado.precio = precio;
      ModeloBuscado.CiudadId = ciudad;
      ModeloBuscado.EstadoId = estado;
      ModeloBuscado.posicion = posicion;
      ModeloBuscado.niveles= niveles;
      ModeloBuscado.recamaras = recamaras;
      ModeloBuscado.baños = baños;
      ModeloBuscado.medio_baño = medio_baño
      ModeloBuscado.espaciosCochera = espaciosCochera;
      ModeloBuscado.cocheraTechada = cocheraTechada;
      ModeloBuscado.m2Construccion = m2Construccion;
      ModeloBuscado.m2Terreno  = m2Terreno;
      ModeloBuscado.m2Total = m2Total;
      
      ModeloBuscado.save();

      for (let i = 0; i < amenidadesPropiedad.length; i++) {        
        await AmenidadesModeloAmenidad.findOrCreate({ 
          where:{
            ModeloAsociadoPropiedadId:modeloId, 
            AmenidadesPropiedadId:amenidadesPropiedad[i] 
          }
        })
      }

      // buscamos si hay fotos
      const files = req.files;

        for (let i = 0; i < ordenImagen.length; i++) {
          if(ordenImagen[i].editar===1){ // 1 = editar
            const imagenModelo = await ImgModeloAsociado.findByPk(ordenImagen[i].id);
            console.log("Orden Id "+ordenImagen[i].id +  " Editar "+ ordenImagen[i].editar+  " Orden Editado " +JSON.stringify(imagenModelo))
            imagenModelo.orden= ordenImagen[i].orden
            await imagenModelo.save();
          }
          else if (ordenImagen[i].editar===2){ // 2 = borrar
            const imagenModelo = await ImgModeloAsociado.findByPk(ordenImagen[i].id);

            function deleteFile(fileName){
              fs.unlink(carpeta+"/"+fileName, (err) => {
                if (err) {
                    console.log(err);
                }
                console.log("Delete File successfully " + fileName);
              });
            }
            
            deleteFile(imagenModelo.img_name);
            deleteFile(imagenModelo.thumbnail_img);
            deleteFile(imagenModelo.detalles_imgGde)

            if(imagenModelo.detalles_imgChica !== null){
              deleteFile(imagenModelo.detalles_imgChica);
            }
           
            // Borrar datos de la imagen de la propiedad
            await imagenModelo.destroy();
          }
        }

      //  ---- Si se cargaron imagenes nuevas

      const crearDatosdeImagenModelo = async (file, ModeloId)=>{
        const ordenData = ordenImagen.filter((imagen)=>imagen.img_name === file.originalname);

        const imagenModelo = await ImgModeloAsociado.create({
          orden:ordenData[0].orden,
          type: file.mimetype,
          img_name: file.uniqueDateName,
          thumbnail_img:file.resizeNameThumbnail,
          detalles_imgGde:file.resizeNameGde,
          ModeloAsociadoPropiedadId: ModeloId
        });
        if(ordenData[0].orden === 1 || ordenData[0].orden === 2 || ordenData[0].orden === 3){
          imagenModelo.detalles_imgChica = file.resizeNameChico;
          imagenModelo.save();
        }
      }

      // Si hay imagenes nuevas cargadas
      if(files.length>0) {
        // se crea una imagen por cada archivo  y se liga a la Propiedad
        files.forEach(async (file) => {
          crearDatosdeImagenModelo(file, ModeloBuscado.id );
        })
        
      }
      else console.log("No hay imagenes nuevas a cargar");
      
      console.log(`Se Edito el Modelo `+ ModeloBuscado.nombreModelo +  " y sus imagenes ");
      const modeloCreadoJSON = { codigo:1, Mensaje:`Se edito el modelo `+ ModeloBuscado.nombreModelo} ;
      res.json(modeloCreadoJSON? modeloCreadoJSON :{mensaje:"No Se pudo crear el modelo"} );
    } catch (error) {
      console.log("Error al editar la imagen del modelo "+error);
      res.json({
        codigo:0, 
        Mensaje:`Error al intentar crear la imagen del Modelo`,
        Error:error
      });
      //res.json(`Error al intentar crear la imagen de la propiedad: ${error}`);
    }
  };

  module.exports = {
    editarDataModelo
  };