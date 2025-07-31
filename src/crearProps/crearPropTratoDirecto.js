const { crearPropIndependienteDesdeObjeto } = require("./crearPropIndependienteDesdeObjeto");


const crearPropTratoDirecto = async (req, res) => {
    try {

      const orgId = req.orgId;
      console.log("Org Id " + orgId)      

      // Se obtienen los datos de la form que estan en un objeto FormData y se pasan a JSON
      const bodyObj = req.body.data;
      const parsedbodyObj = JSON.parse(bodyObj);

      const propData = {
        ...parsedbodyObj,
        tratoDirecto:true,
        OrganizacionId: orgId
      };

      const propiedadIndependiente = await crearPropIndependienteDesdeObjeto(propData);

      if( propiedadIndependiente.codigo === 1){
        res.status(201).json(propiedadIndependiente)
      }
      else if(propiedadIndependiente.codigo === 0){
        res.status(400).json(propiedadIndependiente)
      }
      
      
    } catch (error) {
      console.log("Error al intentar crear los datos del Trato Directo " + error);
      res.status(400).json({
        codigo:0, 
        Mensaje:`Error al intentar crear los datos del Trato Directo`,
        Error:error
      });
    }
  };

  module.exports = {
    crearPropTratoDirecto
  };