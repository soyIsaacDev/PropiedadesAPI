const { Agente, HistorialdePagos, Cliente  } = require("../db");
const servidorPago = require("express").Router();

const checkPago = async function (req, res, next) {
  try {
    //const { userId} = req.body;
    const { userId} = req.params;

    const cliente = await Cliente.findOne({
        where:{ userId },
    })
    
    const historialdePagos = await HistorialdePagos.findAll({
        where:{
            OrganizacionId:cliente.OrganizacionId
        },
        order: [
            ['fechaFin','DESC']
        ],
    })
    if(historialdePagos){
        //Formateando como fecha para poder comparar
        const fechaHistorial = new Date(historialdePagos[0].fechaFin);
        const hoy = new Date();
        if(hoy < fechaHistorial){
            //res.send("Si esta pagado")
            next();
        }
        else{
            console.log("No Pagado")
            res.send("NO pagado")
        }

    }
    else res.send("No existen pagos")
  } catch (e) {
      res.send(e)
  }
}

servidorPago.get("/revisarPago/:userId", checkPago, async (req, res)=>{
  try {
    res.send("Pagado")
  } catch (error) {
    res.send(error)
  }
})


module.exports = { checkPago, servidorPago };