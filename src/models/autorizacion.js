const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "Autorizacion", 
    {
        niveldeAutorizacion:{
            type: DataTypes.ENUM(
                "Ninguna",
                "Agregar",
                "Editar",                
                "Completa",
            ),
            allowNull: false
        },

        
    }, 
    {
    timestamps: false,
    });
}