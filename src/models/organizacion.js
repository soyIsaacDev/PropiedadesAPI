const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "Organizacion", 
    {
        id:{
            type:DataTypes.UUID,
            unique:true,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        organizacion:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true 
        }        
    }, {
        tableName: 'organizaciones',
        timestamps: false,
    });
}