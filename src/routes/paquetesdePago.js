const server = require("express").Router();

const { Agente, Organizacion, AgenteDeDesarrollo, PaquetedePago, HistorialdePagos, Autorizacion, TipodePropiedad, AutorizacionesXTipodeOrg, PaquetePagoPorOrg } = require("../db");

const formatDateYMD = (date) => {
    // Convert the date to ISO string
    const isoString = date.toISOString();
    // Split at the "T" character to get the date part
    const formattedDate = isoString.split("T")[0];
    return formattedDate;
};

const {checkPago } = require("../middleware/checkPago");
const tipoOperacion = require("../models/tipoOperacion");

server.get("/", async (req,res)=> {
    try {
        
        const crearOrg = await Organizacion.create({
            organizacion:"Velox",
        });

        crearAgente.OrganizacionId=crearOrg.id;
        crearAgente.save();

        const paquetePago1Gratis = await PaquetedePago.create(
            {                
                nombrePaquete:"Gratis",
                precio:0.00,
                tipodeOperacion:"Venta/Renta",
                periodicidad:"Mensual",     
                cantidaddePropiedades:1, 
                tipodePago:"Gratuito",
                tipodeDesarrollo:"Individual",
                tiempodeConstruccion:"ConUso",
                fechaInicioOferta:"2025-01-01",
                fechaFinOferta:"2025-04-01",
            }
        )

        res.send(crearAgente)

    } catch (e) {
        
    }
});


/* Actualize las relaciones y formas de validar 
Por eso esta desactivado
server.get("/nuevopaquetedepago", async (req,res)=> {
    try {
      // Cambiar relacion en DB de TipodePropiedad a AutorizacionesXTipodeOrg
       const nuevoPaquete = {                
        nombrePaquete:"TratoDirecto",
        precio:0,
        tipodeOperacion:"VentaoRenta",
        periodicidad:"Mensual",     
        cantidaddePropiedades:1, 
        tipodePago:"Gratuito",
        tipodeDesarrollo:"Modelo",
        tiempodeConstruccion:"ConUso",
        fechaInicioOferta:"2025-01-01",
        fechaFinOferta:"2025-05-31",
        nombreTipoOrg:"TratoDirecto"
      } 
      const nuevoPaquete = {                
        nombrePaquete:"Desarrollador",
        precio:0,
        tipodeOperacion:"Venta",
        periodicidad:"Mensual",     
        cantidaddePropiedades:100, 
        tipodePago:"Gratuito",
        tipodeDesarrollo:"Desarrollo",
        tiempodeConstruccion:"Nuevo",
        fechaInicioOferta:"2025-01-01",
        fechaFinOferta:"2025-05-31",
        nombreTipoOrg:"Desarrolladora"
      }

      const validacion = {
        tipoOperacion:"El nuevoPaquete que intentas cargar No esta autorizado", 
        cantPropValidada:"La cantidad que intentas cargar No esta autorizada",
        tipodeDesarrollo:"El Tipo de Desarrollo No esta autorizado",
        tiempodeConstruccion:"El Tiempo de Construccion No esta autorizado",
      }
      
      const autorizacionesDeOrg = await AutorizacionesXTipodeOrg.findOne({
        where:{nombreTipoOrg:nuevoPaquete.nombreTipoOrg}
      })
      // Validaciones 
      console.log(nuevoPaquete.tipodeOperacion)
      console.log(autorizacionesDeOrg.tipodeOperacionAut)
      if(nuevoPaquete.tipodeOperacion === autorizacionesDeOrg.tipodeOperacionAut || autorizacionesDeOrg.tipodeOperacionAut === "Todas" ||
        nuevoPaquete.tipodeOperacion==="Venta" && autorizacionesDeOrg.tipodeOperacionAut === "VentayRenta" ||
        nuevoPaquete.tipodeOperacion==="Renta" && autorizacionesDeOrg.tipodeOperacionAut === "VentayRenta"
       ) {
        validacion.tipoOperacion = "Autorizado OK";
        if(nuevoPaquete.tipodeOperacion === "Venta"){
          if(autorizacionesDeOrg.cantidadPropVenta >= nuevoPaquete.cantidaddePropiedades) validacion.cantPropValidada = nuevoPaquete.cantidaddePropiedades;
        }
        if(nuevoPaquete.tipodeOperacion === "Renta" &&  autorizacionesDeOrg.tipodeOperacionAut==="VentayRenta"){
          if(autorizacionesDeOrg.cantidadPropRenta >= nuevoPaquete.cantidaddePropiedades) validacion.cantPropValidada = nuevoPaquete.cantidaddePropiedades;
        }
        if(nuevoPaquete.tipodeOperacion === "VentaoRenta" &&  autorizacionesDeOrg.tipodeOperacionAut==="VentaoRenta"){
            if(autorizacionesDeOrg.cantidadPropRenta >= nuevoPaquete.cantidaddePropiedades) validacion.cantPropValidada = nuevoPaquete.cantidaddePropiedades;
        }
        if(nuevoPaquete.tipodeOperacion === "PreVenta"){
          if(autorizacionesDeOrg.cantidadPropPreVenta >= nuevoPaquete.cantidaddePropiedades) validacion.cantPropValidada = nuevoPaquete.cantidaddePropiedades;
        }
      }

      if(nuevoPaquete.tipodeDesarrollo === autorizacionesDeOrg.tipodeDesarrolloAut) validacion.tipodeDesarrollo = "Autorizado OK";
      
      if(nuevoPaquete.tiempodeConstruccion === autorizacionesDeOrg.tiempodeConstruccionAut) validacion.tiempodeConstruccion = "Autorizado OK";
    
    // Todas las validaciones son correctas
    if( validacion.tipoOperacion === "Autorizado OK" && validacion.cantPropValidada >0  && validacion.tipodeDesarrollo === "Autorizado OK" && validacion.tiempodeConstruccion === "Autorizado OK"){
      console.log("Validaciones Correctas" + validacion.cantPropValidada)
        const paqueteCreado = await PaquetedePago.create(
        {                
          nombrePaquete:nuevoPaquete.nombrePaquete,
          precio:nuevoPaquete.precio,
          tipodeOperacion:nuevoPaquete.tipodeOperacion,
          periodicidad:nuevoPaquete.periodicidad,     
          cantidaddePropiedades:validacion.cantPropValidada, 
          tipodePago:nuevoPaquete.tipodePago,
          tipodeDesarrollo:nuevoPaquete.tipodeDesarrollo,
          tiempodeConstruccion:nuevoPaquete.tiempodeConstruccion,
          fechaInicioOferta:nuevoPaquete.fechaInicioOferta,
          fechaFinOferta:nuevoPaquete.fechaFinOferta,
        })
        const paquetes = await PaquetePagoPorOrg.create({
            AutorizacionesXTipodeOrgId:autorizacionesDeOrg.id,
            PaquetedePagoId:paqueteCreado.id
        });
        res.json(paqueteCreado )
      }
      else res.json(validacion)
    
    } catch (e) {
        res.send(e)
    }
}) */
   

