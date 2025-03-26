const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
      "ImgPropiedadIndependiente", 
      {
      orden:{
        type:DataTypes.INTEGER
      },
      type: {
        type: DataTypes.STRING,
      },
      img_name: {
        type: DataTypes.STRING,
      },
      thumbnail_img: {
        type: DataTypes.STRING,
      },
      detalles_imgGde: {
        type: DataTypes.STRING,
      },
      detalles_imgChica: {
        type: DataTypes.STRING,
      },

    },     
    {
      tableName: 'img_propiedades_independientes',
      timestamps: false,
    }
  );
  
  };