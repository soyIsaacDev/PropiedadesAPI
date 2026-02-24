const { crearPropIndependienteDesdeObjeto } = require("./crearPropIndependienteDesdeObjeto");
const { AsignaciondePropiedad } = require("../db");


const crearPropiedadInternaIndependiente = async (req, res) => {
    try {

      const aliado = req.aliado;      

      // Se obtienen los datos de la form que estan en un objeto FormData y se pasan a JSON
      const bodyObj = req.body.data;
      const parsedbodyObj = JSON.parse(bodyObj);

      const propData = {
        ...parsedbodyObj,
        tratoDirecto:false,
        OrganizacionId: aliado.OrganizacionId
      };

      //console.log(propData)

      const propiedadIndependiente = await crearPropIndependienteDesdeObjeto(propData);

      // Se creo la propiedad 
      if( propiedadIndependiente.codigo === 1){
        //const {  clienteId } = req.body;
        console.log("Propiedad Interna Independiente Creada con id:",propiedadIndependiente.propiedadIndependienteId)
        const propiedadAsignada = await AsignaciondePropiedad.create({
            aliadoId:aliado.id, 
            //clienteId,
            propiedadId: propiedadIndependiente.propiedadIndependienteId,
            tipoDeAutorizacion:"Completa",
            clientePrincipal:true,
            rolDelAliado:"Principal"
        })
        res.status(201).json(propiedadIndependiente)
      }
      // Propiedad ya existia
      else if(propiedadIndependiente.codigo === 0){
        res.status(400).json(propiedadIndependiente)
      }
      
      
      //res.json(propiedadAsignada)
      
    } catch (error) {
      console.log("Error al intentar crear los datos de la Prop CII " + error);
      res.json({
        codigo:0, 
        Mensaje:`Error al intentar crear los datos de la Prop CII`,
        Error:error
      });
    }
  };

  module.exports = {
    crearPropiedadInternaIndependiente
  };