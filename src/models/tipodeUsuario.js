const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "TipodeUsuario", 
    {
        id:{
            type:DataTypes.UUID,
            unique:true,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        tipo:{
            type: DataTypes.ENUM(
                "IsaDueñoBorMiquirrayDueño",
                "Aliado",
                "Desarrollador",
                "AgentedeDesarrollo",
                "Arquitecto",
                "Constructor",
                "ClienteFinal",
                "ClientePropietario",
                "DueñoTratoDirecto",
            ),
            allowNull: false
        },
        giro:{
            type: DataTypes.ENUM(
                "Habitacional",
                "Comercial",
                "HabitacionalyComercial",
                "Mixto",
                "Todos",
            ),
        },
        manejaUsuarios:{
            type: DataTypes.ENUM("Si","No"),
            allowNull: false
        },
        autorizaciondePublicar:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue:false,
        }, 
    }, {
        tableName: 'tipo_de_usuarios',
        timestamps: false,
    });
}