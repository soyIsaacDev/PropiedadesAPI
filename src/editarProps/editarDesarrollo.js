const { Desarrollo, amenidades_de_los_desarrollos, VideoYoutube, Tour3D, } = require("../db");

const editarDesarrollo = async (req, res, next) => {
  try {
    console.log("Editando el Desarrollo")
    // Se obtienen los datos de la form que estan en un objeto FormData y se pasan a JSON
    const bodyObj = req.body.data;
    const parsedbodyObj = JSON.parse(bodyObj);
    const { id, nombreDesarrollo, calle, numeroPropiedad, posicion, ciudad, estado, municipio,
      añodeConstruccion, amenidadesDesarrollo, EstiloArquitecturaId, colonia, quitarAmenidadesDesarrollo,
      ytvideo, tour3D_URL,
    } = parsedbodyObj
    
    const [actualizarDesarrollo] = await Desarrollo.update(
      {
        nombreDesarrollo,
        EstadoId: estado,
        MunicipioId: municipio,
        CiudadId: ciudad,
        EstiloArquitecturaId,
        añodeConstruccion,
        calle,
        numeroPropiedad,
        ColoniumId: colonia,
        posicion
      },
      { where: { id } }
    );
  
    if (actualizarDesarrollo === 0) {
      return res.status(404).json({ mensaje: "Desarrollo no encontrado" });
    }

    tour3D_URL && await Tour3D.findOrCreate({
      where:{
        tourURL:tour3D_URL,
        DesarrolloId:id
      },
    })

    ytvideo.map(async (video) => {
      await VideoYoutube.findOrCreate({
        where:{
          videoURL:video,
          DesarrolloId:id
        }
      })
    })

    const addAmenidadesPromises = amenidadesDesarrollo.map(amenidadId => 
      amenidades_de_los_desarrollos.findOrCreate({
        where: { DesarrolloId: id, AmenidadesDesarrolloId: amenidadId }
      })
    );

    // Borrando las amendidades que se quitaron
    const removeAmenidadesPromises = quitarAmenidadesDesarrollo.map(amenidadId =>
      amenidades_de_los_desarrollos.destroy({
        where: { DesarrolloId: id, AmenidadesDesarrolloId: amenidadId }
      })
    );

    await Promise.all([...addAmenidadesPromises, ...removeAmenidadesPromises]);
    
    next();    

  } catch (error) {
    console.log("Error al editar el Desarrollo "+error);
    res.status(500).json({
      codigo:0,
      Mensaje:`Error al intentar editar el Desarrollo`,
      Error:error
    });
  }
}

module.exports = {
  editarDesarrollo
};