const { Agente, HistorialdePagos  } = require("../db");

async function checkPago (req, res, next) {
  try {
    // Cambiar para revisar por tipo de organizacion 
    // Antes de esto debo hacer el contexto en front para guardar Org
    const { tipodeAgente, idAgente} = req.body;
    var agente;
    if(tipodeAgente==="AgenteDeDesarrollo"){
        agente = await AgenteDeDesarrollo.findOne({
            where:{
                id:idAgente
            }            
        });
    }
    else{
        agente = await Agente.findOne({
            where:{
                id:idAgente
            }            
        });
    }
    const historialdePagos = await HistorialdePagos.findAll({
        where:{
            OrganizacionId:agente.OrganizacionId
        },
        order: [
            ['fechaFin','DESC']
        ],
    })
    
    //Formateando como fecha para poder comparar
    const fechaHistorial = new Date(historialdePagos[0].fechaFin);
    const hoy = new Date();
    if(hoy < fechaHistorial){
        //res.send("Si esta pagado")
        next();
    }
    else{
        res.send("NO pagado")
    }
  } catch (e) {
      res.send(e)
  }
}

module.exports = checkPago;