const { types } = require('pg');
const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "PropiedadIndependiente", 
    {
        id:{
            type:DataTypes.UUID,
            unique:true,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        precio:{
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        calle:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        numeroPropiedad:{
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
        niveles:{
            type: DataTypes.INTEGER,
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
        publicada:{
            type: DataTypes.ENUM("Si","No"),
            allowNull: true
        },
        tratoDirecto:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue:false,
        },
        tipodeDesarrollo:{
            type:DataTypes.ENUM("Independiente"),
            defaultValue:"Independiente"
        }
    }, 
    {
        tableName: 'propiedades_independientes',
        timestamps: false,
    });
}