const { Sequelize } = require("sequelize");
require("dotenv").config();

const DEVMODE = process.env.DEVELOPMENT;

const local_dbEngine = process.env.DB_ENGINE;
const local_dbUserName = process.env.DB_USER;
const local_dbPasword = process.env.DB_PASSWORD;
const local_dbHost = process.env.DB_HOST;
const local_dbPort = process.env.DB_PORT;
const local_dbName = process.env.DB_NAME

const dbEngine = process.env.CLOUD_DB_ENGINE;
const dbUserName = process.env.CLOUD_DB_USER;
const dbPasword = process.env.CLOUD_DB_PASSWORD;
const dbHost = process.env.CLOUD_DB_HOST;
const dbName = process.env.CLOUD_DB_NAME;
const port= process.env.CLOUD_DB_PORT;

var sequelize = 0;

if(DEVMODE === "local" || DEVMODE === "build"){
  const connectionString = `${local_dbEngine}://${local_dbUserName}:${local_dbPasword}@${local_dbHost}:${local_dbPort}/${local_dbName}`;

  sequelize = new Sequelize(connectionString, {
    logging: false, //Loging Deshabilitado
  });
}
else{
  sequelize = new Sequelize(`${dbName}`, `${dbUserName}`, `${dbPasword}`, {
    dialect: 'postgres',
    host: `${dbHost}`,
    port:`${port}`
  });
}

try {
  sequelize.authenticate();
  console.log("Conexion a la Base de Datos Exitosa.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

//Modelos DB
const modelOrganizacion = require("./models/organizacion.js");
const modelPropiedad = require("./models/propiedadModel");
const modelImgPropiedad = require("./models/imgPropiedad");
const modelTipodePropiedad = require("./models/tipodePropiedad");
const modelAmenidadesDesarrollo = require("./models/amenidadesDesarrollo");
const modelAmenidadPropiedad = require("./models/amenidadesPropiedad");
const modelTipodeOperacion = require("./models/tipoOperacion");
const modelEstado = require("./models/estado");
const modelMunicipio = require("./models/municipio");
const modelCiudad = require("./models/ciudad");
const modelColonia = require("./models/colonia");
const modelCliente = require("./models/clienteModel.js");
const modelModeloAsociadoPropiedad = require("./models/modeloAsociadoPropiedad");
const modelImgModeloAsociado = require("./models/imgModeloAsociado");
const modeloTipodeUsuario = require("./models/tipodeUsuario");
const modeloEstiloArquitectura = require("./models/estiloArquitectura.js");
const modelHisorialdePagos = require("./models/historialdePagos.js");
const modelPaquetedePago= require("./models/paquetedePago.js");
const modelTipodeOrganizacion = require("./models/tipodeOrganizacion.js");
const modelPropiedadIndependiente = require("./models/propiedadIndependiente.js");


modelOrganizacion(sequelize);
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
modelModeloAsociadoPropiedad(sequelize);
modelImgModeloAsociado(sequelize);
modeloTipodeUsuario(sequelize);
modeloEstiloArquitectura(sequelize);
modelHisorialdePagos(sequelize);
modelPaquetedePago(sequelize);
modelTipodeOrganizacion(sequelize);
modelPropiedadIndependiente(sequelize);


let {Propiedad, ImgPropiedad, TipodePropiedad, AmenidadesDesarrollo, AmenidadesPropiedad, 
  TipoOperacion, Estado , Municipio, Ciudad, Colonia, Cliente, ModeloAsociadoPropiedad,
  ImgModeloAsociado, TipodeUsuario, EstiloArquitectura, HistorialdePagos, PaquetedePago, 
  Organizacion, TipodeOrganizacion, PropiedadIndependiente
} = sequelize.models;

// Relaciones DB


Propiedad.hasMany(ImgPropiedad);
ImgPropiedad.belongsTo(Propiedad);

Propiedad.belongsTo(TipodePropiedad);
TipodePropiedad.hasMany(Propiedad);


Propiedad.belongsToMany(AmenidadesDesarrollo, { through: 'AmenidadesDesarrolloPropiedad' });
AmenidadesDesarrollo.belongsToMany(Propiedad, { through: 'AmenidadesDesarrolloPropiedad' });

ModeloAsociadoPropiedad.belongsToMany(AmenidadesPropiedad, { through: 'AmenidadesModeloAmenidad' });
AmenidadesPropiedad.belongsToMany(ModeloAsociadoPropiedad, { through: 'AmenidadesModeloAmenidad' });

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

Cliente.belongsToMany(Propiedad, { through: 'Favoritos' });
Propiedad.belongsToMany(Cliente, { through: 'Favoritos' });

Cliente.belongsToMany(ModeloAsociadoPropiedad, { through: 'ModelosFavoritos' });
ModeloAsociadoPropiedad.belongsToMany(Cliente, { through: 'ModelosFavoritos' });

Propiedad.hasMany(ModeloAsociadoPropiedad);
ModeloAsociadoPropiedad.belongsTo(Propiedad);

ModeloAsociadoPropiedad.hasMany(ImgModeloAsociado);
ImgModeloAsociado.belongsTo(ModeloAsociadoPropiedad);

Ciudad.hasMany(ModeloAsociadoPropiedad);
ModeloAsociadoPropiedad.belongsTo(Ciudad);

Estado.hasMany(ModeloAsociadoPropiedad);
ModeloAsociadoPropiedad.belongsTo(Estado);

TipodeUsuario.hasMany(Cliente);
Cliente.belongsTo(TipodeUsuario);

EstiloArquitectura.hasMany(Propiedad);
Propiedad.belongsTo(EstiloArquitectura);

Organizacion.hasMany(Cliente);
Cliente.belongsTo(Organizacion);

Organizacion.hasMany(Propiedad);
Propiedad.belongsTo(Organizacion);

Organizacion.hasMany(ModeloAsociadoPropiedad);
ModeloAsociadoPropiedad.belongsTo(Organizacion);

Organizacion.hasMany(HistorialdePagos);
HistorialdePagos.belongsTo(Organizacion);

PaquetedePago.hasOne(HistorialdePagos);
HistorialdePagos.belongsTo(PaquetedePago);

TipodeOrganizacion.belongsToMany(PaquetedePago, { through: 'PaquetePagoPorOrg' });
PaquetedePago.belongsToMany(TipodeOrganizacion, { through: 'PaquetePagoPorOrg' });

/* TipodeOrganizacion.hasOne(PaquetedePago);
PaquetedePago.belongsTo(TipodeOrganizacion);
*/

TipodeOrganizacion.hasMany(Organizacion);
Organizacion.belongsTo(TipodeOrganizacion);

module.exports = {
  ...sequelize.models,
    db: sequelize,
}