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
                "PreVenta",
                "Todas",
            ),
            allowNull: false,
        },
        periodicidad:{
            type: DataTypes.STRING,
        },     
        cantidaddePropiedades:{
            type: DataTypes.INTEGER
        }, 
        tipodePago:{
            type: DataTypes.ENUM(
                "Pagado",
                "Gratuito",
            ),
            allowNull: false,
        },
        
        tipodePropiedad:{
            type: DataTypes.ENUM(
                "Desarrollo",
                "Individual",
            ),
            allowNull: false,
        },
        tiempodeConstruccion:{
            type: DataTypes.ENUM(
                "Nueva",
                "ConUso",
            ),
            allowNull: false,
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