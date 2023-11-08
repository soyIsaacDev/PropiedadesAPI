const server = require("express").Router();
//const req = require("express/lib/request");
const { Cliente } = require("../db");


server.post("/nuevoCliente", async (req, res) => { 
  try {
    const { nombre, usuario, contraseña } = req.body;
    
    const cliente = await Cliente.findOrCreate({
        where: {
          usuario
        },
        defaults: {
          nombre,
          contraseña
        }      
    });
    console.log(cliente)
    res.json(cliente);
  } catch (error) {
    res.send(error);
  }
});

server.get("/clientes", async (req,res)=> {
  try{
    const cliente = await Cliente.findAll({
      
    });
    res.json(cliente);
  }
  catch(e){
    res.send(e);
  }
});

server.get("/cliente/:id", async (req, res) => {
  try {
    let {id} = req.params;
    const client= await Clientefinal.findOne({
      where:{id}
    });
    res.json(client);
  } catch (error) {
    res.send(error);
  }
})

module.exports = server;