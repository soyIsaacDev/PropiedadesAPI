const {DataTypes} = require ('sequelize');

module.exports = s => {
    s.define(
        "Tour3D", 
    {
        tourURL:{
            type: DataTypes.STRING,
            allowNull: true,
        }        
    }, 
    {
        tableName: 'tour_3d',
        timestamps: false,
    });
}