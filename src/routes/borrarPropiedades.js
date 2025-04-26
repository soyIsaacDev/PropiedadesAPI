const server = require("express").Router();

const { Desarrollo, ModeloAsociadoAlDesarrollo, PropiedadIndependiente
} = require("../db");

server.post("/hardDeleteDesarrollo", async (req,res) => {
  try {
    const {id} = req.body
    const desarrollo = await Desarrollo.findOne({
      where:{id}
    })
    await desarrollo.destroy();
    res.json("BORRADO")
  } catch (error) {
    res.json(error)
  }
})

server.post("/hardDeleteModeloRelacionado", async (req,res) => {
  try {
    const {id} = req.body
    const modelo = await ModeloAsociadoAlDesarrollo.findOne({
      where:{id}
    })
    await modelo.destroy();
    res.json("BORRADO")
  } catch (error) {
    res.json(error)
  }
})

server.post("/hardDeletePropiedadIndependiente", async (req,res) => {
    try {
      const {id} = req.body
      const modelo = await PropiedadIndependiente.findOne({
        where:{id}
      })
      await modelo.destroy();
      res.json("BORRADO")
    } catch (error) {
      res.json(error)
    }
  })

module.exports =  server;