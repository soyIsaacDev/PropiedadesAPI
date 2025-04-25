const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "UltimoContacto", 
    {
        userId:{
            type:DataTypes.STRING,
        },
        agenteId:{
            type:DataTypes.STRING, 
        }, 
        dia:{
            type: DataTypes.DATEONLY
        }        
    }, 
    {
        tableName: 'ultimo_contacto',
        timestamps: false,
    });
}