const {  amenidades_de_las_prop_independientes, PropiedadIndependiente, VideoYoutube, Tour3D, equipamiento_de_las_prop_independientes, Mascotas } = require("../db");


const editarPropIndependiente = async (req, res, next) => {
  try {
    // Se obtienen los datos de la form que estan en un objeto FormData y se pasan a JSON
    const bodyObj = req.body.data;
    const parsedbodyObj = JSON.parse(bodyObj);
    const { propiedadIndependienteId, precio, calle, numeroPropiedad, numeroInterior, posicion, ciudad, estado, municipio, colonia,
      niveles, recamaras, baños, medio_baño, espaciosCochera, cocheraTechada,   
      m2Construccion, m2Terreno, m2Patios, añodeConstruccion, 
      TipoOperacionId, TipodePropiedadId, amenidadesPropiedad, tratoDirecto,
      EstiloArquitecturaId, quitarAmenidadesModelo, ytvideo, tour3D_URL,  amueblado, equipamiento, quitarEquipamiento,
      mascotaPermitida, mascotas, quitarMascotas, 
    } = parsedbodyObj
    console.log("Tipo de OperacionId:", TipoOperacionId)

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
        m2Patios, 
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
        amueblado,
        mascotaPermitida:mascotaPermitida,
        mascotas: mascotaPermitida !== undefined ? mascotaPermitida : false,
        },
        { where: { id: propiedadIndependienteId } }
    )
    console.log(actualizarPropiedadIndependiente)
    if (actualizarPropiedadIndependiente === 0) {
        return res.status(404).json({ mensaje: "Propiedad Independiente no encontrada" });
    }

    tour3D_URL && await Tour3D.findOrCreate({
      where:{
        tourURL:tour3D_URL,
        PropiedadIndependienteId:propiedadIndependienteId
      },
    })

    if (ytvideo && Array.isArray(ytvideo)) {
      ytvideo.map(async (video) => {
        await VideoYoutube.findOrCreate({
          where:{
            videoURL:video,
            PropiedadIndependienteId:propiedadIndependienteId
          }
        })
      })
    }
    

    const addAmenidadesPromises = (amenidadesPropiedad && Array.isArray(amenidadesPropiedad)) ? amenidadesPropiedad.map(amenidadId => 
        amenidades_de_las_prop_independientes.findOrCreate({
          where: { PropiedadIndependienteId: propiedadIndependienteId, AmenidadesdelaPropiedadId: amenidadId }
        })
    ) : [];

    // Borrando las amendidades que se quitaron
    const removeAmenidadesPromises = (quitarAmenidadesModelo && Array.isArray(quitarAmenidadesModelo)) ? quitarAmenidadesModelo.map(amenidadId =>
        amenidades_de_las_prop_independientes.destroy({
          where: { PropiedadIndependienteId: propiedadIndependienteId, AmenidadesdelaPropiedadId: amenidadId }
        })
    ) : [];

    const addEquipamientoPromises = (equipamiento && Array.isArray(equipamiento)) ? equipamiento.map(equipamientoId => 
        equipamiento_de_las_prop_independientes.findOrCreate({
          where: { PropiedadIndependienteId: propiedadIndependienteId, EquipamientoId: equipamientoId }
        })
    ) : [];

    // Borrando los equipamientos que se quitaron
    const removeEquipamientoPromises = (quitarEquipamiento && Array.isArray(quitarEquipamiento)) ? quitarEquipamiento.map(equipamientoId =>
        equipamiento_de_las_prop_independientes.destroy({
          where: { PropiedadIndependienteId: propiedadIndependienteId, EquipamientoId: equipamientoId }
        })
    ) : [];

    const addMascotasPromises = (mascotas && Array.isArray(mascotas)) ? mascotas.map(mascotaId => 
        Mascotas.update(
          { PropiedadIndependienteId: propiedadIndependienteId },
          { where: { id: mascotaId } }
        )
    ) : [];

    const removeMascotasPromises = (quitarMascotas && Array.isArray(quitarMascotas)) ? quitarMascotas.map(mascotaId =>
        Mascotas.update(
          { PropiedadIndependienteId: null },
          { where: { id: mascotaId, PropiedadIndependienteId: propiedadIndependienteId } }
        )
    ) : [];

    await Promise.all([...addMascotasPromises, ...removeMascotasPromises, ...addAmenidadesPromises, ...removeAmenidadesPromises, ...addEquipamientoPromises, ...removeEquipamientoPromises]);

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