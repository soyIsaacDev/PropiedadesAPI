const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "AgenteDeDesarrollo", 
    {
        id:{
            type:DataTypes.UUID,
            unique:true,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        nombre:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: false 
        },
        apellidoP:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: false 
        },
        apellidoM:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true 
        },
        Email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true 
        },
        Telefono:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true 
        },
        tipo:{
            type: DataTypes.ENUM(
                "AgentedeDesarrollo",
            ),
            allowNull: false
        },
        escala:{
            type: DataTypes.ENUM(
                "Agente",
            ),
            allowNull: false
        },  
    }, {
    timestamps: false,
    });
}