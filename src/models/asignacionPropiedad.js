const { DataTypes } = require("sequelize");

module.exports = (s) => {
  s.define(
    "AsignaciondePropiedad",
    {
      tipoDeAutorizacion: {
        type: DataTypes.ENUM("Ninguna", "Agregar", "Editar", "Completa"),
        allowNull: true,
      },
      clientePrincipal: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      rolDelAliado: {
        type: DataTypes.ENUM("Principal", "AtencionAClientes"),
        allowNull: false,
      },
    },
    {
      tableName: "asignacion_de_propiedades",
      timestamps: false,
      indexes: [
        {
          // Evita duplicados de una misma combinación de aliado + cliente + propiedad
          unique: true,
          fields: ["aliadoId", "clienteId", "propiedadId"],
        },
        {
          // Opcional: índice para consultas rápidas de clientePrincipal
          fields: ["propiedadId", "clientePrincipal"],
        },
      ],
    }
  );
};
