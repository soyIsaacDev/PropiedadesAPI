const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
      "ImgPropiedad", 
      {
      type: {
        type: DataTypes.STRING,
      },
      img_name: {
        type: DataTypes.STRING,
      }
    });
  
  };