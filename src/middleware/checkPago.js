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
    if(historialdePagos.length>0){
        //Formateando como fecha para poder comparar
        const fechaHistorial = new Date(historialdePagos[0].fechaFin);
        const hoy = new Date();
        if(hoy < fechaHistorial){
            next();
        }
        else{
            res.json({pago:"NO pagado"})
        }

    }
    else res.json({pago:"No existen pagos"})
  } catch (e) {
      res.send(e)
  }
}

servidorPago.get("/revisarPago/:userId", checkPago, async (req, res)=>{
  try {
    res.json({pago:"Se encuentra pagado"})
  } catch (error) {
    res.send(error)
  }
})


module.exports = { checkPago, servidorPago };