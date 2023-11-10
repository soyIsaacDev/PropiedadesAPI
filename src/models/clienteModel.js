const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "Cliente", 
    {
        nombre:{
            type: DataTypes.STRING,
            allowNull: true
        },
        usuario:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        contraseñaHashed:{
            type: DataTypes.STRING
        },
        salt:{
            type: DataTypes.STRING
        }
    }, {
    timestamps: false,
    });
}