const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "HistorialdePagos", 
    {
        fechaInicio:{
            type: DataTypes.DATEONLY,
        },
        fechaFin:{
            type: DataTypes.DATEONLY,
        },
        paymentId:{
            type:DataTypes.UUID,
            unique:true,
            defaultValue: DataTypes.UUIDV4,
        },
    }, {
    timestamps: true,
    });
}