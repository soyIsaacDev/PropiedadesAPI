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
            type: DataTypes.BLOB
        },
        salt:{
            type: DataTypes.BLOB
        }
    }, {
    timestamps: false,
    });
}