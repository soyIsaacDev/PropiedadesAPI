const server = require("express").Router();
const { TipodeUsuario } = require("../db");

server.get("/usuarioPrincipal", async (req,res)=> {
  try{
    const userPrincipal = await TipodeUsuario.findOne({ 
      where: { 
        userId:"H1yDiPzVUHRpl2bMLNIujWl0xwN2" 
      } 
    })
    userPrincipal.tipo="DueñoIsaacBM";
    await userPrincipal.save();
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