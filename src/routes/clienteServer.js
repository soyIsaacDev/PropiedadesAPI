const server = require("express").Router();
//const req = require("express/lib/request");
const { Cliente } = require("../db");
var crypto = require('crypto');
var passport = require('passport');

server.use(passport.initialize());
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

/* server.post('/signup', function(req, res, next) {
  const { nombre, usuario, contraseña } = req.body
  var salt = crypto.randomBytes(16);
  crypto.pbkdf2(contraseña, salt, 310000, 32, 'sha256', async function(err, hashedPassword) {
    if (err) { return next(err); }
   
      const cliente = await Cliente.findOrCreate({
        where: { usuario },
        defaults:{
          nombre, 
          usuario,
          contraseñaHashed: hashedPassword.toString('base64'),
          salt: salt.toString('base64')
        }
      });

    
    if (err) { return next(err); }

    var user = {
      id: this.lastID,
      username: usuario
    };
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      console.log("USUARIO SIGNUP " + user);
      res.redirect('/');
    });  
  });
}); */

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