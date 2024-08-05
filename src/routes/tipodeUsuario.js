const server = require("express").Router();
const { TipodeUsuario, Cliente } = require("../db");

server.get("/usuarioPrincipal", async (req,res)=> {
  try{
    const userPrincipal = await TipodeUsuario.findOne({ 
      where: { 
        userId:"n7v1k7heCzbhiiZ1hUtJpmea8Hv1" 
      } 
    })
    userPrincipal.tipo="DueñoIsaacBM";
    await userPrincipal.save();
    const cliente = await Cliente.findOne({
      where: { 
        userId:"n7v1k7heCzbhiiZ1hUtJpmea8Hv1" 
      } 
    })
   cliente.TipodeUsuarioId = userPrincipal.id;
    await cliente.save();
    res.json(userPrincipal);
  }
  catch(e){
    res.send(e);
  }
});

server.post("/nuevoUsuario", async (req, res) => { 
    try {
      const {userId, tipo } = req.body;
      
      const userTipo = await TipodeUsuario.findOrCreate({
          where: {
            userId
          },
          defaults: {
            tipo
          }      
      });
      console.log(userTipo)
      res.json(userTipo);
    } catch (error) {
      res.send(error);
    }
  });

module.exports = server;