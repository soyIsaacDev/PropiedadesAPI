const { parse } = require("dotenv");
const { Cliente, TipodeUsuario,  } = require("../db");
const servidorAutorizacion = require("express").Router();
const { Op } = require("sequelize");

const checkAutorizacion = async (req, res, next)  => {
    try {
        let userId = "";
        let email = "";
        
        const bodyObj = req.body.data;
        // Si los datos vienen de un formData
        if(bodyObj){
          const parsedbodyObj = JSON.parse(bodyObj);
          userId = parsedbodyObj.userId;
          email = parsedbodyObj.email;
        }
        // los datos vienen en el body del request
        else{
          userId = req.body.userId;
          email = req.body.email;
        }        
        
        console.log("REVISANDO AUTORIZACION "+userId)
        const cliente= await Cliente.findOne({
          where:{[Op.or]:{
            userId,
            email
          }},            
        });

        if(cliente === null) {
            res.json({mensaje:"El Cliente No Existe"});
            return;
        }
        
        const tipodeUsuario = await TipodeUsuario.findOne({
            where:{
                id:cliente.TipodeUsuarioId
            }
        })

        req.auth = cliente.autorizaciondePublicar;
        req.tipodeUsuario = tipodeUsuario.tipo;
        req.manejaUsuarios = tipodeUsuario.manejaUsuarios;
        req.orgId = cliente.OrganizacionId

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
        console.log("Error en checkAutorizacion"+e);
        res.send("Error en checkAutorizacion"+e)
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
    console.log("Autorizacion del Usuario "+ req.auth)
    res.json({
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