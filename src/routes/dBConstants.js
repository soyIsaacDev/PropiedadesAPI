const server = require("express").Router();

const { Estado , Municipio, Ciudad } = require("../db");

server.post("/agregarEntidadGeografica", async (req, res) => { 
  try {
      const {estado, municipio, ciudad } = req.body;
      
      const EstadoCreado = await Estado.findOrCreate({
        where:{ estado }
      });
      console.log(EstadoCreado[0].id)
      const MunicipioCreado = await Municipio.findOrCreate({
        where:{ municipio}
      });
        MunicipioCreado[0].EstadoId = EstadoCreado[0].id;
        
        await MunicipioCreado[0].save();
        console.log("Municipo Creado "+MunicipioCreado[0].EstadoId)
      const CiudadCreada = await Ciudad.findOrCreate({
        where:{ ciudad }
      });
      /* CiudadCreada.MunicipioId= await MunicipioCreado.id
      await CiudadCreada.save(); */
    res.json({ EstadoCreado, MunicipioCreado, CiudadCreada });
  } catch (error) {
    res.send(error);
  }
});

module.exports =  server;
  
module.exports = {
  DBConstantsRoute: server
}