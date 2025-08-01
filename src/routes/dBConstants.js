const server = require("express").Router();

const { Estado , Municipio, Ciudad, Colonia, ColoniaCiudad, AmenidadesDesarrollo, 
  AmenidadesdelaPropiedad, TipoOperacion, TipodePropiedad, EstiloArquitectura } = require("../db");

server.post("/agregarEntidadGeografica", async (req, res) => { 
  try {
      const {estado, municipio, ciudad } = req.body;
      
      const EstadoCreado = await Estado.findOrCreate({
        where:{ estado }
      });
      const MunicipioCreado = await Municipio.findOrCreate({
        where:{ municipio}
      });
      const CiudadCreada = await Ciudad.findOrCreate({
        where:{ ciudad }
      });
      // agregando relaciones entre ellos
        MunicipioCreado[0].EstadoId = EstadoCreado[0].id; 
        await MunicipioCreado[0].save();
        console.log("Municipo Creado "+MunicipioCreado[0].EstadoId)
        CiudadCreada[0].MunicipioId= await MunicipioCreado[0].id
        await CiudadCreada[0].save();
        
    res.json({ EstadoCreado, MunicipioCreado, CiudadCreada });
  } catch (error) {
    res.send(error);
  }
});

server.get("/entidadesGeograficas", async (req, res) => { 
  try {
    const Ciudades = await Ciudad.findAll();
    const Municipios = await Municipio.findAll();
    const Estados = await Estado.findAll();
    res.json({Estados, Municipios, Ciudades})
  } catch (e) {
    res.send(e)
  }
})

server.post("/agregarColonia", async (req, res) => { 
  try {
      const {colonia, ciudadId } = req.body;
      
      const ColoniaCreada = await Colonia.findOrCreate({
        where:{ colonia }
      });

      // agregando relaciones entre ellos
      await ColoniaCiudad.create({ColoniumId:ColoniaCreada[0].id, CiudadId:ciudadId})
        console.log(ColoniaCiudad)
    res.json(ColoniaCreada);
  } catch (error) {
    res.send(error);
  }
});

server.get("/getColoniasByCiudadId/:CiudadId", async (req, res) => { 
  try {
    const { CiudadId } = req.params
    const ColoniasxCiudad = await Ciudad.findOne({
      where:{id:CiudadId},
      include: [
        {
          model: Colonia,
          through: {
            attributes: []
          }
        }
      ]
    });
    const Colonias = ColoniasxCiudad.Colonia;
    console.log(Colonias)
    res.status(200).json(Colonias)
  } catch (e) {
    res.send(e)
  }
})

server.get("/getColoniasByCiudadNombre/:CiudadNombre", async (req, res) => { 
  try {
    const { CiudadNombre } = req.params
    const capitalize = (str) => 
      str.toLowerCase().replace(/(^|\s)\S/g, l => l.toUpperCase());
    const ciudadMinusculas = capitalize(CiudadNombre);
    const ColoniasxCiudad = await Ciudad.findOne({
      where:{ciudad:ciudadMinusculas},
      include: [
        {
          model: Colonia,
          through: {
            attributes: []
          }
        }
      ]
    });
    const Colonias = ColoniasxCiudad.Colonia;
    Colonias? res.status(200).json(Colonias) : res.status(400).json({mensaje:"No se encontraron colonias para la ciudad"})
  } catch (e) {
    res.send(e)
  }
})

server.get("/getCiudadId/:CiudadNombre", async (req, res) => { 
  try {
    const { CiudadNombre } = req.params
    const capitalize = (str) => 
      str.toLowerCase().replace(/(^|\s)\S/g, l => l.toUpperCase());
    const ciudadMinusculas = capitalize(CiudadNombre);
    const CiudadBusqueda = await Ciudad.findOne({
      where:{ciudad:ciudadMinusculas},
      
    });
    const CiudadId = CiudadBusqueda.id;
    CiudadId? res.status(200).json(CiudadId) : res.status(400).json({mensaje:"No se encontro la ciudad"})
  } catch (e) {
    res.send(e);
  }
})

