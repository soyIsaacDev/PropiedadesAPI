const server = require("express").Router();
//const req = require("express/lib/request");
const { Cliente, TipodeUsuario } = require("../db");

server.post("/nuevoCliente", async (req, res) => { 
  try {
    const { userId, nombre, email, telefono, sexo, dia_de_nacimiento, mes_de_nacimiento,
      año_de_nacimiento, planeacion_compra} = req.body;
    
    const cliente = await Cliente.findOrCreate({
        where: {
          userId
        },
        defaults: {
          nombre,
          email,
          telefono,
          sexo,
          dia_de_nacimiento,
          mes_de_nacimiento,
          año_de_nacimiento, 
          planeacion_compra
        }      
    });

    const userTipo = await TipodeUsuario.findOrCreate({
      where: {
        userId
      },
      defaults: {
        tipo:"Cliente"
      }      
    });
    
    console.log(cliente + "User Tipo " + userTipo);
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

server.get("/buscarCliente/:userId", async (req, res) => {
  try {
    let {userId} = req.params;
    const cliente= await Cliente.findOne({
      where:{userId}
    });

    cliente? res.json(cliente) : res.json({mensaje:"El Cliente No Existe"});
  } catch (error) {
    res.send(error);
  }
})

module.exports = server;