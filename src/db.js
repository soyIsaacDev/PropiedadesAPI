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
const modelDesarrollo = require("./models/desarrollo.js");
const modelImgDesarrollo = require("./models/imgDesarrollo.js");
const modelTipodePropiedad = require("./models/tipodePropiedad");
const modelAmenidadesDesarrollo = require("./models/amenidadesDesarrollo");
const modelAmenidadPropiedad = require("./models/amenidadesModelo.js");
const modelTipodeOperacion = require("./models/tipoOperacion");
const modelEstado = require("./models/estado");
const modelMunicipio = require("./models/municipio");
const modelCiudad = require("./models/ciudad");
const modelColonia = require("./models/colonia");
const modelCliente = require("./models/clienteModel.js");
const modelModeloAsociadoAlDesarrollo = require("./models/modeloAsociadoAlDesarrollo.js");
const modelImgModeloAsociado = require("./models/imgModeloAsociado");
const modeloTipodeUsuario = require("./models/tipodeUsuario");
const modeloEstiloArquitectura = require("./models/estiloArquitectura.js");
const modelHisorialdePagos = require("./models/historialdePagos.js");
const modelPaquetedePago= require("./models/paquetedePago.js");
const modelAutorizacionesXTipodeOrg = require("./models/autorizacionesXTipodeOrg.js");
const modelPropiedadIndependiente = require("./models/propiedadIndependiente.js");
const modelImgPropiedadIndependiente = require("./models/imgPropiedadIndependiente.js");


modelOrganizacion(sequelize);
modelDesarrollo(sequelize);
modelImgDesarrollo(sequelize);
modelTipodePropiedad(sequelize);
modelAmenidadesDesarrollo(sequelize);
modelAmenidadPropiedad(sequelize);
modelTipodeOperacion(sequelize);
modelEstado(sequelize);
modelMunicipio(sequelize);
modelCiudad(sequelize);
modelColonia(sequelize)
modelCliente(sequelize);
modelModeloAsociadoAlDesarrollo(sequelize);
modelImgModeloAsociado(sequelize);
modeloTipodeUsuario(sequelize);
modeloEstiloArquitectura(sequelize);
modelHisorialdePagos(sequelize);
modelPaquetedePago(sequelize);
modelAutorizacionesXTipodeOrg(sequelize);
modelPropiedadIndependiente(sequelize);
modelImgPropiedadIndependiente(sequelize);


let {Desarrollo, ImgDesarrollo, TipodePropiedad, AmenidadesDesarrollo, AmenidadesModelo, 
  TipoOperacion, Estado , Municipio, Ciudad, Colonia, Cliente, ModeloAsociadoAlDesarrollo,
  ImgModeloAsociado, TipodeUsuario, EstiloArquitectura, HistorialdePagos, PaquetedePago, 
  Organizacion, AutorizacionesXTipodeOrg, PropiedadIndependiente, ImgPropiedadIndependiente
} = sequelize.models;

// Relaciones DB

// Relaciones Desarrollo
Desarrollo.hasMany(ImgDesarrollo);
ImgDesarrollo.belongsTo(Desarrollo);

Desarrollo.belongsTo(TipodePropiedad);
TipodePropiedad.hasMany(Desarrollo);

Desarrollo.belongsToMany(AmenidadesDesarrollo, { through: 'amenidades_del_desarrollos', timestamps: false, });
AmenidadesDesarrollo.belongsToMany(Desarrollo, { through: 'amenidades_del_desarrollos', timestamps: false, });

TipoOperacion.hasMany(Desarrollo);
Desarrollo.belongsTo(TipoOperacion);

Estado.hasMany(Desarrollo);
Desarrollo.belongsTo(Estado);

Municipio.hasMany(Desarrollo);
Desarrollo.belongsTo(Municipio);

Ciudad.hasMany(Desarrollo);
Desarrollo.belongsTo(Ciudad);

Colonia.hasMany(Desarrollo);
Desarrollo.belongsTo(Colonia);

Cliente.belongsToMany(Desarrollo, { through: 'desarrollos_favoritos', timestamps: false, });
Desarrollo.belongsToMany(Cliente, { through: 'desarrollos_favoritos', timestamps: false, });

EstiloArquitectura.hasMany(Desarrollo);
Desarrollo.belongsTo(EstiloArquitectura);

// Relaciones Modelo

