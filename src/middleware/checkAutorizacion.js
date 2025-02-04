const { Autorizacion, Cliente  } = require("../db");
const confirmaAutorizacion = require("express").Router();

const checkAutorizacion = async (req, res, next)  => {
    try {
        const { userId} = req.body;
        console.log("REVISANDO AUTORIZACION "+userId)
        const cliente = await Cliente.findOne({
            where:{ userId}
        })
        const autorizacion = await Autorizacion.findOne({
            where:{
                ClienteId:cliente.id
            }
        })
        req.auth = autorizacion.niveldeAutorizacion
        if(autorizacion.niveldeAutorizacion !== "Ninguna") next()
        else console.log("EL USUARIO NO ESTA AUTORIZADO")
    } catch (e) {
        res.send(e)
    }
}

confirmaAutorizacion.get("/checkautorizacion/:userId", async (req, res)=>{
 try {
    console.log("Checando la Autorizacion del usuario")
    const { userId } = req.params;
        const cliente = await Cliente.findOne({
            where:{ userId }
        })
        const autorizacion = await Autorizacion.findOne({
            where:{
                ClienteId:cliente.id
            }
        })
        res.json(autorizacion)
 } catch (error) {
    res.send(error)
 }
})


confirmaAutorizacion.get("/borrarAuth/:clienteId", async (req, res)=>{
  try {
    const { clienteId } = req.params;
    const autorizacion = await Autorizacion.findOne({
      where:{
        ClienteId:clienteId
      }
    })
    autorizacion.destroy();
    res.send("Borrado")
  } catch (error) {
    res.send(error)
  }
})


module.exports = {checkAutorizacion, confirmaAutorizacion};