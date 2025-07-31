const {
  amenidades_de_las_prop_independientes,
  PropiedadIndependiente,
  VideoYoutube,
  Tour3D,
} = require("../db");

const crearPropIndependienteDesdeObjeto = async (propData = {}) => {
  try {
    const {
      precio,
      calle,
      numeroPropiedad,
      numeroInterior,
      posicion,
      ciudad,
      estado,
      municipio,
      colonia,
      niveles,
      recamaras,
      baños,
      medio_baño,
      espaciosCochera,
      cocheraTechada,
      m2Construccion,
      m2Terreno,
      añodeConstruccion,
      TipoOperacionId,
      TipodePropiedadId,
      amenidadesPropiedad = [],
      tratoDirecto,
      ytvideo = [],
      tour3D_URL,
      //EstiloArquitecturaId,
      OrganizacionId
    } = propData;

    const [PropiedadIndependienteCreada, creado] =
      await PropiedadIndependiente.findOrCreate({
        where: {
          EstadoId: estado,
          MunicipioId: municipio,
          CiudadId: ciudad,
          ColoniumId: colonia,
          calle,
          numeroPropiedad,
          numeroInterior,
        },
        defaults: {
          precio,
          posicion,
          niveles,
          recamaras,
          baños,
          medio_baño,
          espaciosCochera,
          cocheraTechada,
          m2Construccion,
          m2Terreno,
          añodeConstruccion,
          tratoDirecto,
          publicada: false,
          TipoOperacionId,
          TipodePropiedadId,
          OrganizacionId,
          //EstiloArquitecturaId,
        },
      });

    if (creado === true) {
      if (tour3D_URL) {
        await Tour3D.create({
          tourURL: tour3D_URL,
          PropiedadIndependienteId: PropiedadIndependienteCreada.id,
        });
      }

      for (const video of ytvideo) {
        await VideoYoutube.create({
          videoURL: video,
          PropiedadIndependienteId: PropiedadIndependienteCreada.id,
        });
      }

      for (const amenidadId of amenidadesPropiedad) {
        await amenidades_de_las_prop_independientes.create({
          PropiedadIndependienteId: PropiedadIndependienteCreada.id,
          AmenidadesdelaPropiedadId: amenidadId,
        });
      }

      return {
        codigo: 1,
        Mensaje: `Se cargaron los datos de la propiedad Independiente`,
        PropiedadIndependienteId: PropiedadIndependienteCreada.id,
      };
    } else {
      return {
        codigo: 0,
        Mensaje:
          `La propiedad ubicada en ${PropiedadIndependienteCreada.calle} ${PropiedadIndependienteCreada.numeroPropiedad} ya existe`,
        Error: "Propiedad Independiente Existente",
      };
    }
  } catch (error) {
    console.error("Error al intentar crear los datos del la propiedad Independiente:", error);
    return {
      codigo: 0,
      Mensaje: `Error al intentar crear los datos del propiedad Independiente`,
      Error: error.message || error,
    };
  }
};

module.exports = {
  crearPropIndependienteDesdeObjeto,
};
