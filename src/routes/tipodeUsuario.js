const server = require("express").Router();
const { TipodeUsuario, Cliente, TipodeOrganizacion } = require("../db");

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


/*
YA ESTA EN BULK
server.get("/nuevoTipodeUsuario", async (req, res) => { 
  try {
    //const tiposdeUsuario = await TipodeUsuario.create(
    const tiposdeUsuario = await TipodeUsuario.bulkCreate([
      {
        tipo:"DueñoIsaacBoMiquirray",
        giro:"Todos", 
        manejaUsuarios:"Si",
        tipodeOperacionAut:"Todas",
        cantidadPropVenta:90000,
        cantidadPropRenta:90000,
        cantidadPropPreVenta:90000,
      }, 
       {
        tipo:"Desarrollador",
        giro:"Habitacional", 
        manejaUsuarios:"Si",
        tipodeOperacionAut:"Venta",
        cantidadPropVenta:100,
        cantidadPropRenta:100,
        cantidadPropPreVenta:0,
      },
      
      {
        tipo:"Desarrollador",
        giro:"Comercial", 
        manejaUsuarios:"Si",
        tipodeOperacionAut:"Venta",
        cantidadPropVenta:100,
        cantidadPropRenta:100,
        cantidadPropPreVenta:0,
        
      },
      
      {
        tipo:"Desarrollador",
        giro:"HabitacionalyComercial", 
        manejaUsuarios:"Si",
        tipodeOperacionAut:"Venta",
        cantidadPropVenta:100,
        cantidadPropRenta:100,
        cantidadPropPreVenta:0,
      },
      
      {
        tipo:"Desarrollador",
        giro:"Mixto", 
        manejaUsuarios:"Si",
        tipodeOperacionAut:"Venta",
        cantidadPropVenta:100,
        cantidadPropRenta:100,
        cantidadPropPreVenta:0,
      },
      
      {
        tipo:"Desarrollador",
        giro:"Todos", 
        manejaUsuarios:"Si",
        tipodeOperacionAut:"Venta",
        cantidadPropVenta:100,
        cantidadPropRenta:100,
        cantidadPropPreVenta:0,
      },
      {
        tipo:"AgentedeDesarrollo",
        giro:"Todos",
        manejaUsuarios:"No",
        tipodeOperacionAut:"Venta",
        cantidadPropVenta:100,
        cantidadPropRenta:100,
        cantidadPropPreVenta:0,
      },
      {
        tipo:"ClienteFinal", 
        giro:"Todos",
        manejaUsuarios:"No",
        tipodeOperacionAut:"NoAutorizado",
        cantidadPropVenta:0,
        cantidadPropRenta:0,
        cantidadPropPreVenta:0,
      },
      {
        tipo:"DueñodePropiedad",
        giro:"Todos",
        manejaUsuarios:"No",
        tipodeOperacionAut:"VentayRenta",
        cantidadPropVenta:1,
        cantidadPropRenta:1,
        cantidadPropPreVenta:0,
      }, 
       {
        tipo:"Arquitecto", 
        giro:"Habitacional",
        manejaUsuarios:"No",
        tipodeOperacionAut:"",
        cantidadPropVenta:"",
      },
      {
        tipo:"Arquitecto", 
        giro:"Comercial",
        manejaUsuarios:"No",
        tipodeOperacionAut:"",
        cantidadPropVenta:"",
      },
      
      {
        tipo:"Arquitecto", 
        giro:"HabitacionalyComercial",
        manejaUsuarios:"No",
        tipodeOperacionAut:"",
        cantidadPropVenta:"",
      },
      {
        tipo:"Arquitecto", 
        giro:"Mixto",
        manejaUsuarios:"No",
        tipodeOperacionAut:"",
        cantidadPropVenta:"",
      },
      {
        tipo:"Arquitecto", 
        giro:"Todos",
        manejaUsuarios:"No",
        tipodeOperacionAut:"",
        cantidadPropVenta:"",
      },
      {
        tipo:"Constructor", 
        giro:"Comercial",
        manejaUsuarios:"No",
        tipodeOperacionAut:"",
        cantidadPropVenta:"",
      },      
      {
        tipo:"Constructor", 
        giro:"HabitacionalyComercial",
        manejaUsuarios:"No",
        tipodeOperacionAut:"",
        cantidadPropVenta:"",
      },
      {
        tipo:"Constructor", 
        giro:"Mixto",
        manejaUsuarios:"No",
        tipodeOperacionAut:"",
        cantidadPropVenta:"",
      },
      {
        tipo:"Constructor", 
        giro:"Todos",
        manejaUsuarios:"No",
        tipodeOperacionAut:"",
        cantidadPropVenta:"",
      }, */
      
      /* {
        tipo:"Agente", 
        giro:"Habitacional",
        manejaUsuarios:"No",
        tipodeOperacionAut:"",
        cantidadPropVenta:"",
      },
      
      {
        tipo:"Agente", 
        giro:"Comercial",
        manejaUsuarios:"No",
        tipodeOperacionAut:"",
        cantidadPropVenta:"",
      },
      {
        tipo:"Agente", 
        giro:"HabitacionalyComercial",
        manejaUsuarios:"No",
        tipodeOperacionAut:"",
        cantidadPropVenta:"",
      },
      {
        tipo:"Agente", 
        giro:"Mixto",
        manejaUsuarios:"No",
        tipodeOperacionAut:"",
        cantidadPropVenta:"",
      },
      {
        tipo:"Agente", 
        giro:"Todos",
        manejaUsuarios:"No",
        tipodeOperacionAut:"",
        cantidadPropVenta:"",
      }, 
    ])
    
    res.send(tiposdeUsuario);
  } catch (error) {
    res.send(error);
  }
}); */

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