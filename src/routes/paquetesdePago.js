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

const { checkPago, crearPago } = require("../middleware/checkPago");
const tipoOperacion = require("../models/tipoOperacion");

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

server.post("/nuevoPago", async (req, res) => {
  try {
    const { orgId, mesesPagados, idPaquetedePagoAComprar } = req.body;
    const resultado = await crearPago(orgId, mesesPagados, idPaquetedePagoAComprar);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json(error);
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
        paquete.fechaFinOferta = "2026-12-31";
        await paquete.save();
        res.json("Paquete Renovado")
    } catch (error) {
        res.json(error)
    }
});

module.exports = server;
