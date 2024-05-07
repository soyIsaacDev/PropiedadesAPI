const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "Cliente", 
    {
        userId:{
            type: DataTypes.STRING,
            allowNull: false 
        },
        nombre:{
            type: DataTypes.STRING,
            allowNull: false 
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false 
        },
        telefono:{
            type: DataTypes.STRING,
            allowNull: false
        },
        sexo:{
            type: DataTypes.ENUM("Masculino","Femenino"),
            allowNull: false
        },
        dia_de_nacimiento:{
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        mes_de_nacimiento:{
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        año_de_nacimiento:{
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        planeacion_compra:{
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {
    timestamps: false,
    });
}