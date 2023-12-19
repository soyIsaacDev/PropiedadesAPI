//Direccionamiento con Express
    //https://expressjs.com/es/guide/routing.html
    
    const express = require('express');
    const app = express();
    const cors = require('cors');
    var passport = require('passport');
    var Sequelize = require("sequelize");
    const session = require('express-session');
    
    /* const { ImagenRoute } = require('./src/routes/imgPropiedad');
    const { PropiedadRoute } = require('./src/routes/propiedad');
    const { ApikeysRoute } = require('./src/routes/Apikeys');
    const { DBConstantsRoute } = require('./src/routes/dBConstants');
    const { authClienteRoute } = require('./src/routes/authCliente'); */


    /* var SequelizeStore = require("connect-session-sequelize")(session.Store);
    var sequelize = new Sequelize("database", "username", "password", {
        dialect: "sqlite",
        storage: "./session.sqlite",
    }); */

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
        origin: 'https://dadinumco-front-muqyons65q-uc.a.run.app/',
        optionsSuccessStatus: 200,
        credentials: true };
    
    app.use(cors(corsOptions))
    app.use(express.json()); //  -->  habilitamos objetos json con el metodo express.json   
    app.use(express.urlencoded({ extended: true }));
    
    app.use(express.static('public')) // --> habilitamos archivos estaticos con el middleware express.static
        //para crear un prefijo en la ruta 
    app.use("/assets", express.static(__dirname + "/public"));
    //El único parámetro que recibe static es el nombre del directorio donde están los archivos estáticos, en nuestro ejemplo están en /public.
    
    /* var myStore = new SequelizeStore({
        db: sequelize,
    }); */

    /* app.use(
        session({
            secret: "secretomexa",
            //store: myStore,
            cookie: { maxAge: 600000 },
            resave: false, // we support the touch method so per the express-session docs this should be set to false
            saveUninitialized: false,
            proxy: true, // if you do SSL outside of node.
        })
    ); */

    app.get("/", (req,res) => {
        res.send("Hola, el servidor esta activo");
    });
   
    function isAuthenticated (req, res, next) {
      console.log("77 En IS AUTH " +req.session.passport)
      if (req.session.passport.user) {
        console.log("79 SI ESTA Authenticado ")
        next()}
      else next('route')
    }

    //habilitamos todos los metodos HTTP en la ruta

    app.use("/", authCliente);
    app.use("/clientes", clientes);
    app.use("/propiedades", propiedad);
    app.use("/imagenpropiedad", imagen);
    app.use("/Apikeys", apikeys );
    app.use("/dbConstants", dbconstants);
    app.use("/favoritos", isAuthenticated, favoritos);
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
    