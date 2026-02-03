const { parse } = require("dotenv");
const { Cliente, TipodeUsuario, Aliado} = require("../db");
const servidorAutorizacion = require("express").Router();
const { Op } = require("sequelize");

// Revision de autorizaciones del usuario
// Se revisa primero a nivel Tipo de usuario
// Si el tipo de usuario permite publicar, entonces se verifica la autorizacion a nivel indivudual
const checkAutorizacion = async (req, res, next)  => {
    try {
      console.log("Revisando autorizacion")
        let userId = "";
        let email = "";
        
        const bodyObj = req.body.data;
        // Si los datos vienen de un formData
        if(bodyObj){
          const parsedbodyObj = JSON.parse(bodyObj);
          if(parsedbodyObj.userId) userId = parsedbodyObj.userId;
          if(parsedbodyObj.email) email = parsedbodyObj.email;
          console.log("Revisando autorizacion userId", userId, "email", email)
        }
        // los datos vienen en el body del request
        else{
          if(req.body.userId) userId = req.body.userId;
          if(req.body.email) email = req.body.email;
        }        
        
        console.log("REVISANDO AUTORIZACION "+userId + " email "+ email)
        const cliente= await Cliente.findOne({
          where:{[Op.or]:{
            userId,
            email
          }},            
        });

        const aliado = await Aliado.findOne({
          where:{userId}
        });

        if(cliente === null && aliado === null) {
            res.json({mensaje:"El Cliente No Existe"});
            return;
        }
        
        let tipodeUsuario = null;
        // Si es aliado
        if(aliado){
          tipodeUsuario = await TipodeUsuario.findOne({
              where:{
                  id:aliado.TipodeUsuarioId
              }
          })

          console.log("Tipo de usuario en Auth", tipodeUsuario.tipo)

        } 
        // Si es cliente
        else if(cliente){
          const tipodeUsuario = await TipodeUsuario.findOne({
              where:{
                  id:cliente.TipodeUsuarioId
              }
          })
        }
        // La autorizacion de publicar depende primero del tipo de usuario
        // Si el tipo de usuario permite publicar, entonces se verifica la autorizacion a nivel indivudual
        if(tipodeUsuario.autorizaciondePublicar === false){
          req.auth = "Ninguna";
        }
        else {
          req.auth = aliado? aliado.autorizaciondePublicar : cliente.autorizaciondePublicar;
        }

        req.tipodeUsuario = tipodeUsuario.tipo;
        req.manejaUsuarios = tipodeUsuario.manejaUsuarios;
        req.orgId = aliado? aliado.OrganizacionId : cliente.OrganizacionId;

        if(tipodeUsuario.autorizaciondePublicar === true && (aliado? aliado.autorizaciondePublicar : cliente.autorizaciondePublicar) !== "Ninguna") next()
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
        res.status(500).send("Error en checkAutorizacion"+e)
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