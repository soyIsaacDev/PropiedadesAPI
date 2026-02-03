const {DataTypes} = require ('sequelize');
// Aqui se confirma que la propiedad esta lista para publicarse
// El aliado principal debe confirmarse?
// NO ESTA LIGADA A BASE DE DATOS
module.exports = s => {
    s.define(
        "ConfirmaciondePropiedadAliado", 
    {
        id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        aliado_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        propiedad_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        confirmacion:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },  
        estado:{
            type: DataTypes.ENUM("Pendiente", "Aprobado", "Rechazado"),
            allowNull: false,
        },
        comentario:{
            type: DataTypes.TEXT,
            allowNull: true,
        },
        confirmado_por:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        fecha_solicitud:{
            type: DataTypes.DATE,
            allowNull: false,
        },
        fecha_confirmacion:{
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        tableName: 'confirmacion_propiedad_aliado',
        timestamps: false,
    });
}