const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "Equipamiento", 
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
        tableName: 'equipamiento',
    timestamps: false,
    });
}