var app = require("./index");
require("dotenv").config();
const { db } = require("./src/db");
const { createHttpsServer } = require("./src/utils/httpsServer");
const validateAppRequest = require("./src/middleware/validateAppRequest");
const limiter = require("./src/middleware/rateLimiter");

const PORT = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === 'Production';


//sequelize model synchronization
// model.sync(options)
//is an async function that returns a promise

/* User.sync() - This creates the table if it doesn't exist (and does nothing if it already exists)
User.sync({ force: true }) - This creates the table, dropping it first if it already existed
User.sync({ alter: true }) - This checks what is the current state of the table in the database (which columns it has,
             what are their data types, etc), and then performs the necessary changes in the table to make it match the model. */

/* db.beforeSync(async () => {
 await db.query('CREATE SEQUENCE IF NOT EXISTS custom_sequence CACHE 1');
}); */           
// (Es mejor una transaccion) Migrations is recomended for production
/* db.sync({ force:false, alter:false }).then(function () {
  app.listen(PORT, function () {
    console.log("Server is listening on PORT " + PORT);
  });
}); */

// Sincronización manual de la base de datos (comentada por ahora)
/* db.sync({ alter: true })
  .then(() => {
    console.log('Base de datos sincronizada');
  })
  .catch(err => {
    console.error('Error al sincronizar la base de datos:', err);
  }); */


// Middleware de autenticación mutua para producción
if (isProduction) {
  
  createHttpsServer(app, PORT);

  // Redirección HTTP a HTTPS (opcional)
  if (process.env.REDIRECT_HTTP === 'true') {
    app.use((req, res) => {
      res.redirect(`https://${req.headers.host}${req.url}`);
    });
    app.listen(80);
  }

  app.use(validateAppRequest);
  app.use(limiter);
} else {
  // Configuración para desarrollo (HTTP normal)
  app.listen(PORT, () => {
    console.log(`Servidor HTTP en desarrollo en el puerto ${PORT}`);
  });
  
  createHttpsServer(app, 8090);

  // Redirección HTTP a HTTPS (opcional)
  if (process.env.REDIRECT_HTTP === 'true') {
    app.use((req, res) => {
      res.redirect(`https://${req.headers.host}${req.url}`);
    });
    app.listen(80);
  }

  app.use(validateAppRequest);
  app.use(limiter);
  
}