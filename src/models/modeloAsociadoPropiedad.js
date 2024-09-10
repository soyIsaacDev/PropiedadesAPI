const {literal, DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "ModeloAsociadoPropiedad", 
    {
        /* id: {
            type:DataTypes.STRING,
            allowNull:false,
            autoIncrement: true,
            primaryKey:true,
            defaultValue: literal("nextval('custom_sequence')"),
        }, 
        /*id:{
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            autoIncrement: false,
            defaultValue: DataTypes.UUIDV4 // Or DataTypes.UUIDV1
            
        },
        */
        nombreModelo:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: false
        },
        precio:{
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        recamaras:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        baños:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        medio_baño:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        espaciosCochera:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        cocheraTechada:{
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        niveles:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        m2Construccion:{
            type:DataTypes.FLOAT,
            allowNull:true
        },
        m2Terreno:{
            type:DataTypes.FLOAT,
            allowNull:true
        },
        m2Total:{
            type:DataTypes.FLOAT,
            allowNull:true
        },
        añodeConstruccion:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        calle:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        numeroPropiedad:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        numeroInterior:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        posicion:{
            type: DataTypes.JSON,
            allowNull: true,
        },
        ref_id:{
            type:DataTypes.UUID,
            unique:true,
            defaultValue: DataTypes.UUIDV4,
        },
        
    }, {
    timestamps: false,
		
    });
}