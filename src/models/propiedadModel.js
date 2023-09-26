const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "Propiedad", 
    {
        nombrePropiedad:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true 
        },
        precio:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        recamaras:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        baños:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        calle:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        colonia:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        numeroCasa:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        numeroInterior:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
    timestamps: false,
    });
}