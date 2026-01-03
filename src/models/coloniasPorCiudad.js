const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ColoniasPorCiudad = sequelize.define('colonias_por_ciudad', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ColoniumId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'colonias',
        key: 'id'
      }
    },
    CiudadId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ciudades',
        key: 'id'
      }
    },
    CP: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, { 
    timestamps: false,
    tableName: 'colonias_por_ciudad',
    indexes: [
      {
        name: 'idx_colonias_por_ciudad_colonium_ciudad',
        unique: false,  // Permite duplicados
        fields: ['ColoniumId', 'CiudadId']
      }
    ]
  });

  return ColoniasPorCiudad;
};