server.get("/RelacionPaquetePagoPorOrg", async(req,res)=>{
    try {

        const paquetes = await PaquetePagoPorOrg.create({
            AutorizacionesXTipodeOrgId:"31b4efa7-1535-4422-bf87-0dcd4aab8ddc",
            PaquetedePagoId:1
        });
        const paquetes2 = await PaquetePagoPorOrg.create({
            AutorizacionesXTipodeOrgId:"31b4efa7-1535-4422-bf87-0dcd4aab8ddc",
            PaquetedePagoId:2
        });
        res.send(paquetes)
    } catch (e) {
        res.send(e)
    }
})

/* server.get("/paquetepagoGratis", async (req,res)=> {
    try {
        const paquetePago1Gratis = await PaquetedePago.create(
            {                
                nombrePaquete:"Gratis",
                precio:0.00,
                tipodeOperacion:"Venta/Renta",
                periodicidad:"Mensual",     
                cantidaddePropiedades:1, 
                tipodePago:"Gratuito",
                tipodePropiedad:"Individual",
                tiempodeConstruccion:"ConUso",
                fechaInicioOferta:"2025-01-01",
                fechaFinOferta:"2025-04-01",
            }
        )

    res.send(paquetePago1Gratis )
    } catch (e) {
        res.send(e)
    }
}) */

server.get("/paquetes", async(req,res)=>{
    try {
        const paquetes = await PaquetedePago.findAll();
        res.send(paquetes)
    } catch (e) {
        res.send(e)
    }
})

server.get("/paquetesConTipoOrg", async(req,res)=>{
    try {
      const paquetedePago = await PaquetedePago.findOne({
        where:{id:1},
        include:AutorizacionesXTipodeOrg
      });
      res.send(paquetedePago)
    } catch (e) {
        res.send(e)
    }
})

server.get("/statusdePaquete", async(req,res)=>{
    try {
        const paquete = await PaquetedePago.findOne({
            where:{
                nombrePaquete:"Gratis"
            }
        })
    
        const hoy = new Date();
        const fechahoy = formatDateYMD(hoy);

        if(paquete.fechaFinOferta>fechahoy){
            res.send("PAQUETE ACTIVO");
        }
        else {
            res.send("RENOVAR PAQUETE");
        }
    } catch (e) {
        res.send(e)
    }
})

