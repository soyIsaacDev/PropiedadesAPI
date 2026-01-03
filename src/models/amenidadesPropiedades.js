const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "AmenidadesdelaPropiedad", 
    {
        nombreAmenidad:{
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
        //tipodeAmenidiad 
    }, {
        tableName: 'amenidades_propiedades',
    timestamps: false,
    });
}