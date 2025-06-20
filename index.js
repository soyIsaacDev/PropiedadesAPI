//Direccionamiento con Express
    //https://expressjs.com/es/guide/routing.html
    
    const express = require('express');
    const app = express();
    const cors = require('cors');
    const multer = require('multer');
    /* var passport = require('passport');
    var Sequelize = require("sequelize");
    const session = require('express-session'); */
    
    /* const { ImagenRoute } = require('./src/routes/imgPropiedad');
    const { PropiedadRoute } = require('./src/routes/propiedad');
    const { ApikeysRoute } = require('./src/routes/Apikeys');
    const { DBConstantsRoute } = require('./src/routes/dBConstants');
    const { authClienteRoute } = require('./src/routes/authCliente'); */


    //var SequelizeStore = require("connect-session-sequelize")(session.Store);
    /* var sequelize = new Sequelize("database", "username", "password", {
        dialect: "sqlite",
        storage: "./session.sqlite",
    }); */

    const { index, clientes, imagen, desarrollo, dbconstants, apikeys, favoritos, modeloAsociadoAlDesarrollo,
       allPropiedades, bulk, tipoUsuario, addBucketCors, cargarPropMultiples, historialdePagos, 
       autorizacionUsuario, pagodeServicio, propIndependiente, paquetesdePago, editarPropiedades,
       borrarPropiedades, 
    } = require('./src/routes');

    const { checkAutorizacion } = require("./src/middleware/checkAutorizacion.js")
    const { checkPagosActivos, checkPublicacionesRestantesyAutxTipodeOrg, servidorPago } = require("./src/middleware/checkPago");
    
    const DEVMODE = process.env.DEVELOPMENT;
    var corsOptions= undefined;

    if(DEVMODE === "build"){
        corsOptions = {
            origin: [ 'http://localhost:3000', 'http://192.168.1.13:3000', 'http://192.168.100.2:3000', 
              'http://192.168.100.2:8081', 'http://localhost:8081', 'https://localhost:8081', 'http://192.168.18.3:8081',
              'http://192.168.1.9:8081',
            ],
            //importante: No dejar la ruta de origen con un "/" al final
            optionsSuccessStatus: 200,
            credentials: true 
        };
    }
    else{
        corsOptions = {
            origin: ['https://inmozz.com', 'https://www.inmozz.com', "https://m3inmuebles.com"],
            //importante: No dejar la ruta de origen con un "/" al final
            optionsSuccessStatus: 200,
            credentials: true 
        };
    }

    const path = require('path')
    const carpeta = path.join(__dirname, './uploads')

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, carpeta);
      },
      filename: (req, file, cb) => {
        // usando codificacion UTF8
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        cb(null, Date.now() + '_' + file.originalname);
      }
    });

    const multerUpload = multer({
      storage: storage,
      limits: {
        fileSize: 31 * 1024 * 1024, // no larger than 31mb
        fieldSize: 31 * 1024 * 1024 
      }
    })
    
    // uso de Multer para subir imagenes y datos en form-data
    const useMulter = (req, res, next) => {
      console.log("En Index UseMulter")
      multerUpload.single('imagenesfiles')(req, res, (err) => {
        if (err) {
          console.log("Error en multerUpload en Index "+err)
          const respuestaError = {
            codigo:0, 
            Mensaje:`Error al intentar crear la imagen`,
            Error:err.message
          }
          return res.status(400).json(respuestaError);
        }
        else next()
      })
    }
    /* app.METHOD(PATH, HANDLER)
    app es una instancia de express.
    METHOD es un método de solicitud HTTP.
    PATH es una vía de acceso en el servidor.
    HANDLER es la función que se ejecuta cuando se correlaciona la ruta. */

    // app.use([path,] callback [, callback...])    --> http://expressjs.com/es/api.html#app.use
    //   nos permite montar middlewares a la ruta especificada  
    //                                  si no se espcifican rutas se montara el middleware en toda la aplicacion
    
    app.use(cors(corsOptions))
    app.use(express.json({limit: '200000000' })); //  -->  habilitamos objetos json con el metodo express.json   
    app.use(express.urlencoded({ limit: '200000000', extended: true }));
    
    app.use(express.static('public')) // --> habilitamos archivos estaticos con el middleware express.static
        //para crear un prefijo en la ruta 
    app.use("/assets", express.static(__dirname + "/public"));
    //El único parámetro que recibe static es el nombre del directorio donde están los archivos estáticos, en nuestro ejemplo están en /public.
    
    /* var myStore = new SequelizeStore({
        db: sequelize,
    });

    app.use(
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
   
    

    //habilitamos todos los metodos HTTP en la ruta

    // Firebase Server side code.
const admin = require('firebase-admin');
//const Firebase_Service_Account = process.env.FIREBASE_SERVICE_ACCOUNT;
const FirebaseConfig = require('./pruebas-91a5d-firebase-adminsdk-pgcw7-03b1af47fc.js')

// The Firebase Admin SDK is used here to verify the ID token.
admin.initializeApp({
  credential: admin.credential.cert(FirebaseConfig)
});

function getIdToken(req) {
  // Parse the injected ID token from the request header.
  //console.log("Req Headers " + JSON.stringify(req.headers))
  const authorizationHeader = req.headers.authorization || '';
  const components = authorizationHeader.split(' ');
  return components.length > 1 ? components[1] : '';
}
 
/* function isAuthenticated (req, res, next) {
      console.log("77 En IS AUTH " +req.session.passport)
      if (req.session.passport.user) {
        console.log("79 SI ESTA Authenticado ")
        next()}
      else next('route')
    } */
