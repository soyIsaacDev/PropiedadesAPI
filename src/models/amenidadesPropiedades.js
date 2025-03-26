const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "AmenidadesdelaPropiedad", 
    {
        nombreAmenidad:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true 
        }        
    }, {
        tableName: 'amenidades_propiedades',
    timestamps: false,
    });
}