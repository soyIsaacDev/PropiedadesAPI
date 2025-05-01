const {   Desarrollo, amenidades_de_los_desarrollos, VideoYoutube, Tour3D } = require("../db");


const crearDesarrollo = async (req, res, next) => {
    try {
      const orgId = req.orgId;
      // Se obtienen los datos de la form que estan en un objeto FormData y se pasan a JSON
      const bodyObj = req.body.data;
      const parsedbodyObj = JSON.parse(bodyObj);
      const { nombreDesarrollo, calle, numeroPropiedad, posicion, ciudad, estado, municipio,
        añodeConstruccion, amenidadesDesarrollo, TipodePropiedadId, EstiloArquitecturaId, colonia, ytvideo, tour3D_URL, 
      } = parsedbodyObj

      const [DesarrolloCreado, creado] = await Desarrollo.findOrCreate({
        where:{
          nombreDesarrollo,
          EstadoId:estado,
          MunicipioId: municipio,
          CiudadId:ciudad,
        },
        defaults:{
          TipodePropiedadId,
          TipoOperacionId:1,
          EstiloArquitecturaId,
          añodeConstruccion,
          calle,
          numeroPropiedad,
          ColoniumId:colonia,
          posicion,
          publicada:false,
          OrganizacionId:orgId,
        }
        
      });

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
        

        for (let i = 0; i < amenidadesDesarrollo.length; i++) {        
          await amenidades_de_los_desarrollos.create({ 
            DesarrolloId:DesarrolloCreado.id, 
            AmenidadesDesarrolloId:amenidadesDesarrollo[i] })
        }

    
        // Se creo el DesarrolloCreado Exitosamente
        res.json({
          codigo:1, 
          Mensaje:`Se cargaron los datos del Desarrollo`,
          desarrolloId:DesarrolloCreado.id
        });
      }
      else{
        // Ya existia el DesarrolloCreado
        console.log("El Desarrollo ya existe " + creado)
        res.json({
          codigo:0, 
          Mensaje:`El Desarrollo `+ DesarrolloCreado.nombreDesarrollo + " ya existe",
          Error:"Desarrollo Existente"
        });
      }
        
    } catch (error) {
      console.log("Error al intentar crear los datos del Desarrollo " + error);
      res.json({
        codigo:0, 
        Mensaje:`Error al intentar crear los datos del Desarrollo`,
        Error:error
      });
    }
  };

  module.exports = {
    crearDesarrollo
  };