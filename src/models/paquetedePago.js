const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "PaquetedePago", 
    {
        nombrePaquete:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        precio:{
            type: DataTypes.DOUBLE
        },
        tipodeOperacion:{
            type: DataTypes.ENUM(
                "Venta",
                "Renta",
                "Venta/Renta",
                "VentaoRenta",
                "PreVenta",
                "Todas",
            ),
            allowNull: true,
        },
        periodicidad:{
            type: DataTypes.STRING,
        },     
        cantidaddePropiedades:{
            type: DataTypes.INTEGER,
            allowNull: true,
        }, 
        tipodePago:{
            type: DataTypes.ENUM(
                "Pagado",
                "Gratuito",
            ),
            allowNull: false,
        },
        tipodeDesarrollo:{
            type: DataTypes.ENUM(
                "Desarrollo",
                "Modelo",
            ),
            allowNull: true,
        },
        tiempodeConstruccion:{
            type: DataTypes.ENUM(
                "Nuevo",
                "ConUso",
            ),
            allowNull: true,
        },
        fechaInicioOferta:{
            type: DataTypes.DATEONLY,
        },
        fechaFinOferta:{
            type: DataTypes.DATEONLY,
        },
    }, {
    timestamps: false,
    });
}