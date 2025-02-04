const server = require("express").Router();
const { TipodeUsuario, Cliente } = require("../db");

server.get("/usuarioPrincipal", async (req,res)=> {
  try{
    const userPrincipal = await TipodeUsuario.findOne({ 
      where: { 
        userId:"n7v1k7heCzbhiiZ1hUtJpmea8Hv1" 
      } 
    })
    userPrincipal.tipo="DueñoIsaacBM";
    await userPrincipal.save();
    const cliente = await Cliente.findOne({
      where: { 
        userId:"n7v1k7heCzbhiiZ1hUtJpmea8Hv1" 
      } 
    })
   cliente.TipodeUsuarioId = userPrincipal.id;
    await cliente.save();
    res.json(userPrincipal);
  }
  catch(e){
    res.send(e);
  }
});


server.get("/nuevoTipodeUsuario", async (req, res) => { 
  try {
    //const tiposdeUsuario = await TipodeUsuario.create(
    const tiposdeUsuario = await TipodeUsuario.bulkCreate([
      {
        tipo:"DueñoIsaacBoMiquirray",
        giro:"Todos", 
      }, 
       {
        tipo:"Desarrollador",
        giro:"Habitacional", 
      },
      
      {
        tipo:"Desarrollador",
        giro:"Comercial", 
      },
      
      {
        tipo:"Desarrollador",
        giro:"HabitacionalyComercial", 
      },
      
      {
        tipo:"Desarrollador",
        giro:"Mixto", 
      },
      
      {
        tipo:"Desarrollador",
        giro:"Todos", 
      },
      
      {
        tipo:"AgentedeDesarrollo",
        giro:"Todos",
      },
      
      {
        tipo:"Agente", 
        giro:"Habitacional",
      },
      
      {
        tipo:"Agente", 
        giro:"Comercial",
      },
      {
        tipo:"Agente", 
        giro:"HabitacionalyComercial",
      },
      {
        tipo:"Agente", 
        giro:"Mixto",
      },
      {
        tipo:"Agente", 
        giro:"Todos",
      },
      {
        tipo:"Arquitecto", 
        giro:"Habitacional",
      },
      {
        tipo:"Arquitecto", 
        giro:"Comercial",
      },
      
      {
        tipo:"Arquitecto", 
        giro:"HabitacionalyComercial",
      },
      {
        tipo:"Arquitecto", 
        giro:"Mixto",
      },
      {
        tipo:"Arquitecto", 
        giro:"Todos",
      },
      {
        tipo:"Constructor", 
        giro:"Comercial",
      },
      
      {
        tipo:"Constructor", 
        giro:"HabitacionalyComercial",
      },
      {
        tipo:"Constructor", 
        giro:"Mixto",
      },
      {
        tipo:"Constructor", 
        giro:"Todos",
      },
      {
        tipo:"ClienteFinal", 
        giro:"Todos",
      },
      {
        tipo:"DueñodePropiedad",
        giro:"Todos",
      }, 
    ])
    
    res.send(tiposdeUsuario);
  } catch (error) {
    res.send(error);
  }
});

/* server.get("/borrarUsuario", async (req, res) => {
  try {
    await TipodeUsuario.destroy({
      where:{
        giro:"Todos"
      }
    })
    res.send("Borrado")
  } catch (e) {
    res.send(e)
  }
}) */

module.exports = server;