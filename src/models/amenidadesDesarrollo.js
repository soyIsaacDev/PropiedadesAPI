const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "AmenidadesDesarrollo", 
    {
        nombreAmenidad:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true 
        }        
    }, {
        tableName: 'amenidades_desarrollos',
        timestamps: false,
    });
}