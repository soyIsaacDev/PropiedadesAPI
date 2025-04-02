const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "HistorialdePagos", 
    {
        paymentId:{
            type:DataTypes.UUID,
            unique:true,
            defaultValue: DataTypes.UUIDV4,
        },
        fechaInicio:{
            type: DataTypes.DATEONLY,
        },
        fechaFin:{
            type: DataTypes.DATEONLY,
        },
        
    }, {
        tableName: 'historial_de_pagos',
        timestamps: true,
    });
}