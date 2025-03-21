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
        ref_id:{
            type:DataTypes.UUID,
            unique:true,
            defaultValue: DataTypes.UUIDV4,
        },
        publicada:{
            type: DataTypes.ENUM("Si","No"),
            allowNull: true
        },
        tipodeDesarrollo:{
            type:DataTypes.ENUM("Desarrollo"),
            defaultValue:"Desarrollo"
        }
    }, {
    timestamps: false,
    });
}