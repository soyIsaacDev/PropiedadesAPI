const { Sequelize } = require("sequelize");
require("dotenv").config();

const dbEngine = process.env.DB_ENGINE;
const dbUserName = process.env.DB_USER;
const dbPasword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME

const connectionString = `${dbEngine}://${dbUserName}:${dbPasword}@${dbHost}:${dbPort}/${dbName}`;
const sequelize = new Sequelize(connectionString, {
  logging: false, //Loging Deshabilitado
});

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


let {Agente, Propiedad, ImgPropiedad, TipodePropiedad, AmenidadesDesarrollo, AmenidadesPropiedad, 
  TipoOperacion, Estado , Municipio, Ciudad} = sequelize.models;

// Relaciones DB


Propiedad.hasMany(ImgPropiedad);
ImgPropiedad.belongsTo(Propiedad);

Propiedad.hasOne(TipodePropiedad);
TipodePropiedad.hasMany(Propiedad);

Propiedad.belongsToMany(AmenidadesDesarrollo, { through: 'AmenidadesDesarrollo-Propiedad' });
AmenidadesDesarrollo.belongsToMany(Propiedad, { through: 'AmenidadesDesarrollo-Propiedad' });

Propiedad.belongsToMany(AmenidadesPropiedad, { through: 'AmenidadesPropiedad-Amenidad' });
AmenidadesPropiedad.belongsToMany(Propiedad, { through: 'AmenidadesPropiedad-Amenidad' });

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



module.exports = {
  ...sequelize.models,
    db: sequelize,
}