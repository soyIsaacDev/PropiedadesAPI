const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "Agente", 
    {
        nombre:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true 
        },
        apellidoP:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true 
        },
        apellidoM:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true 
        },
        Email:{
            type: DataTypes.STRING
        },
        Telefono:{
            type: DataTypes.STRING
        }
        
    }, {
    timestamps: false,
    });
}