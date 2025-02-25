const {  AmenidadesModeloAmenidad, ModeloAsociadoPropiedad, PropiedadIndependiente } = require("../db");
const { Op } = require("sequelize");

const crearPropIndependiente = async (req, res, next) => {
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

      const PropiedadIndependienteExiste = await PropiedadIndependiente.findOne({
        where: {
          CiudadId:ciudad,
          EstadoId:estado,
          MunicipioId:municipio,
          calle,
          numeroPropiedad,
        }        
      })

      if(PropiedadIndependienteExiste){
        console.log("La Propiedad Independiente ya existe")
        res.json({
          codigo:0, 
          Mensaje:`La propiedad  `+ PropiedadIndependienteExiste.calle + " " + PropiedadIndependienteExiste.numeroPropiedad +" ya existe",
          Error:"Propiedad Independiente Existente"
        });
        //return;
      }
      else{
        const PropiedadIndependienteCreada = await PropiedadIndependiente.create({
          where: {
            CiudadId:ciudad,
            EstadoId:estado,
            //MunicipioId:municipio
          },
          defaults: {
            precio,
            calle,
            numeroPropiedad,
            numeroInterior,
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
        });
        
  
        for (let i = 0; i < amenidadesPropiedad.length; i++) {        
          await AmenidadesModeloAmenidad.create({ 
            ModeloAsociadoPropiedadId:PropiedadIndependienteCreada.id, 
            AmenidadesPropiedadId:amenidadesPropiedad[i] })
        }  
        next();
      }
      
      
      /* const modeloCreadoJSON = { codigo:1, Mensaje:`Se creo el modelo `+ PropiedadIndependienteCreada[0].nombreModelo} ;
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
    crearPropIndependiente
  };