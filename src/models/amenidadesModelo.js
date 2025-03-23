const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "AmenidadesModelo", 
    {
        nombreAmenidad:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true 
        }        
    }, {
        tableName: 'amenidades_modelos',
    timestamps: false,
    });
}