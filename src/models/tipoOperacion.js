const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "TipoOperacion", 
    {
        tipodeOperacion:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true 
        }        
    }, {
        tableName: 'tipo_de_operaciones',
        timestamps: false,
    });
}