const server = require("express").Router();

const { AmenidadesPropiedad } = require("../db");

server.post("/agregarAmenidadPropiedad", async (req, res) => { 
  try {
      const { nombreAmenidad } = req.body;
        console.log("Amenidad Recibida "+ nombreAmenidad)
      const AmenidadCreada = await AmenidadesPropiedad.findOrCreate({
        where:{ nombreAmenidad }
      })
    res.json(AmenidadCreada)
  } catch (error) {
    res.send(error);
  }
});

server.get("/AmenidadesPropiedad", async (req, res) => { 
    try {
      const Amenidades = await AmenidadesPropiedad.findAll()
      res.json(Amenidades)
    } catch (error) {
      res.send(error);
    }
  });

module.exports =  server;
  
module.exports = {
  AmenidadesRoute: server
}