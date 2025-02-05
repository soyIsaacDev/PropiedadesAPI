const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "Agente", 
    {
        id:{
            type:DataTypes.UUID,
            unique:true,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        nombre:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: false 
        },
        apellidoP:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: false 
        },
        apellidoM:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true 
        },
        Email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true 
        },
        Telefono:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true 
        },
        tipo:{
            type: DataTypes.ENUM(
                "DueñoIsaacBM",
                "Desarrollador",
                "Agente",
                "DueñodePropiedad",
                "Arq/Constructor",
                "Cliente"
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
            allowNull: false
        },
        escala:{
            type: DataTypes.ENUM(
                "Desarrollador",
                "Agente",
            ),
            allowNull: false
        },
        
    }, {
    timestamps: false,
    });
}