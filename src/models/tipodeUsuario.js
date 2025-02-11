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
                "DueñoIsaacBoMiquirray",
                "Desarrollador",
                "AgentedeDesarrollo",
                "Agente",
                "DueñodePropiedad",
                "Arquitecto",
                "Constructor",
                "ClienteFinal"
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
            allowNull: true
        },
    }, {
    timestamps: false,
    });
}