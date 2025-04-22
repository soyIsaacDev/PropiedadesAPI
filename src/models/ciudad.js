const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "Ciudad", 
    {
        ciudad:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true 
        }        
    }, {
        tableName: 'ciudades',
        timestamps: false,
    });
}