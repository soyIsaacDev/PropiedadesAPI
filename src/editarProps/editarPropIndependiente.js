const {  amenidades_de_las_prop_independientes, PropiedadIndependiente, VideoYoutube, Tour3D, equipamiento_de_las_prop_independientes } = require("../db");


const editarPropIndependiente = async (req, res, next) => {
  try {
    // Se obtienen los datos de la form que estan en un objeto FormData y se pasan a JSON
    const bodyObj = req.body.data;
    const parsedbodyObj = JSON.parse(bodyObj);
    const { id, precio, calle, numeroPropiedad, numeroInterior, posicion, ciudad, estado, municipio, colonia,
      niveles, recamaras, baños, medio_baño, espaciosCochera, cocheraTechada,   
      m2Construccion, m2Terreno, m2Total, añodeConstruccion, 
      TipoOperacionId, TipodePropiedadId, amenidadesPropiedad, tratoDirecto,
      EstiloArquitecturaId, quitarAmenidadesModelo, ytvideo, tour3D_URL,  equipamiento, quitarEquipamiento
    } = parsedbodyObj
    const [actualizarPropiedadIndependiente] = await PropiedadIndependiente.update(
      {
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
        m2Total, 
        añodeConstruccion,
        tratoDirecto,
        publicada:false,
        TipoOperacionId:TipoOperacionId,
        TipodePropiedadId,  
        //EstiloArquitecturaId
        EstadoId:estado,
        MunicipioId:municipio,
        CiudadId:ciudad,
        ColoniumId:colonia,
        calle,
        numeroPropiedad,
        numeroInterior,
        },
        { where: { id } }
    )
    console.log(actualizarPropiedadIndependiente)
    if (actualizarPropiedadIndependiente === 0) {
        return res.status(404).json({ mensaje: "Propiedad Independiente no encontrada" });
    }

    tour3D_URL && await Tour3D.findOrCreate({
      where:{
        tourURL:tour3D_URL,
        PropiedadIndependienteId:id
      },
    })

    ytvideo.map(async (video) => {
      await VideoYoutube.findOrCreate({
        where:{
          videoURL:video,
          PropiedadIndependienteId:id
        }
      })
    })

    const addAmenidadesPromises = amenidadesPropiedad.map(amenidadId => 
        amenidades_de_las_prop_independientes.findOrCreate({
          where: { PropiedadIndependienteId: id, AmenidadesdelaPropiedadId: amenidadId }
        })
    );

    // Borrando las amendidades que se quitaron
    const removeAmenidadesPromises = quitarAmenidadesModelo.map(amenidadId =>
        amenidades_de_las_prop_independientes.destroy({
          where: { PropiedadIndependienteId: id, AmenidadesdelaPropiedadId: amenidadId }
        })
    );

    const addEquipamientoPromises = equipamiento.map(equipamientoId => 
        equipamiento_de_las_prop_independientes.findOrCreate({
          where: { PropiedadIndependienteId: id, EquipamientoId: equipamientoId }
        })
    );

    // Borrando los equipamientos que se quitaron
    const removeEquipamientoPromises = quitarEquipamiento.map(equipamientoId =>
        equipamiento_de_las_prop_independientes.destroy({
          where: { PropiedadIndependienteId: id, EquipamientoId: equipamientoId }
        })
    );

    await Promise.all([...addAmenidadesPromises, ...removeAmenidadesPromises, ...addEquipamientoPromises, ...removeEquipamientoPromises]);

    next();

  } catch (error) {
    console.log("Error al editar la Propiedad Independiente "+error);
    res.status(500).json({
      codigo:0,
      Mensaje:`Error al intentar editar la Propiedad Independiente`,
      Error:error
    });
  }
}

module.exports = editarPropIndependiente;