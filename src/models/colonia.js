const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "Colonia", 
    {
        colonia:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true 
        }        
    }, {
        tableName: 'colonias',
        timestamps: false,
    });
}