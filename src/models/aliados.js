const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "Aliado", 
    {
        id:{
            type:DataTypes.UUID,
            unique:true,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId:{
            type: DataTypes.STRING,
            allowNull: true 
        },
        nombre:{
            type: DataTypes.STRING,
            allowNull: true 
        },
        apellidoPaterno:{
            type: DataTypes.STRING,
            allowNull: true 
        },
        apellidoMaterno:{
            type: DataTypes.STRING,
            allowNull: true 
        },
        email:{
            type: DataTypes.STRING,
            unique:true,
            allowNull: false 
        },
        telefono:{
            type: DataTypes.STRING,
            allowNull: true
        },
        sexo:{
            type: DataTypes.ENUM("Masculino","Femenino"),
            allowNull: true
        },
        dia_de_nacimiento:{
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        mes_de_nacimiento:{
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        año_de_nacimiento:{
            type: DataTypes.SMALLINT,
            allowNull: true
        },        
        mostrar_Tour:{
            type:DataTypes.BOOLEAN,
            allowNull:true,
            default:"false"
        },
        tipodeAliado:{
            type: DataTypes.ENUM(
                "AtencionAClientes",
                "Coordinador",
                "Principal",                
                "Creditos",
                "Legal",                
            ),
        },
        autorizaciondePublicar:{
            type: DataTypes.ENUM(
                "Ninguna",
                "Agregar",
                "Editar",
                "Completa"
            ),
            allowNull: false,
            default:"Ninguna"
        }, 
        OrganizacionId:{
            type: DataTypes.UUID,
            allowNull: false,
            /* defaultValue:"b1548035-bf52-4063-9328-91dbaee6e3a6" */
        }
    }, {
        tableName: 'aliados',
        timestamps: false,
    });
}