const server = require("express").Router();

const { ExampleModel } = require("../db");

server.post("/creaerpropiedad", async (req, res) => { 
    try {
      const { nombre, calle, colonia} = req.body;
      const propiedad = await ExampleModel.findOrCreate({
          where: {
            nombre
          },
          defaults: {
            calle,
            colonia
          }      
      });
      res.json(propiedad);
    } catch (error) {
      res.send(error);
    }
});

server.get("/usuarios", async (req, res) => {
  try {
    const usuario = await ExampleModel.findAll({
    });
    res.json(usuario);
  } catch (error) {     
    res.send(error);
  }
});

module.exports =  server;

  
module.exports = {
  rutaEjempo: server
}