server.get("/nuevoPago", async(req,res)=>{
    try {
        const orgId = "b7b986c7-b2e9-45fa-8087-eda07c1b22ae";
        //const orgId =   "b5b986c7-b2e9-45fa-8087-eda07c1b22ae";
        const mesesPagados = 3;
        const idPaquetedePagoAComprar = 2;

        const historial = await HistorialdePagos.findAll({
            where:{
                OrganizacionId:orgId
            },
            order: [
                ['fechaFin','DESC']
            ],
        })
           
        const validacion = {
            
           orgActiva:"La organizacion no existe",
           paqueteExistente:"No existe ese paquete de pagos",
           autorizacionOrg:"La organizacion no esta autorizada a usar ese paquete",
           paqueteActivo:"El paquete se encuentra inactivo",
        }

        const hoy = new Date();
        // Revisamos si ya se encuentra pagado el mismo paquete en el periodo actual
        for (let i = 0; i < historial.length; i++) {
            let fechaFinHistorial = new Date(historial[i].fechaFin);
            let hoy = new Date();
            if(hoy < fechaFinHistorial && historial[i].PaquetedePagoId === idPaquetedePagoAComprar ){
                res.json("Tienes un paquete del mismo tipo ya pagado");
                return;
            }
            else {
                validacion.pagoPrevio = 1;
            }
        }
    
       const fechaFindePago = new Date();
       fechaFindePago.setMonth(fechaFindePago.getMonth() + mesesPagados);
       
       const organizacion = await Organizacion.findOne({
         where:{id:orgId},
         include:AutorizacionesXTipodeOrg
       })
       
       const paquetedePago = await PaquetedePago.findOne({
         where:{id:idPaquetedePagoAComprar},
         include:AutorizacionesXTipodeOrg
       });
       console.log(paquetedePago.AutorizacionesXTipodeOrgs)
       //VALIDACIONES
       if(organizacion) validacion.orgActiva = 1;
       // Revisando si el paquete de pago existe
       if(paquetedePago) validacion.paqueteExistente = 1;
       //Revisamos si el tipo de organizacion esta autorizada a ese paquete de pago
       for (let i = 0; i < paquetedePago.AutorizacionesXTipodeOrgs.length; i++) {
        if(organizacion && organizacion.AutorizacionesXTipodeOrgId === paquetedePago.AutorizacionesXTipodeOrgs[i].id) validacion.autorizacionOrg = 1; 
       }
       // Revisamos si el paquete aun se encuentra activo
       if(new Date(paquetedePago.fechaFinOferta) >= fechaFindePago) validacion.paqueteActivo = 1;
        //}

       // Todas las validaciones son correctas 
       if( validacion.orgActiva===1 && validacion.paqueteExistente === 1 && validacion.autorizacionOrg === 1 && validacion.paqueteActivo === 1){
        console.log("Validaciones Correctas")    
        const nuevoPago = await HistorialdePagos.create(
                {               
                    fechaInicio:hoy,
                    fechaFin:fechaFindePago,
                    OrganizacionId:orgId,
                    PaquetedePagoId:idPaquetedePagoAComprar, 
                }
            )
            res.json(nuevoPago)
        }
        else res.json(validacion);
    } catch (e) {
        res.send(e)
    }
})

server.get("/nuevopaquetedepago", async (req,res)=> {
    try {
      const nuevoPaquete = {   
        tipodeOrg:"TratoDirecto",             
        nombrePaquete:"TratoDirecto",
        precio:0,
        periodicidad:"Mensual",     
        tipodePago:"Gratuito",
        fechaInicioOferta:"2025-01-01",
        fechaFinOferta:"2025-05-31",
      }

    const paqueteCreado = await PaquetedePago.create(
    {                
      nombrePaquete:nuevoPaquete.nombrePaquete,
      precio:nuevoPaquete.precio,
      periodicidad:nuevoPaquete.periodicidad,     
      tipodePago:nuevoPaquete.tipodePago,
      fechaInicioOferta:nuevoPaquete.fechaInicioOferta,
      fechaFinOferta:nuevoPaquete.fechaFinOferta,
    });
    console.log(paqueteCreado)

    const tipodeOrg = await AutorizacionesXTipodeOrg.findOne({
        where:{nombreTipoOrg:nuevoPaquete.tipodeOrg}
    })

    const paquetes = await PaquetePagoPorOrg.create({
        AutorizacionesXTipodeOrgId:tipodeOrg.id,
        PaquetedePagoId:paqueteCreado.id
    });
    
    res.json(paqueteCreado)
    } catch (e) {
        res.send(e)
    }
})

module.exports = server;