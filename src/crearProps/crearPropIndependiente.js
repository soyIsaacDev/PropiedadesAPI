const {  AmenidadesModeloAmenidad, PropiedadIndependiente } = require("../db");
const { Op } = require("sequelize");

// Crear Relaciones en DB

const crearPropIndependiente = async (req, res) => {
    try {
      // Se obtienen los datos de la form que estan en un objeto FormData y se pasan a JSON
      const bodyObj = req.body.data;
      const parsedbodyObj = JSON.parse(bodyObj);
      const { precio, calle, numeroPropiedad, numeroInterior, posicion, ciudad, estado, municipio,
        niveles, recamaras, baños, medio_baño, espaciosCochera, cocheraTechada,   
        m2Construccion, m2Terreno, m2Total, añodeConstruccion,  publicada, 
        tipodeOperacion, TipodePropiedadId, amenidadesPropiedad,
        propiedadIndepeniente
      } = parsedbodyObj

      const [PropiedadIndependienteCreada, creado] = await PropiedadIndependiente.findOrCreate({
        where: {
          CiudadId:ciudad,
          EstadoId:estado,
          MunicipioId:municipio,
          calle,
          numeroPropiedad,
          numeroInterior,
        },
        defaults: {
          precio,          
          posicion,
          niveles,
          recamaras, 
          baños,
          medio_baño,
          espaciosCochera,
          cocheraTechada,
          m2Construccion,
          m2Terreno,
          m2Total, 
          añodeConstruccion,
          //publicada,
          //TipodeOperacionId:tipodeOperacion,
          //TipodePropiedadId,  
        }        
      })

      if(creado === true){

        /*  +++++ CREAR LA RELACION ++++++*/

        /* for (let i = 0; i < amenidadesPropiedad.length; i++) {        
          await AmenidadesModeloAmenidad.create({ 
            ModeloAsociadoPropiedadId:PropiedadIndependienteCreada.id, 
            AmenidadesPropiedadId:amenidadesPropiedad[i] })
        }   */
        // Se creo la PropiedadIndependiente Exitosamente
        res.json({
          codigo:1, 
          Mensaje:`Se cargaron los datos la propiedad Independiente`,
          propIndependienteId:PropiedadIndependienteCreada.id
        });
      }
      else{
        // Ya existia la PropiedadIndependiente
        console.log("La Propiedad Independiente ya existe")
        res.json({
          codigo:0, 
          Mensaje:`La propiedad  `+ PropiedadIndependienteCreada.calle + " " + PropiedadIndependienteCreada.numeroPropiedad +" ya existe",
          Error:"Propiedad Independiente Existente"
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
    crearPropIndependiente
  };