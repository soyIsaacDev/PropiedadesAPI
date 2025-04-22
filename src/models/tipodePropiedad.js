const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "TipodePropiedad", 
    {
        tipoPropiedad:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true 
        }        
    }, {
        tableName: 'tipo_de_propiedades',
        timestamps: false,
    });
}