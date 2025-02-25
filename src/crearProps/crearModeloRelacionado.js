const {  AmenidadesModeloAmenidad, ModeloAsociadoPropiedad, Propiedad } = require("../db");
const { Op } = require("sequelize");

const crearModeloRelacionado = async (req, res, next) => {
    try {
      // Se obtienen los datos de la form que estan en un objeto FormData y se pasan a JSON
      const bodyObj = req.body.data;
      const parsedbodyObj = JSON.parse(bodyObj);
      const { nombreModelo, nombreDesarrollo, precio, calle, numeroPropiedad, numeroInterior, posicion, ciudad, estado, municipio,
        niveles, recamaras, baños, medio_baño, espaciosCochera, cocheraTechada,   
        m2Construccion, m2Terreno, m2Total, añodeConstruccion,  publicada, 
        tipodeOperacion, TipodePropiedadId, amenidadesPropiedad, ordenImagen,
        propiedadIndepeniente
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
        //return;
      }
      else{

        const ModeloRelacionadoCreado = await ModeloAsociadoPropiedad.create({
          nombreModelo,
          PropiedadId:parseInt(nombreDesarrollo),
          CiudadId:ciudad,
          EstadoId:estado,
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
          /* calle,
          numeroPropiedad,
          numeroInterior,  
          TipodePropiedadId,  
          publicada, */
        });
  
        for (let i = 0; i < amenidadesPropiedad.length; i++) {        
          await AmenidadesModeloAmenidad.create({ 
            ModeloAsociadoPropiedadId:ModeloRelacionadoCreado.id, 
            AmenidadesPropiedadId:amenidadesPropiedad[i] })
        }
    
        // Agregar tipo de propiedad y operacion al Desarrollo
        // Modificar Precio Min y Max en Desarrollo
        if(nombreDesarrollo){
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
          res.json({
            codigo:1, 
            Mensaje:`Se cargaron los datos del modelo relacionado`,
            modeloId:ModeloRelacionadoCreado.id
          });
        }
      }
      

      /* const modeloCreadoJSON = { codigo:1, Mensaje:`Se creo el modelo `+ ModeloRelacionadoCreado[0].nombreModelo} ;
      res.json(modeloCreadoJSON? modeloCreadoJSON :{mensaje:"No Se pudo crear el modelo"} ); */
    } catch (error) {
      console.log("Error al intentar crear los datos del Modelo " + error);
      res.json({
        codigo:0, 
        Mensaje:`Error al intentar crear los datos del Modelo`,
        Error:error
      });
    }
  };

  module.exports = {
    crearModeloRelacionado
  };