const { Autorizacion, Cliente, TipodeUsuario,  } = require("../db");
const servidorAutorizacion = require("express").Router();

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

const checkManejodeUsuarios = async (req, res, next) => {
    try{        
        const agentes = req.body; // se reciben los datos en un Array
        
        const agentePrincipal = await Cliente.findOne({ 
            where:{ userId:agentes[0].userIdAgentePrincipal 
        }})
        const tipodeUsuario = await TipodeUsuario.findOne({
            where:{
                id:agentePrincipal.TipodeUsuarioId
            }
        })

        // Usuarios autorizados a agregar agentes
        if(tipodeUsuario.tipo === "DueñoIsaacBoMiquirray" || tipodeUsuario.tipo === "Desarrollador" 
            || tipodeUsuario.tipo === "Arquitecto" || tipodeUsuario.tipo === "Constructor" )
        {
            req.orgId = agentePrincipal.OrganizacionId
            next();
        }  

        // Usuarios NO Autorizados a agregar agentes
        if(tipodeUsuario.tipo === "ClienteFinal" || tipodeUsuario.tipo === "Agente" 
          || tipodeUsuario.tipo === "AgentedeDesarrollo" || tipodeUsuario.tipo === "AgendedeDesarrollo" 
          || tipodeUsuario.tipo === "DueñodePropiedad" 
        )  res.send("Usuario No Autorizado");

    } catch(error){
        res.send(error)
    }
}

servidorAutorizacion.post("/revisarCaracteristicasUsuario", async (req, res)=>{
 try {
    console.log("Checando la Autorizacion del usuario")
    const { userId } = req.body;
        const cliente = await Cliente.findOne({
            where:{ userId },
            include: [
                { model: TipodeUsuario },
                { model: Autorizacion },
            ]
        })
        
        let tipodeUsuario = cliente.TipodeUsuario.tipo;
        let autorizacion = cliente.Autorizacion.niveldeAutorizacion;
        console.log(tipodeUsuario)
        if(cliente){
            // Estos usuarios estan autorizados a Publicar Propiedades
            if(tipodeUsuario ==="DueñodePropiedad" || tipodeUsuario === "DueñoIsaacBoMiquirray" 
                || tipodeUsuario === "Desarrollador" || tipodeUsuario === "Arquitecto" 
                || tipodeUsuario === "Constructor" ) 
            res.send( {tipodeUsuario, autorizacion:"Completa"})
            // Usuarios con autorizacion variable
            else if(tipodeUsuario === "AgentedeDesarrollo") res.send( {tipodeUsuario, autorizacion} )
            else res.send( {tipodeUsuario, autorizacion:"Ninguna", })
        }
        else res.json({mensaje:"El Cliente No Existe"})
 } catch (error) {
    res.send(error)
 }
})


servidorAutorizacion.get("/borrarAuth/:clienteId", async (req, res)=>{
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


module.exports = {checkAutorizacion, checkManejodeUsuarios, servidorAutorizacion};