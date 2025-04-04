const {literal, DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        'ModeloAsociadoAlDesarrollo', 
    {
        id:{
            type:DataTypes.UUID,
            primaryKey:true,
            unique:true,
            defaultValue: DataTypes.UUIDV4,
        },
        nombreModelo:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: false
        },
        precio:{
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        recamaras:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        baños:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        medio_baño:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        espaciosCochera:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        cocheraTechada:{
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        niveles:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        m2Construccion:{
            type:DataTypes.FLOAT,
            allowNull:true
        },
        m2Terreno:{
            type:DataTypes.FLOAT,
            allowNull:true
        },
        m2Patios:{
            type:DataTypes.FLOAT,
            allowNull:true
        },
        añodeConstruccion:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        numeroInterior:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        posicion:{
            type: DataTypes.JSON,
            allowNull: true,
        },
        publicada:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue:false,
        },
        tipodeDesarrollo:{
            type:DataTypes.ENUM("Modelo"),
            defaultValue:"Modelo"
        }
    },
    {
        tableName: 'modelos_asociados_a_los_desarrollos',
        timestamps: false,
    });
}