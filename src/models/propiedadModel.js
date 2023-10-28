const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "Propiedad", 
    {
        nombreDesarrollo:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true 
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
        calle:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        numeroCasa:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        numeroInterior:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        colonia:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        posicion:{
            type: DataTypes.JSON,
            allowNull: true,
        },
        m2Constriccion:{
            type:DataTypes.FLOAT,
            allowNull:true
        },
        m2Terreno:{
            type:DataTypes.FLOAT,
            allowNull:true
        },
        m2Total:{
            type:DataTypes.FLOAT,
            allowNull:true
        },
        añodeConstruccion:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        espaciosCochera:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        espaciosCocheraTechada:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
    timestamps: false,
    });
}