const { Cliente, TipodeUsuario,  } = require("../db");
const servidorAutorizacion = require("express").Router();

const checkAutorizacion = async (req, res, next)  => {
    try {
        const { userId} = req.body;
        console.log("REVISANDO AUTORIZACION "+userId)
        const cliente = await Cliente.findOne({
            where:{ userId:userId}
        });
        const tipodeUsuario = await TipodeUsuario.findOne({
            where:{
                id:cliente.TipodeUsuarioId
            }
        })
        
        req.auth = cliente.autorizaciondePublicar;
        req.tipodeUsuario = tipodeUsuario.tipo;
        req.manejaUsuarios = tipodeUsuario.manejaUsuarios;
        if(cliente.autorizaciondePublicar !== "Ninguna") next()
        else {
            console.log("EL USUARIO NO ESTA AUTORIZADO")
            res.json({
                tipodeUsuario:req.tipodeUsuario, 
                manejaUsuarios:req.manejaUsuarios,
                autorizaciondePublicar:req.auth
            })
        }
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

        if(tipodeUsuario.manejaUsuarios==="Si")
        {
            req.orgId = agentePrincipal.OrganizacionId;
            req.agentePrincipal = agentePrincipal.nombre;
            next();
        }  

       else res.send("Usuario No Autorizado");

    } catch(error){
        res.send(error)
    }
}

servidorAutorizacion.post("/revisarCaracteristicasUsuario", checkAutorizacion, async (req, res)=>{
 try {
    console.log(req.autorizaciondePublicar)
    res.send({
        tipodeUsuario:req.tipodeUsuario, 
        manejaUsuarios:req.manejaUsuarios,
        autorizaciondePublicar:req.auth
    })
    
 } catch (error) {
    res.send(error)
 }
})

servidorAutorizacion.get("/actualizar", async (req, res)=>{
  try{
      const cliente = await Cliente.findOne({
          where:{
              email:"borbonisaac@hotmail.com"
          }
      });
      cliente.autorizaciondePublicar = "Editar";
      await cliente.save(); 
      


      /* const tipodeUsuario = await TipodeUsuario.update(
        {manejaUsuarios:"Si"},
        {where:{
            tipo:"Desarrollador"
        }}
      ); */
      res.send(cliente)
  }
  catch(error){
    res.send(error)
  }
})


/* servidorAutorizacion.get("/borrarAuth/:clienteId", async (req, res)=>{
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
}) */


module.exports = {checkAutorizacion, checkManejodeUsuarios, servidorAutorizacion};