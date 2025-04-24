const {  amenidades_de_los_modelos, ModeloAsociadoAlDesarrollo, Desarrollo} = require("../db");

const editarModelo = async (req, res, next) => {
  try {
    console.log("Editando el Modelo");
    // Se obtienen los datos de la form que estan en un objeto FormData y se pasan a JSON
    const bodyObj = req.body.data;
    const parsedbodyObj = JSON.parse(bodyObj);
    const { nombreModelo, nombreDesarrollo, precio, numeroInterior, posicion, ciudad, estado,
      niveles, recamaras, baños, medio_baño, espaciosCochera, cocheraTechada, m2Construccion, 
      m2Terreno, m2Patios, tipodeOperacion, TipodePropiedadId, amenidadesPropiedad, quitarAmenidadesModelo
    } = parsedbodyObj
    const [actualizarModelo] = await ModeloAsociadoAlDesarrollo.update(
      {
        posicion,
        precio,
        niveles,
        recamaras, 
        baños,
        medio_baño,
        espaciosCochera,
        cocheraTechada,
        m2Construccion,
        m2Terreno,
        m2Patios, 
        numeroInterior,
        publicada:false,
        /* añodeConstruccion
          municipio
        */
      },
      { 
        where: {
          nombreModelo,
          DesarrolloId:parseInt(nombreDesarrollo),
          CiudadId:ciudad,
          EstadoId:estado,
        }      
      }
    )

    if (actualizarModelo === 0) {
        return res.status(404).json({ mensaje: "Modelo no encontrado" });
    }

    // Agregar tipo de propiedad y operacion al Desarrollo
    // Modificar Precio Min y Max en Desarrollo
    if(nombreDesarrollo){
      const DesarrolloaCambiar = await Desarrollo.findByPk(parseInt(nombreDesarrollo));

      if(DesarrolloaCambiar.TipodePropiedadId === null){
        DesarrolloaCambiar.TipodePropiedadId = TipodePropiedadId;
        await DesarrolloaCambiar.save();
      }
      if(DesarrolloaCambiar.TipoOperacionId === null){
        DesarrolloaCambiar.TipoOperacionId = tipodeOperacion;
        await DesarrolloaCambiar.save();
      }
      if(DesarrolloaCambiar.precioMin === null && DesarrolloaCambiar.precioMax === null){
        DesarrolloaCambiar.precioMin = precio;
        DesarrolloaCambiar.precioMax = precio;
        await DesarrolloaCambiar.save();
      }
      else if(precio < DesarrolloaCambiar.precioMin){
        DesarrolloaCambiar.precioMin = precio;
        await DesarrolloaCambiar.save();
      }
      else if(precio > DesarrolloaCambiar.precioMax){
        DesarrolloaCambiar.precioMax = precio;
        await DesarrolloaCambiar.save();
      }
    }

    const addAmenidadesPromises = amenidadesPropiedad.map(amenidadId => 
        amenidades_de_los_modelos.findOrCreate({
          where: { ModeloAsociadoAlDesarrolloId: id, AmenidadesdelaPropiedadId: amenidadId }
        })
    );

    // Borrando las amendidades que se quitaron
    const removeAmenidadesPromises = quitarAmenidadesModelo.map(amenidadId =>
        amenidades_de_los_modelos.destroy({
          where: { ModeloAsociadoAlDesarrolloId: id, AmenidadesdelaPropiedadId: amenidadId }
        })
    );

    await Promise.all([...addAmenidadesPromises, ...removeAmenidadesPromises]);

    next();
        
  } catch (error) {
    console.log("Error al editar el Modelo "+error);
    res.status(500).json({
      codigo:0,
      Mensaje:`Error al intentar editar el Modelo`,
      Error:error
    });
  }
}

module.exports = editarModelo;