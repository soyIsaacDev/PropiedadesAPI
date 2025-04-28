const server = require("express").Router();

const { Desarrollo, ModeloAsociadoAlDesarrollo, PropiedadIndependiente
} = require("../db");

const autorizadoABorrar = async (req, res, next) => {
  try {
    const autorizacion = req.auth;
    if(autorizacion==="Completa") next();
    else {
      res.json("Usuario No Autorizado para Borrar")
    }
  } catch (error) {
    res.json(error)
  }
}

server.post("/hardDeleteDesarrollo", autorizadoABorrar, async (req,res) => {
  try {
    const {id} = req.body;
    const desarrollo = await Desarrollo.findOne({
      where:{id}
    })
    await desarrollo.destroy();
    res.json("BORRADO")
  } catch (error) {
    res.json(error)
  }
})

server.post("/hardDeleteModeloRelacionado", autorizadoABorrar, async (req,res) => {
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

server.post("/hardDeletePropiedadIndependiente", autorizadoABorrar, async (req,res) => {
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