server.get("/agregarAmenidadDesarrollo", async (req, res) => { 
  // -> dbConstants/agregarAmenidadDesarrollo?DesarrolloAmenity=Gimnasio&PropertyAmenity=Terraza
  try {
    const {DesarrolloAmenity, PropertyAmenity} = req.query;
    //si llega vacio un dato
    if(DesarrolloAmenity===""){
      const AmenidadPropiedadCreada = await AmenidadesdelaPropiedad.findOrCreate({
        where:{ nombreAmenidad:PropertyAmenity }
      })
      res.json({AmenidadPropiedadCreada});
    }
    if(PropertyAmenity===""){
      const AmenidadDesarrolloCreado = await AmenidadesDesarrollo.findOrCreate({
        where:{ nombreAmenidad:DesarrolloAmenity }
      })
      res.json({AmenidadDesarrolloCreado});
    }
    // si llegan ambos datos
    else{
      const AmenidadDesarrolloCreado = await AmenidadesDesarrollo.findOrCreate({
        where:{ nombreAmenidad:DesarrolloAmenity }
      })
      const AmenidadPropiedadCreada = await AmenidadesdelaPropiedad.findOrCreate({
        where:{ nombreAmenidad:PropertyAmenity }
      })
      res.json({AmenidadDesarrolloCreado, AmenidadPropiedadCreada});
    }

  } catch (e) {
    res.send(e);
  }
})

server.post("/editarAmenidadesDesarrollo", async(req, res) =>{
  try {
    const {DesarrolloAmenidadId, NuevoNombreAmenidad } = req.body;
    const AmenidadDesarrollo = await AmenidadesDesarrollo.findByPk(DesarrolloAmenidadId)
    AmenidadDesarrollo.nombreAmenidad = NuevoNombreAmenidad;
    await AmenidadDesarrollo.save();
    res.json({
      codigo:1, 
      Confirmacion:`Se edito la Amenidad --->`+ AmenidadDesarrollo.nombreAmenidad
    });
  } catch (e) {
    res.json({
      codigo:0, 
      Mensaje: "No se pudo editar la Amenidad",
      Error:e
    });
  }
})

server.post("/editarAmenidadesdelaPropiedad", async(req, res) =>{
  try {
    const {ModeloAmenidadId, NuevoNombreAmenidad} = req.body;
    const AmenidadModelo = await AmenidadesdelaPropiedad.findByPk(ModeloAmenidadId)
    AmenidadModelo.nombreAmenidad = NuevoNombreAmenidad;
    await AmenidadModelo.save();
    res.json({
      codigo:1, 
      Confirmacion:`Se edito la Amenidad ---> `+ AmenidadModelo.nombreAmenidad
    });
  } catch (e) {
    res.json({
      codigo:0, 
      Mensaje: "No se pudo editar la Amenidad ",
      Error:e
    });
  }
})

server.get("/getAmenidadesDesarrollo", async (req, res) => { 
  try {
    const AmenidadesDesarrolloFind = await AmenidadesDesarrollo.findAll({
      order: [
        ['nombreAmenidad', 'ASC'],
      ]
    });
    res.json(AmenidadesDesarrolloFind);
  } catch (e) {
    res.send(e);
  }
})

server.get("/getAmenidadesdelaPropiedad", async (req, res) => { 
  try {
    const AmenidadesdelaPropiedadFind = await AmenidadesdelaPropiedad.findAll({
      order: [
        ['nombreAmenidad', 'ASC'],
      ]
    });
    res.json(AmenidadesdelaPropiedadFind);
  } catch (e) {
    res.send(e);
  }
})

server.get("/addTipodeOperacion/:TipodeOperacion", async (req, res) => { 
  try {
    const { TipodeOperacion } = req.params
    const TipodeOpCreada = await TipoOperacion.create({tipodeOperacion:TipodeOperacion});
    res.json(TipodeOpCreada);
  } catch (e) {
    res.send(e);
  }
})

server.get("/addTipodePropiedad/:TipoPropiedad", async (req, res) => { 
  try {
    const { TipoPropiedad } = req.params
    const TipodePropCreada = await TipodePropiedad.create({tipoPropiedad:TipoPropiedad});
    res.json(TipodePropCreada);
  } catch (e) {
    res.send(e);
  }
})
server.get("/getTipodePropiedades", async (req, res) => { 
  try {
    const TipodePropiedades = await TipodePropiedad.findAll({
      order: [
        ['tipoPropiedad"', 'ASC'],
      ]
    });
    res.json(TipodePropiedades);
  } catch (e) {
    res.send(e);
  }
})

server.post("/agregarEstiloArquitectura", async (req, res) => { 
  try {
      const {nombreEstilo } = req.body;
      
      const EstiloCreado = await EstiloArquitectura.findOrCreate({
        where:{ nombreEstilo }
      });
    res.json(EstiloCreado);
  } catch (error) {
    res.send(error);
  }
});

server.get("/getEstiloArquitectura", async (req, res) => { 
  try {      
    const EstiloArq = await EstiloArquitectura.findAll();
    res.json(EstiloArq);
  } catch (error) {
    res.send(error);
  }
});

module.exports =  server;
