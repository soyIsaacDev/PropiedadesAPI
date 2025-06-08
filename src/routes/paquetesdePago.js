const server = require("express").Router();

const {
  Agente,
  Organizacion,
  AgenteDeDesarrollo,
  PaquetedePago,
  HistorialdePagos,
  Autorizacion,
  TipodePropiedad,
  AutorizacionesXTipodeOrg,
  PaquetePagoPorOrg,
} = require("../db");

const formatDateYMD = (date) => {
  // Convert the date to ISO string
  const isoString = date.toISOString();
  // Split at the "T" character to get the date part
  const formattedDate = isoString.split("T")[0];
  return formattedDate;
};

const { checkPago } = require("../middleware/checkPago");
const tipoOperacion = require("../models/tipoOperacion");

// Se actualizo la forma de validad que una organizacion esta autorizada a usar un paquete de pago.
// Esto se hace a la hora de dar de alta el cliente
// Se valida que AutorizacionesXTipodeOrg existen y se asigna la autorizacion en base al tipo de organizacion

/* server.get("/", async (req, res) => {
  try {
    const crearOrg = await Organizacion.create({
      organizacion: "Velox",
    });

    crearAgente.OrganizacionId = crearOrg.id;
    crearAgente.save();

    const paquetePago1Gratis = await PaquetedePago.create({
      nombrePaquete: "Gratis",
      precio: 0.0,
      tipodeOperacion: "Venta/Renta",
      periodicidad: "Mensual",
      cantidaddePropiedades: 1,
      tipodePago: "Gratuito",
      tipodeDesarrollo: "Individual",
      tiempodeConstruccion: "ConUso",
      fechaInicioOferta: "2025-01-01",
      fechaFinOferta: "2025-04-01",
    });

    res.send(crearAgente);
  } catch (e) {}
}); */

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

server.get("/paquetes", async (req, res) => {
  try {
    const paquetes = await PaquetedePago.findAll();
    res.send(paquetes);
  } catch (e) {
    res.send(e);
  }
});


server.get("/statusdePaquete", async (req, res) => {
  try {
    const paquete = await PaquetedePago.findOne({
      where: {
        nombrePaquete: "Gratis",
      },
    });

    const hoy = new Date();
    const fechahoy = formatDateYMD(hoy);

    if (paquete.fechaFinOferta > fechahoy) {
      res.send("PAQUETE ACTIVO");
    } else {
      res.send("RENOVAR PAQUETE");
    }
  } catch (e) {
    res.send(e);
  }
});

server.get("/nuevoPago", async (req, res) => {
  try {
    /* Validaciones a hacer:
            Revisamos si ya se encuentra pagado el mismo paquete en el periodo actual
            Revisando si el paquete de pago existe
            Revisamos si el paquete aun se encuentra activo
    */
    const orgId = "6521961c-1a27-4cec-956a-e0891faa577f";
    //const orgId =   "b5b986c7-b2e9-45fa-8087-eda07c1b22ae";
    const mesesPagados = 3;
    const idPaquetedePagoAComprar = 3;

    const historial = await HistorialdePagos.findAll({
      where: {
        OrganizacionId: orgId,
      },
      order: [["fechaFin", "DESC"]],
    });

    const validacion = {
      orgActiva: "La organizacion no existe",
      paqueteExistente: "No existe ese paquete de pagos",
      paqueteActivo: "El paquete se encuentra inactivo",
    };
    const hoy = new Date();
    // Revisamos si ya se encuentra pagado el mismo paquete en el periodo actual
    for (let i = 0; i < historial.length; i++) {
      let fechaFinHistorial = new Date(historial[i].fechaFin);
      let hoy = new Date();
      if (
        hoy < fechaFinHistorial &&
        historial[i].PaquetedePagoId === idPaquetedePagoAComprar
      ) {
        res.json("Tienes un paquete del mismo tipo ya pagado");
        return;
      } else {
        validacion.pagoPrevio = 1;
      }
    }
    const fechaFindePago = new Date();
    fechaFindePago.setMonth(fechaFindePago.getMonth() + mesesPagados);

    const organizacion = await Organizacion.findOne({
      where: { id: orgId },
      include: AutorizacionesXTipodeOrg,
    });
    const paquetedePago = await PaquetedePago.findOne({
      where: { id: idPaquetedePagoAComprar }
    });
    //VALIDACIONES
    if (organizacion) validacion.orgActiva = 1;
    // Revisando si el paquete de pago existe
    if (paquetedePago) validacion.paqueteExistente = 1;
    // Revisamos si el paquete aun se encuentra activo
    if (new Date(paquetedePago.fechaFinOferta) >= fechaFindePago)
      validacion.paqueteActivo = 1;
    //}

    // Todas las validaciones son correctas
    if (
      validacion.orgActiva === 1 &&
      validacion.paqueteExistente === 1 &&
      validacion.paqueteActivo === 1
    ) {
      console.log("Validaciones Correctas");
      const nuevoPago = await HistorialdePagos.create({
        fechaInicio: hoy,
        fechaFin: fechaFindePago,
        OrganizacionId: orgId,
        PaquetedePagoId: idPaquetedePagoAComprar,
      });
      res.json(nuevoPago);
    } else res.json(validacion);
  } catch (e) {
    res.send(e);
  }
});

server.get("/nuevopaquetedepago", async (req, res) => {
  try {
    const nuevoPaquete = {
      tipodeOrg: "TratoDirecto",
      nombrePaquete: "TratoDirecto",
      precio: 0,
      periodicidad: "Mensual",
      tipodePago: "Gratuito",
      fechaInicioOferta: "2025-01-01",
      fechaFinOferta: "2025-05-31",
    };

    const paqueteCreado = await PaquetedePago.create({
      nombrePaquete: nuevoPaquete.nombrePaquete,
      precio: nuevoPaquete.precio,
      periodicidad: nuevoPaquete.periodicidad,
      tipodePago: nuevoPaquete.tipodePago,
      fechaInicioOferta: nuevoPaquete.fechaInicioOferta,
      fechaFinOferta: nuevoPaquete.fechaFinOferta,
    });
    console.log(paqueteCreado);

    res.json(paqueteCreado);
  } catch (e) {
    res.send(e);
  }
});

server.get("/renovarPaquetedePago", async (req, res) => {
    try {
        const paquete = await PaquetedePago.findByPk(3);
        paquete.fechaFinOferta = "2025-10-31";
        await paquete.save();
        res.json("Paquete Renovado")
    } catch (error) {
        res.json(error)
    }
});

module.exports = server;