function checkIfSignedIn(req, res, next) {
  console.log("Check if Signed In");
  const idToken = getIdToken(req);
  console.log("ID TOKEN " + idToken + " Lenght " + idToken.length)
  // Verify the ID token using the Firebase Admin SDK.
  // User already logged in. Redirect to profile page.
  if(idToken.length > 10){
    console.log("REVISANDO EL TOKEN")
    admin.auth().verifyIdToken(idToken).then((decodedClaims) => {
      // User is authenticated, user claims can be retrieved from
      //console.log(decodedClaims)
      // In this sample code, authenticated users are always redirected to
      // the profile page.
      console.log("USUARIO AUTENTICADO")
      next();
    }).catch((error) => {
      console.log("Error de Authenticacion " + error)
      res.json({
        codigo:0, 
        Mensaje:"Error de Authenticacion, por favor recarga la pagina",
        Error:error
      });
      //next();
    });
  }
}

/* async function checkTipoAutorizacion(req, res, next) {
  console.log("Checando tipo de autorizacion");
  //console.log("REQ"+req)
  try{
    const userPrincipal = await TipodeUsuario.findOne({ 
      where: { 
        userId:"n7v1k7heCzbhiiZ1hUtJpmea8Hv1", 
        tipo:"DueñoIsaacBM"
      } 
    })
    console.log("Usuario Principal "+JSON.stringify(userPrincipal))
    if(userPrincipal.tipo==="DueñoIsaacBM") next();
  }
  catch(e){
    res.json(e);
  }
} */

    //app.use("/", authCliente);
    
    app.use("/clientes", clientes); // Autorizacion para agregar usuarios revisada a nivel ruta
    app.use("/desarrollos", desarrollo);
    app.use("/imagenpropiedad", imagen);
    app.use("/Apikeys", apikeys );
    app.use("/dbConstants", dbconstants);
    app.use("/favoritos", favoritos);
    app.use("/modeloAsociadoPropiedad", modeloAsociadoAlDesarrollo);
    app.use("/allProp", /* checkIfSignedIn, */ allPropiedades);
    app.use("/propiedadesIndependientes", propIndependiente);
    app.use("/bulk", bulk);
    app.use("/tipodeUsuario", tipoUsuario);
    
    // Eliminar checkCantProps? Parece que el modo correcto esta en checkPago
    app.use("/corsAuth", addBucketCors);
    // Carga propiedades 1 x 1 para cargar imagenes de grandes tamaños y no saturar Cors
    app.use("/cargarPropMultiples", useMulter, checkAutorizacion, checkPagosActivos, 
      checkPublicacionesRestantesyAutxTipodeOrg, cargarPropMultiples),
    app.use("/editarPropiedad", useMulter, checkAutorizacion, checkPagosActivos, editarPropiedades ),
    //app.use("/editarPropiedad", editarPropiedades);
    app.use("/checkautorizacion", autorizacionUsuario),
    app.use("/revisarPagos", pagodeServicio),
    app.use("/paquetesdePago", paquetesdePago),
    app.use("/checkpago", servidorPago),
    app.use("/borrarPropiedaes", checkAutorizacion, borrarPropiedades),
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
    