const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "Municipio", 
    {
        municipio:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true 
        }        
    }, {
        tableName: 'municipios',
        timestamps: false,
    });
}