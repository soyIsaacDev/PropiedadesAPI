var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var server = express.Router();
var crypto = require('crypto');

const { Cliente, SesionCliente } = require("../db");


passport.use(new LocalStrategy(async function verify(username, password, cb) {
  try {
    const cliente= await Cliente.findOne({
      where:{usuario:username}
    });
    if (!cliente) { return cb(null, false, { message: 'Incorrect username or password.' });}
    const hashedpassclientebuff = Buffer.from(cliente.contraseñaHashed, "base64");
    const hashedsaltclientebuff = Buffer.from(cliente.salt, "base64");

    crypto.pbkdf2(password, hashedsaltclientebuff, 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) { return cb(err); }
      if (!crypto.timingSafeEqual(hashedpassclientebuff, hashedPassword)) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }
      return cb(null, cliente);
    });
  } catch (e) {
     return cb(e)
  }

}));

/* // Autenticando al usuario con estrategia local de Passport
passport.use(new LocalStrategy(
  async (username, password, cb) => {
    try {
      console.log("AQUI ES Auth");
      const cliente= await Cliente.findOne({
          where:{usuario:username}
        });
      console.log("cliente L-16"+ cliente)
      //console.log("USUARIO DE PASSPORT LOCAL  -->>"+user.nombre)
      if(!cliente) {
        console.log("USUARIO INCORRECTO");
        res.send({"Response": "Usuario No Existe o es Incorrecto"}); 
        return cb(null, false, { message: 'Incorrect username or password.' });
      }

      if(cliente){
          if(cliente.contraseña != password) {
            console.log("CONTRASEÑA INCORRECTA");
            return cb(null, false, { message: 'Incorrect password.' });
          }
          //Success Usuario 
          console.log("USUARIO DE PASSPORT LOCAL Loggeado Linea 60  -->>"+cliente.nombre + " ID "+ cliente.id)
          SesionAuth("LoggedIn", cliente.id)
          return cb(null, cliente);
        }
      
    } catch (error) {
      return cb(error);
    }
  }
)); */

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, usuario: user.username });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

/* const SesionAuth = async function(auth, id) { 
  try {
    if(auth=== "LoggedIn"){
      console.log("Paso por SesionAuth LoggedIn Linea 26");
      const sesion = await SesionCliente.findOrCreate({
        where:{ClienteId: id},
        defaults:{
          autenticated: auth
        }
    });
    console.log("SesionAuth Login-->>"+ sesion)
    return(sesion);  //VER COMO REGRESO LA SESION
    };
    
    if(auth=== "LoggedOut"){
      const sesion = await SesionCliente.findOne({
        where:{ClienteId: id}
      });
      sesion.autenticated = auth;
      await sesion.save();
      console.log("SesionAuth Logout-->>"+ sesion)
      return(sesion);
    };
    
  } catch (error) {
    return(error);
  }
}; */


/* server.post('/login/password',
  passport.authenticate('local', { 
    successRedirect: 'http://localhost:3000/altaPropiedad',
    failureRedirect: '/login' 
  })
); */

server.post('/login/password',
  passport.authenticate('local', { failureRedirect: 'http://localhost:3000/login', failureMessage: true }),
  function(req, res) {
    console.log("SI ESTA AUTORIZADO");
    console.log("Req en Login -> "+JSON.stringify(req.user))
    const IdCliente= {IdCliente:req.user.id}
    res.json(IdCliente);
});

server.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

/* server.get('/sesionCliente', async function(req, res) {
  try {
    const { username, password } = req.body;
    const user = await Cliente.findOne({
      where:{ usuario: username }
    });
    console.log("Cliente sesion L-66 " + user.id + user.contraseña);
    if(!user){
      res.send({"Response": "El Usuario No Existe o Es Incorrecto"}); 
      return
    }
    if(password != user.contraseña){
      console.log("Contraseña Incorrecta SesionCliente L-72")
      res.send({"Response": "Contraseña Incorrecta"}); 
      return}
    const sesion = await SesionCliente.findOne({
      where:{ClienteId: user.id}
    })
    console.log("Get ./SesionCliente Linea 78" + sesion);
    res.json(sesion)
  } catch (e) {
    res.json(e);
  }
});   */

/* server.post('/SesionCliente', async function(req, res) {
  try {
    const { username, password } = req.body;
    console.log("Linea 84 "+ username);
    const user = await Cliente.findOne({
      where:{ usuario: username }
    });
    if(!user){
      res.send({"Response": "El Usuario No Existe o Es Incorrecto"}); 
      return
    }
    console.log("Cliente Cliente sesion L-116  Usuario " + user.id  + " Contraseña " + user.contraseña)
    if(password != user.contraseña){
      console.log("Contraseña Incorrecta Sesion Cliente L-90")
      res.send({"Response": "Contraseña Incorrecta"}); 
      return}
    console.log("Sesion Cliente L-131  "+user.id)
    const sesion = await SesionCliente.findOne({
      where:{ClienteId: user.id},
      include: [
        {
          model: Cliente,
          attributes: ['nombre','usuario'],
        }
      ]
    });
    console.log("Sesion Cliente L-97  " + JSON.stringify(sesion))
    res.json(sesion)
  } catch (e) {
    res.json(e);
  }
  
});  */

server.get('/logout',
  async function(req, res){
    const {username} = req.body;
    const user = await Cliente.findOne({
      where:{ usuario: username }
    });
    SesionAuth("LoggedOut", user.id);
    
  });

server.post('/signup', function(req, res, next) {
  const { nombre, usuario, contraseña } = req.body
  var salt = crypto.randomBytes(16);
  crypto.pbkdf2(contraseña, salt, 310000, 32, 'sha256', async function(err, hashedPassword) {
    if (err) { return next(err); }
   
      const cliente = await Cliente.findOrCreate({
        where: { usuario },
        defaults:{
          usuario,
          contraseñaHashed: hashedPassword,
          salt
        }
      });

    
    if (err) { return next(err); }

    var user = {
      id: this.lastID,
      username: usuario
    };
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      console.log("Usuario new" + user )
      res.redirect('/');
    });  
  });
});

// Middleware que verifica si esta autenticado
function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    next(); // pasa a la ruta
  } else {
    console.log("Usuario no autenticado");
    res.redirect('/login');
  }
}

server.get('/profile',
  isAuthenticated, // se pasa por middleware de autenticacion
  function(req, res){
    console.log("GetUser Recibido")
    res.json({ user: req.user });
  });

module.exports = server;
