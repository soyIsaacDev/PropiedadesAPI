const server = require("express").Router();
//const req = require("express/lib/request");
const { ClienteFirebase } = require("../db");

server.post("/nuevoCliente", async (req, res) => { 
  try {
    console.log("Nuevo Cliente")
    const { userId, telefono, sexo, fecha_de_nacimiento } = req.body;
    
    const cliente = await ClienteFirebase.findOrCreate({
        where: {
          userId
        },
        defaults: {
          telefono,
          sexo,
          fecha_de_nacimiento
        }      
    });
    /* const cliente = await ClienteFirebase.create({
      telefono:"6623611099",
      sexo:"F",         
      fecha_de_nacimiento:" April 19, 1984"    
    }); */
    console.log(cliente)
    res.json(cliente);
  } catch (error) {
    res.send(error);
  }
});

server.get("/clientes", async (req,res)=> {
  try{
    const cliente = await ClienteFirebase.findAll({
      
    });
    res.json(cliente);
  }
  catch(e){
    res.send(e);
  }
});

server.get("/buscarCliente/:userId", async (req, res) => {
  try {
    let {userId} = req.params;
    const client = await ClienteFirebase.findOne({
      where:{userId}
    });
    console.log("Cliente Consultado " + client)
    client? res.json(client) : res.json({mensaje:"El Cliente No Existe"});
  } catch (error) {
    res.send(error);
  }
})

module.exports = server;