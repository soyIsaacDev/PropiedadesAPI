const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        'Desarrollo', 
    {
        id:{
            type:DataTypes.UUID,
            primaryKey:true,
            unique:true,
            defaultValue: DataTypes.UUIDV4,
        },
        nombreDesarrollo:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true 
        },
        precioMin:{
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        precioMax:{
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        añodeConstruccion:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        calle:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        numeroPropiedad:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        posicion:{
            type: DataTypes.JSON,
            allowNull: true,
        },
        publicada:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue:false,
        },
        tipodeDesarrollo:{
            type:DataTypes.ENUM("Desarrollo"),
            defaultValue:"Desarrollo"
        }
    }, 
    {
        tableName: 'desarrollos', // Nombre de la tabla en minúsculas
        timestamps: false,
    });
}