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
        precioMin:{
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        precioMax:{
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
        m2Construccion:{
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
        
        
    }, {
    timestamps: false,
    });
}