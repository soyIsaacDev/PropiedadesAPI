const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
      "ImgModeloAsociado", 
      {
      type: {
        type: DataTypes.STRING,
      },
      img_name: {
        type: DataTypes.STRING,
      }
    });
  
  };