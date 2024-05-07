const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "TipodeUsuario", 
    {
        tipo:{
            type: DataTypes.ENUM("DueñoIsaacBM","Desarrollador","Cliente"),
            allowNull: false
        },
        userId:{
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
    timestamps: false,
    });
}