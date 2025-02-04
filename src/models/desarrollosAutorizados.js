const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "DesarrollosAutorizados", 
    {
        nombre:{
            type: DataTypes.STRING,
        },       
    }, {
    timestamps: false,
    });
}