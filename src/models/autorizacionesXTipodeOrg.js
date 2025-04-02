const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "AutorizacionesXTipodeOrg", 
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
                "VentaoRenta",
                "PreVenta",                
                "Todas"
            ),
            allowNull: false
        },
        tipodeDesarrolloAut:{
            type: DataTypes.ENUM(
                "Desarrollo",
                "PropiedadIndependiente",
                "Todos",
                "NoAutorizado",
            ),
            allowNull: false
        },
        tiempodeConstruccionAut:{
            type: DataTypes.ENUM(
                "Nuevo",
                "ConUso",
                "Todas",
                "NoAutorizado",
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
        tableName: 'autorizaciones_por_tipos_de_organizacion',
        timestamps: false,
    });
}