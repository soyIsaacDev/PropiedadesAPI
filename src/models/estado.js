const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "Estado", 
    {
        estado:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true 
        }        
    }, {
    timestamps: false,
    });
}