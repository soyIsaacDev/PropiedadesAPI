const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "ModelosAsociadosAutorizados", 
    {
        nombre:{
            type: DataTypes.STRING,
        },       
    }, {
    timestamps: false,
    });
}