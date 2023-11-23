//Direccionamiento con Express
    //https://expressjs.com/es/guide/routing.html
    
    const express = require('express');
    const app = express();
    const cors = require('cors');
    var passport = require('passport');
    var Sequelize = require("sequelize");
    const session = require('express-session');
    var crypto = require('crypto');
    
    const { ImagenRoute } = require('./src/routes/imgPropiedad');
    const { PropiedadRoute } = require('./src/routes/propiedad');
    const { ApikeysRoute } = require('./src/routes/Apikeys');
    const { DBConstantsRoute } = require('./src/routes/dBConstants');
    const { authClienteRoute } = require('./src/routes/authCliente');

    const { Cliente, SesionCliente } = require("./src/db");

    var SequelizeStore = require("connect-session-sequelize")(session.Store);
    var sequelize = new Sequelize("database", "username", "password", {
        dialect: "sqlite",
        storage: "./session.sqlite",
    });

    /* imagen: require("./imgPropiedad"),
    propiedad:require("./propiedad"),
    autCliente:require("./authCliente"),
    dbconstants:require("./dBConstants"),
    apikeys:require("./Apikeys"), */
    const { index, clientes, imagen, propiedad, authCliente, dbconstants, apikeys, favoritos } = require('./src/routes');
    
    /* app.METHOD(PATH, HANDLER)
    app es una instancia de express.
    METHOD es un método de solicitud HTTP.
    PATH es una vía de acceso en el servidor.
    HANDLER es la función que se ejecuta cuando se correlaciona la ruta. */

    // app.use([path,] callback [, callback...])    --> http://expressjs.com/es/api.html#app.use
    //   nos permite montar middlewares a la ruta especificada  
    //                                  si no se espcifican rutas se montara el middleware en toda la aplicacion
    
    
        var corsOptions = {
            origin: 'http://localhost:3000',
            credentials: true };
    app.use(cors(corsOptions))
    app.use(express.json()); //  -->  habilitamos objetos json con el metodo express.json   
    app.use(express.urlencoded({ extended: true }));
    
    app.use(express.static('public')) // --> habilitamos archivos estaticos con el middleware express.static
        //para crear un prefijo en la ruta 
    app.use("/assets", express.static(__dirname + "/public"));
    //El único parámetro que recibe static es el nombre del directorio donde están los archivos estáticos, en nuestro ejemplo están en /public.
    
    var myStore = new SequelizeStore({
        db: sequelize,
    });

    app.use(
        session({
            secret: "secretomexa",
            store: myStore,
            cookie: { maxAge: 600000 },
            resave: false, // we support the touch method so per the express-session docs this should be set to false
            saveUninitialized: false,
            proxy: true, // if you do SSL outside of node.
        })
    );
    
    app.get('/', function(req, res, next) {
        if (req.session.views) {
          req.session.views++
          /* res.setHeader('Content-Type', 'text/html')
          res.write('<p>views: ' + req.session.views + '</p>')
          res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
          res.write('<p>username: ' + req.session.username + '</p>') */
          const views = req.session.views;
          const id = req.session.username;
          const esunalocura = req.session.esunalocura;
          res.json({views, esunalocura})
        } else {
          req.session.views = 1
          res.end('welcome to the session demo. refresh!')
        }
      })
    /* myStore.sync();

    app.use(passport.initialize());
    
    app.use(passport.session()); */
    /* var corsOptions = {
        origin: 'http://localhost:3000/signin',
        optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
      } */
    app.get('/usuario', function(req, res, next) {
        if (req.session.username) {
          const views = req.session.views;
          const esunalocura = req.session.esunalocura;
          const username = req.session.username;
          console.log(req.session)
          res.send(req.session)
        } else {
          req.session.views = 1
          req.session.username = "Ocatavio"
          res.end('welcome to the session demo. refresh!')
        }
      })

    app.get("/", (req,res) => {
        res.send("Hola, el servidor esta activo");
    });
    app.use( (req, res, next) => {
        console.log('req.session', req.session);
        return next();
      });
    /* var LocalStrategy = require('passport-local');

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

    passport.serializeUser(function(user, cb) {
        console.log("Usuario en Serialize " + JSON.stringify(user))
        process.nextTick(function() {
          cb(null, user);
        });
      });

    passport.deserializeUser(function(user, cb) {
        console.log("33 Deserialize Id " + user.id);
        process.nextTick(function() {
            return cb(null, user);
        });
    }); */



    

    /* app.post('/login/password',
        passport.authenticate('local', { failureRedirect: 'http://localhost:3000/login', failureMessage: true }),
        function(req, res) {
            console.log("SI ESTA AUTORIZADO");
            console.log("Req en Login -> "+JSON.stringify(req.user) + " SESSION " +JSON.stringify(req.session))
            const IdCliente= {IdCliente:req.user.id}
            res.json(IdCliente);
        });

    function isAuthenticated(req, res, next) {
        console.log("Req en isAuthenticated -> "+JSON.stringify(req.user) + " SESSION " +JSON.stringify(req.session))
        if(req.isAuthenticated()) {
            next(); // pasa a la ruta
        } else {
            console.log("Usuario no autenticado");
            res.redirect('/http://localhost:3000/login');
        }
    }

    app.get('/profile',
        isAuthenticated, // se pasa por middleware de autenticacion
        function(req, res){
            console.log("GetUser Recibido")
            res.json({ user: req.user });
        }
    ); */
    app.use("/", authCliente);

    //habilitamos todos los metodos HTTP en la ruta
    //app.use("/auth", authCliente );
    app.use("/clientes", clientes);
    app.use("/propiedades", propiedad);
    app.use("/imagenpropiedad", imagen);
    app.use("/Apikeys", apikeys );
    app.use("/dbConstants", dbconstants);
    app.use("/favoritos", favoritos);
    //app.use("/authCliente", authCliente);

    /* app.use("/propiedades", PropiedadRoute);
    app.use("/imagenpropiedad", ImagenRoute);
    app.use("/Apikeys", ApikeysRoute );
    app.use("/dbConstants", DBConstantsRoute); */

    //Error handling middleware
    app.use(function (err, req, res, next) {
        console.error(err);
        res.status(err.status || 500).send(err.message);
    });
    
    module.exports = app;
    