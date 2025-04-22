const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "EstiloArquitectura", 
    {
        nombreEstilo:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true 
        }        
    }, {
        tableName: 'estilos_de_arquitectura',
        timestamps: false,
    });
}