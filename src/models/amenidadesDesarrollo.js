const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "AmenidadesDesarrollo", 
    {
        nombre:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true 
        },
        icon: {
            type: DataTypes.STRING,
            allowNull: true
        }, 
        libreria: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'amenidades_desarrollos',
        timestamps: false,
    });
}