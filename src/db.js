const { Sequelize } = require("sequelize");
require("dotenv").config();

/* const dbEngine = process.env.DB_ENGINE;
const dbUserName = process.env.DB_USER;
const dbPasword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME */

const dbEngine = process.env.CLOUD_DB_ENGINE;
const dbUserName = process.env.CLOUD_DB_USER;
const dbPasword = process.env.CLOUD_DB_PASSWORD;
const dbHost = process.env.CLOUD_DB_HOST;
const dbName = process.env.CLOUD_DB_NAME

//const connectionString = `${dbEngine}://${dbUserName}:${dbPasword}@${dbHost}:${dbPort}/${dbName}`;

/* const sequelize = new Sequelize(cloudConnectionString, {
  logging: false, //Loging Deshabilitado
}); */



  const dbConfig = {
    client: 'pg',
    connection: {
      dialect:'postgres',
      host: process.env.CLOUD_DB_HOST, // e.g. '127.0.0.1'
      port: process.env.CLOUD_DB_PORT, // e.g. '5432'
      user: process.env.CLOUD_DB_USER, // e.g. 'my-user'
      password: process.env.CLOUD_DB_PASSWORD, // e.g. 'my-user-password'
      database: process.env.CLOUD_DB_NAME, // e.g. 'my-database'
    }}
const sequelize = new Sequelize(dbConfig);

try {
  sequelize.authenticate();
  console.log("Conexion a la Base de Datos Exitosa.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

//Modelos DB

const modelAgente = require("./models/agenteModel");
const modelPropiedad = require("./models/propiedadModel");
const modelImgPropiedad = require("./models/imgPropiedadModel");
const modelTipodePropiedad = require("./models/tipodePropiedad");
const modelAmenidadesDesarrollo = require("./models/amenidadesDesarrollo");
const modelAmenidadPropiedad = require("./models/amenidadesPropiedad");
const modelTipodeOperacion = require("./models/tipoOperacion");
const modelEstado = require("./models/estado");
const modelMunicipio = require("./models/municipio");
const modelCiudad = require("./models/ciudad");
const modelColonia = require("./models/colonia");
const modelCliente = require("./models/clienteModel");
const modelSesionCliente = require("./models/sesionCliente");

modelAgente(sequelize);
modelPropiedad(sequelize);
modelImgPropiedad(sequelize);
modelTipodePropiedad(sequelize);
modelAmenidadesDesarrollo(sequelize);
modelAmenidadPropiedad(sequelize);
modelTipodeOperacion(sequelize);
modelEstado(sequelize);
modelMunicipio(sequelize);
modelCiudad(sequelize);
modelColonia(sequelize)
modelCliente(sequelize);
modelSesionCliente(sequelize);


let {Agente, Propiedad, ImgPropiedad, TipodePropiedad, AmenidadesDesarrollo, AmenidadesPropiedad, 
  TipoOperacion, Estado , Municipio, Ciudad, Colonia, Cliente, SesionCliente} = sequelize.models;

// Relaciones DB


Propiedad.hasMany(ImgPropiedad);
ImgPropiedad.belongsTo(Propiedad);

Propiedad.belongsTo(TipodePropiedad);
TipodePropiedad.hasMany(Propiedad);


Propiedad.belongsToMany(AmenidadesDesarrollo, { through: 'AmenidadesDesarrolloPropiedad' });
AmenidadesDesarrollo.belongsToMany(Propiedad, { through: 'AmenidadesDesarrolloPropiedad' });

Propiedad.belongsToMany(AmenidadesPropiedad, { through: 'AmenidadesPropiedadAmenidad' });
AmenidadesPropiedad.belongsToMany(Propiedad, { through: 'AmenidadesPropiedadAmenidad' });

TipoOperacion.hasMany(Propiedad);
Propiedad.belongsTo(TipoOperacion);

Estado.hasMany(Municipio);
Municipio.belongsTo(Estado);

Municipio.hasMany(Ciudad);
Ciudad.belongsTo(Municipio);

Estado.hasMany(Propiedad);
Propiedad.belongsTo(Estado);

Municipio.hasMany(Propiedad);
Propiedad.belongsTo(Municipio);

Ciudad.hasMany(Propiedad);
Propiedad.belongsTo(Ciudad);

Colonia.belongsToMany(Ciudad, { through: 'ColoniaCiudad' });
Ciudad.belongsToMany(Colonia, { through: 'ColoniaCiudad' });

Colonia.hasMany(Propiedad);
Propiedad.belongsTo(Colonia);

SesionCliente.belongsTo(Cliente);
Cliente.hasOne(SesionCliente);

Cliente.belongsToMany(Propiedad, { through: 'Favoritos' });
Propiedad.belongsToMany(Cliente, { through: 'Favoritos' });

module.exports = {
  ...sequelize.models,
    db: sequelize,
}