ModeloAsociadoAlDesarrollo.hasMany(ImgModeloAsociado);
ImgModeloAsociado.belongsTo(ModeloAsociadoAlDesarrollo);

ModeloAsociadoAlDesarrollo.belongsToMany(AmenidadesModelo, { through: 'amenidades_del_modelo', timestamps: false, });
AmenidadesModelo.belongsToMany(ModeloAsociadoAlDesarrollo, { through: 'amenidades_del_modelo', timestamps: false, });

Cliente.belongsToMany(ModeloAsociadoAlDesarrollo, { through: 'modelos_favoritos', timestamps: false, });
ModeloAsociadoAlDesarrollo.belongsToMany(Cliente, { through: 'modelos_favoritos', timestamps: false, });

Desarrollo.hasMany(ModeloAsociadoAlDesarrollo);
ModeloAsociadoAlDesarrollo.belongsTo(Desarrollo);

Ciudad.hasMany(ModeloAsociadoAlDesarrollo);
ModeloAsociadoAlDesarrollo.belongsTo(Ciudad);

Estado.hasMany(ModeloAsociadoAlDesarrollo);
ModeloAsociadoAlDesarrollo.belongsTo(Estado);


// Relaciones de Propiedad Independiente

PropiedadIndependiente.hasMany(ImgPropiedadIndependiente);
ImgPropiedadIndependiente.belongsTo(PropiedadIndependiente);

PropiedadIndependiente.belongsTo(TipodePropiedad);
TipodePropiedad.hasMany(PropiedadIndependiente);

PropiedadIndependiente.belongsToMany(AmenidadesModelo, { through: 'amenidades_de_la_prop_independiente', timestamps: false, });
AmenidadesModelo.belongsToMany(PropiedadIndependiente, { through: 'amenidades_de_la_prop_independiente', timestamps: false, });

TipoOperacion.hasMany(PropiedadIndependiente);
PropiedadIndependiente.belongsTo(TipoOperacion);

Estado.hasMany(PropiedadIndependiente);
PropiedadIndependiente.belongsTo(Estado);

Municipio.hasMany(PropiedadIndependiente);
PropiedadIndependiente.belongsTo(Municipio);

Ciudad.hasMany(PropiedadIndependiente);
PropiedadIndependiente.belongsTo(Ciudad);

Colonia.hasMany(PropiedadIndependiente);
PropiedadIndependiente.belongsTo(Colonia);

Cliente.belongsToMany(PropiedadIndependiente, { through: 'prop_independientes_favoritas', timestamps: false, });
PropiedadIndependiente.belongsToMany(Cliente, { through: 'prop_independientes_favoritas', timestamps: false, });

EstiloArquitectura.hasMany(PropiedadIndependiente);
PropiedadIndependiente.belongsTo(EstiloArquitectura);

Organizacion.hasMany(PropiedadIndependiente);
PropiedadIndependiente.belongsTo(Organizacion);

// Organizacion

AutorizacionesXTipodeOrg.hasMany(Organizacion);
Organizacion.belongsTo(AutorizacionesXTipodeOrg);

Organizacion.hasMany(Cliente);
Cliente.belongsTo(Organizacion);

Organizacion.hasMany(Desarrollo);
Desarrollo.belongsTo(Organizacion);

Organizacion.hasMany(ModeloAsociadoAlDesarrollo);
ModeloAsociadoAlDesarrollo.belongsTo(Organizacion);

Organizacion.hasMany(HistorialdePagos);
HistorialdePagos.belongsTo(Organizacion);

PaquetedePago.hasOne(HistorialdePagos);
HistorialdePagos.belongsTo(PaquetedePago);

/* AutorizacionesXTipodeOrg.belongsToMany(PaquetedePago, { through: 'PaquetePagoPorOrg' });
PaquetedePago.belongsToMany(AutorizacionesXTipodeOrg, { through: 'PaquetePagoPorOrg' }); */

TipodeUsuario.hasMany(Cliente);
Cliente.belongsTo(TipodeUsuario);

// Territorio
Estado.hasMany(Municipio);
Municipio.belongsTo(Estado);

Municipio.hasMany(Ciudad);
Ciudad.belongsTo(Municipio);

Colonia.belongsToMany(Ciudad, { through: 'colonia_por_ciudad', timestamps: false, });
Ciudad.belongsToMany(Colonia, { through: 'colonia_por_ciudad', timestamps: false, });

module.exports = {
  ...sequelize.models,
    db: sequelize,
}