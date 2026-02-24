const {  amenidades_de_los_modelos, ModeloAsociadoAlDesarrollo, Desarrollo, VideoYoutube, Tour3D, equipamiento_de_los_modelos} = require("../db");
const { Op } = require("sequelize");
const formatPrecio = require("../utils/formatPrecio.js");

const crearModeloAsociadoDesarrollo = async (req, res, next) => {
    try {
      const orgId = req.orgId;
      // Se obtienen los datos de la form que estan en un objeto FormData y se pasan a JSON
      const bodyObj = req.body.data;
      const parsedbodyObj = JSON.parse(bodyObj);
      const { nombreModelo, nombreDesarrollo, precio, numeroInterior, posicion, ciudad, estado,
        niveles, recamaras, baños, medio_baño, espaciosCochera, cocheraTechada, m2Construccion, 
        m2Terreno, m2Patios, tipodeOperacion, TipodePropiedadId, amenidadesPropiedad, ytvideo, tour3D_URL,
        equipamiento
      } = parsedbodyObj

      const precioFormateado = formatPrecio(precio)

      const [ModeloRelacionado, creado] = await ModeloAsociadoAlDesarrollo.findOrCreate({
        where:{
          nombreModelo,
          DesarrolloId:nombreDesarrollo,
          CiudadId:ciudad,
          EstadoId:estado,
        },
        defaults:{
          posicion,
          precio: precioFormateado,
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

      console.log("ModeloRelacionado.id:", ModeloRelacionado.id);
      console.log("creado:", creado);

      if(creado === true){

        tour3D_URL && await Tour3D.create({
            tourURL:tour3D_URL,
            DesarrolloId:nombreDesarrollo
        })

        if(ytvideo && ytvideo.length > 0) {
          await Promise.all(ytvideo.map(async (video) => {
            await VideoYoutube.create({
              videoURL:video,
              DesarrolloId:nombreDesarrollo
            })
          }))
        }       

        for (let i = 0; i < amenidadesPropiedad.length; i++) {        
          const [amenidadRel, creada] = await amenidades_de_los_modelos.findOrCreate({ 
            where: {
              ModeloAsociadoAlDesarrolloId: ModeloRelacionado.id, 
              AmenidadesdelaPropiedadId: amenidadesPropiedad[i]
            },
            defaults: {
              ModeloAsociadoAlDesarrolloId: ModeloRelacionado.id, 
              AmenidadesdelaPropiedadId: amenidadesPropiedad[i]
            }
          });
          if(!creada) {
            console.log(`Amenidad ${amenidadesPropiedad[i]} ya existía para el modelo ${ModeloRelacionado.id}`);
          }
        }

        for (const equipamientoId of equipamiento) {
          const [equipRel, creada] = await equipamiento_de_los_modelos.findOrCreate({
            where: {
              ModeloAsociadoAlDesarrolloId: ModeloRelacionado.id,
              EquipamientoId: equipamientoId,
            },
            defaults: {
              ModeloAsociadoAlDesarrolloId: ModeloRelacionado.id,
              EquipamientoId: equipamientoId,
            }
          });
          if(!creada) {
            console.log(`Equipamiento ${equipamientoId} ya existía para el modelo ${ModeloRelacionado.id}`);
          }
        }
    
        // Agregar tipo de propiedad y operacion al Desarrollo
        // Modificar Precio Min y Max en Desarrollo
        if(nombreDesarrollo){
          const DesarrolloaCambiar = await Desarrollo.findByPk(nombreDesarrollo);
  
          if(DesarrolloaCambiar.TipodePropiedadId === null){
            DesarrolloaCambiar.TipodePropiedadId = TipodePropiedadId;
            await DesarrolloaCambiar.save();
          }
          if(DesarrolloaCambiar.TipoOperacionId === null){
            DesarrolloaCambiar.TipoOperacionId = tipodeOperacion;
            await DesarrolloaCambiar.save();
          }
          if(DesarrolloaCambiar.precioMin === null && DesarrolloaCambiar.precioMax === null){
            DesarrolloaCambiar.precioMin = precioFormateado;
            DesarrolloaCambiar.precioMax = precioFormateado;
            await DesarrolloaCambiar.save();
          }
          else if(precioFormateado < DesarrolloaCambiar.precioMin){
            DesarrolloaCambiar.precioMin = precioFormateado;
            await DesarrolloaCambiar.save();
          }
          else if(precioFormateado > DesarrolloaCambiar.precioMax){
            DesarrolloaCambiar.precioMax = precioFormateado;
            await DesarrolloaCambiar.save();
          }

          // Se creo el ModeloRelacionado Exitosamente
          res.json({
            codigo:1, 
            Mensaje:`Se cargaron los datos del modelo relacionado`,
            modeloId:ModeloRelacionado.id
          });

        }
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