const server = require("express").Router();

const { Estado , Municipio, Ciudad, Colonia, ColoniaCiudad, AmenidadesDesarrollo, AmenidadesPropiedad, TipoOperacion, TipodePropiedad } = require("../db");

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

server.get("/getColonias/:CiudadId", async (req, res) => { 
  try {
    const { CiudadId } = req.params

    const TodaslasCiudades = await Ciudad.findOne({
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

    res.json(TodaslasCiudades)
  } catch (e) {
    res.send(e)
  }
})

server.get("/agregarAmenidadDesarrollo", async (req, res) => { 
  // -> dbConstants/agregarAmenidadDesarrollo?DesarrolloAmenity=Gimnasio&PropertyAmenity=Terraza
  try {
    const {DesarrolloAmenity, PropertyAmenity} = req.query;
    //si llega vacio un dato
    if(DesarrolloAmenity===""){
      const AmenidadPropiedadCreada = await AmenidadesPropiedad.findOrCreate({
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
      const AmenidadPropiedadCreada = await AmenidadesPropiedad.findOrCreate({
        where:{ nombreAmenidad:PropertyAmenity }
      })
      res.json({AmenidadDesarrolloCreado, AmenidadPropiedadCreada});
    }

  } catch (e) {
    res.send(e);
  }
})

server.get("/getAmenidadesDesarrollo", async (req, res) => { 
  try {
    const AmenidadesDesarrolloFind = await AmenidadesDesarrollo.findAll();
    res.json(AmenidadesDesarrolloFind);
  } catch (e) {
    res.send(e);
  }
})

server.get("/getAmenidadesPropiedad", async (req, res) => { 
  try {
    const AmenidadesPropiedadFind = await AmenidadesPropiedad.findAll();
    res.json(AmenidadesPropiedadFind);
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
    const TipodePropiedades = await TipodePropiedad.findAll();
    res.json(TipodePropiedades);
  } catch (e) {
    res.send(e);
  }
})

module.exports =  server;
  
module.exports = {
  DBConstantsRoute: server
}