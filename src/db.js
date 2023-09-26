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

modelAgente(sequelize);
modelPropiedad(sequelize);
modelImgPropiedad(sequelize);

let {Agente, Propiedad, ImgPropiedad} = sequelize.models;

// Relaciones DB

ImgPropiedad.belongsTo(Propiedad);
Propiedad.hasOne(ImgPropiedad);

module.exports = {
  ...sequelize.models,
    db: sequelize,
}