const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "VideoYoutube", 
    {
        videoURL:{
            type: DataTypes.STRING,
            allowNull: true,
        }        
    }, 
    {
        tableName: 'video_youtube',
        timestamps: false,
    });
}