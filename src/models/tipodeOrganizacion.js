const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "TipodeOrganizacion", 
    {
        id:{
            type:DataTypes.UUID,
            unique:true,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        nombreTipoOrg:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        tipodeOperacionAut:{
            type: DataTypes.ENUM(
                "NoAutorizado",
                "Venta",
                "Renta",
                "VentayRenta",
                "PreVenta",                
                "Todas"
            ),
            allowNull: false
        },
        cantidadPropVenta:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        cantidadPropRenta:{
            type:DataTypes.INTEGER,
            allowNull:false,
        }, 
        cantidadPropPreVenta:{
            type:DataTypes.INTEGER,
            allowNull:false,
        }  
    }, {
    timestamps: false,
    });
}