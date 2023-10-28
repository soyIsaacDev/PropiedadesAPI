const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "AmenidadesPropiedad", 
    {
        nombreAmenidad:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true 
        }        
    }, {
    timestamps: false,
    });
}