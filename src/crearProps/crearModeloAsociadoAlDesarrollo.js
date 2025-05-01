const {  amenidades_de_los_modelos, ModeloAsociadoAlDesarrollo, Desarrollo, VideoYoutube, Tour3D} = require("../db");
const { Op } = require("sequelize");

const crearModeloAsociadoDesarrollo = async (req, res, next) => {
    try {
      const orgId = req.orgId;
      // Se obtienen los datos de la form que estan en un objeto FormData y se pasan a JSON
      const bodyObj = req.body.data;
      const parsedbodyObj = JSON.parse(bodyObj);
      const { nombreModelo, nombreDesarrollo, precio, numeroInterior, posicion, ciudad, estado,
        niveles, recamaras, baños, medio_baño, espaciosCochera, cocheraTechada, m2Construccion, 
        m2Terreno, m2Patios, tipodeOperacion, TipodePropiedadId, amenidadesPropiedad, ytvideo, tour3D_URL
      } = parsedbodyObj

      const [ModeloRelacionado, creado] = await ModeloAsociadoAlDesarrollo.findOrCreate({
        where:{
          nombreModelo,
          DesarrolloId:parseInt(nombreDesarrollo),
          CiudadId:ciudad,
          EstadoId:estado,
        },
        defaults:{
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
          m2Patios, 
          numeroInterior,
          OrganizacionId:orgId,
          publicada:false,
          /* añodeConstruccion
            municipio
            publicada
          */
        }
        
      });

      if(creado === true){

        for (let i = 0; i < amenidadesPropiedad.length; i++) {        
          await amenidades_de_los_modelos.create({ 
            ModeloAsociadoAlDesarrolloId:ModeloRelacionado.id, 
            AmenidadesdelaPropiedadId:amenidadesPropiedad[i] })
        }
    
        // Agregar tipo de propiedad y operacion al Desarrollo
        // Modificar Precio Min y Max en Desarrollo
        if(nombreDesarrollo){
          const DesarrolloaCambiar = await Desarrollo.findByPk(parseInt(nombreDesarrollo));
  
          if(DesarrolloaCambiar.TipodePropiedadId === null){
            DesarrolloaCambiar.TipodePropiedadId = TipodePropiedadId;
            await DesarrolloaCambiar.save();
          }
          if(DesarrolloaCambiar.TipoOperacionId === null){
            DesarrolloaCambiar.TipoOperacionId = tipodeOperacion;
            await DesarrolloaCambiar.save();
          }
          if(DesarrolloaCambiar.precioMin === null && DesarrolloaCambiar.precioMax === null){
            DesarrolloaCambiar.precioMin = precio;
            DesarrolloaCambiar.precioMax = precio;
            await DesarrolloaCambiar.save();
          }
          else if(precio < DesarrolloaCambiar.precioMin){
            DesarrolloaCambiar.precioMin = precio;
            await DesarrolloaCambiar.save();
          }
          else if(precio > DesarrolloaCambiar.precioMax){
            DesarrolloaCambiar.precioMax = precio;
            await DesarrolloaCambiar.save();
          }

          // Se creo el ModeloRelacionado Exitosamente
          res.json({
            codigo:1, 
            Mensaje:`Se cargaron los datos del modelo relacionado`,
            modeloId:ModeloRelacionado.id
          });

        }
        else{
          // Ya existia el ModeloRelacionado
          console.log("El modeloRelacionado ya existe " + creado)
          res.json({
            codigo:0, 
            Mensaje:`El Modelo `+ ModeloRelacionado.nombreModelo + " ya existe",
            Error:"Modelo Existente"
          });
        }
        
      }

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
    crearModeloAsociadoDesarrollo
  };