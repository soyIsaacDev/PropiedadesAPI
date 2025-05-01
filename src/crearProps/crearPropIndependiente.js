const {  amenidades_de_las_prop_independientes, PropiedadIndependiente, VideoYoutube, Tour3D } = require("../db");
const { Op } = require("sequelize");

// Crear Relaciones en DB

const crearPropIndependiente = async (req, res) => {
    try {
      const orgId = req.orgId;
      console.log("Org Id " + orgId)

      // Se obtienen los datos de la form que estan en un objeto FormData y se pasan a JSON
      const bodyObj = req.body.data;
      const parsedbodyObj = JSON.parse(bodyObj);
      const { precio, calle, numeroPropiedad, numeroInterior, posicion, ciudad, estado, municipio, colonia,
        niveles, recamaras, baños, medio_baño, espaciosCochera, cocheraTechada,   
        m2Construccion, m2Terreno, m2Total, añodeConstruccion, 
        TipoOperacionId, TipodePropiedadId, amenidadesPropiedad, tratoDirecto, ytvideo, tour3D_URL,
        EstiloArquitecturaId,
      } = parsedbodyObj

      const [PropiedadIndependienteCreada, creado] = await PropiedadIndependiente.findOrCreate({
        where: {
          EstadoId:estado,
          MunicipioId:municipio,
          CiudadId:ciudad,
          ColoniumId:colonia,
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
          tratoDirecto,
          publicada:false,
          TipoOperacionId, // venta
          TipodePropiedadId,  
          OrganizacionId:orgId,
          //EstiloArquitecturaId
        }        
      })

      if(creado === true){
        
        tour3D_URL && await Tour3D.create({
          tourURL:tour3D_URL,
          DesarrolloId:DesarrolloCreado.id
        })

        ytvideo.map(async (video) => {
          await VideoYoutube.create({
            videoURL:video,
            DesarrolloId:DesarrolloCreado.id
          })
        })

        for (let i = 0; i < amenidadesPropiedad.length; i++) { 
          await amenidades_de_las_prop_independientes.create({ 
            PropiedadIndependienteId:PropiedadIndependienteCreada.id, 
            AmenidadesdelaPropiedadId:amenidadesPropiedad[i] })
        }  
        // Se creo la PropiedadIndependiente Exitosamente
        res.json({
          codigo:1, 
          Mensaje:`Se cargaron los datos la propiedad Independiente`,
          PropiedadIndependienteId:PropiedadIndependienteCreada.id
        });
      }
      else{
        // Ya existia la PropiedadIndependiente
        console.log("La Propiedad Independiente ya existe")
        res.json({
          codigo:0, 
          Mensaje:`La propiedad ubicada en `+ PropiedadIndependienteCreada.calle + " " + PropiedadIndependienteCreada.numeroPropiedad +" ya existe",
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