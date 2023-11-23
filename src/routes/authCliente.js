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

    crypto.pbkdf2(password, cliente.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) { return cb(err); }
      if (!crypto.timingSafeEqual(cliente.contraseñaHashed, hashedPassword)) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }
      return cb(null, cliente);
    });
  } catch (e) {
     return cb(e)
  }

}));

server.get("/revisarauth/:username/:password/:usuario/:contra", async (req,res)=> {
  try {
    const {username, password, usuario, contra} = req.params;
    
    var salt = crypto.randomBytes(16);
    

    var saltBuffer = Buffer.from(salt, "base64")
    
    const newCliente = await Cliente.findOrCreate({
      where: { usuario },
      defaults:{
        usuario,
        salt
      }
    });

    const cliente = await Cliente.findOne({
      where:{usuario:username}
    });
    //const hashedpassclientebuff = Buffer.from(cliente.contraseñaHashed, "base64");
    const hashedsaltclientebuff = Buffer.from(cliente.salt, "base64");
    const lasal= cliente.salt;

    res.json({saltBuffer, lasal});
    
  } catch (error) {
    res.send(error)
  }

})
passport.serializeUser(function(user, cb) {
  console.log("Usuario en Serialize " + JSON.stringify(user))
  process.nextTick(function() {
    cb(null, user);
  });
});

/* passport.serializeUser( (userObj, done) => {
  console.log("Usuario en Serialize " + JSON.stringify(userObj))
  done(null, userObj)
}) */

/* passport.deserializeUser((id, done) => {
  console.log("Deserialize Id " + id);
  Cliente.findOne(id)
    .then(user => done(null, user))
    .catch(err => done(err));
}); */

passport.deserializeUser(function(user, cb) {
  console.log("33 Deserialize Id " + id);
  process.nextTick(function() {
    return cb(null, user);
  });
});

server.post('/login/password',
  passport.authenticate('local', { failureRedirect: 'http://localhost:3000/login', failureMessage: true }),
  function(req, res) {
    console.log("SI ESTA AUTORIZADO");
    console.log("Req en Login -> "+JSON.stringify(req.user) + " SESSION " +JSON.stringify(req.session))
    const IdCliente= {IdCliente:req.user.id}
    res.json(IdCliente);
});



server.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    console.log("DESLOGGEADO")
  });
});


server.post('/signup', function(req, res, next) {
  const { nombre, usuario, contraseña } = req.body
  req.session.username = usuario;
  var salt = crypto.randomBytes(16);

  var saltBuffer = Buffer.from(salt, "base64")
  crypto.pbkdf2(contraseña, saltBuffer, 310000, 32, 'sha256', async function(err, hashedPassword) {
    if (err) { return next(err); }
   
      const cliente = await Cliente.findOrCreate({
        where: { usuario },
        defaults:{
          usuario,
          contraseñaHashed: hashedPassword,
          salt:salt
        }
      });

    console.log("Cliente Nuevo "+cliente);

    /* if (err) { return next(err); }

    var user = {
      id: this.lastID,
      username: usuario
    };
    req.login(user, function(err) {
      if (err) { return next(err); }
      console.log("Usuario new" + user )
      res.redirect('/');
    }); */  
  },
  function(err) {
    if (err) { return next(err); }
    var user = {
      id: this.lastID,
      username: req.body.username
    };
    req.login(user, function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  }
  );
});

// Middleware que verifica si esta autenticado
/* function isAuthenticated(req, res, next) {
  console.log("Req en isAuthenticated -> "+JSON.stringify(req.user) + " SESSION " +JSON.stringify(req.session))
  if(req.isAuthenticated()) {
    next(); // pasa a la ruta
  } else {
    console.log("Usuario no autenticado");
    res.redirect('/login');
  }
} */

function isAuthenticated (req, res, next) {
  console.log("77 En IS AUTH " +req.session.passport)
  if (req.session.passport.user) {
    console.log("79 SI ESTA Authenticado ")
    next()}
  else next('route')
}

server.post('/getUser', isAuthenticated, async (req, res) => {
  console.log('GetUser' );
  const cliente = await Cliente.findByPk(req.session.passport.user.id);
  res.json(cliente)
})

module.exports = server;