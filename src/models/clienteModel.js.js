const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "Cliente", 
    {
        userId:{
            type: DataTypes.STRING,
            allowNull: true 
        },
        nombre:{
            type: DataTypes.STRING,
            allowNull: true 
        },
        email:{
            type: DataTypes.STRING,
            unique:true,
            allowNull: false 
        },
        telefono:{
            type: DataTypes.STRING,
            allowNull: true
        },
        sexo:{
            type: DataTypes.ENUM("Masculino","Femenino"),
            allowNull: true
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
        mostrar_Tour:{
            type:DataTypes.BOOLEAN,
            allowNull:true
        }
    }, {
    timestamps: false,
    });
}