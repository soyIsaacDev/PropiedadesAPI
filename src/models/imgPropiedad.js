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
      },
      thumbnail_img: {
        type: DataTypes.STRING,
      },
      details_big_img: {
        type: DataTypes.STRING,
      },
      details_small_img: {
        type: DataTypes.STRING,
      },

    });
  
  };