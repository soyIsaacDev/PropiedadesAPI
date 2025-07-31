const server = require("express").Router();
const express = require("express");
const path = require('path');
const public = path.join(__dirname,'../../uploads');
const { Op } = require('sequelize');

const { PropiedadIndependiente, ImgPropiedadIndependiente, AmenidadesdelaPropiedad, TipodePropiedad, 
  TipoOperacion, Estado, Municipio, Ciudad, Colonia, Cliente, VideoYoutube, Tour3D, Aliado
 } = require("../db");
const { Console } = require("console");

server.get("/getPropiedadesIndependientes", async (req, res) => {
    try {
      const { userId, neLat, neLng, swLat, swLng } = req.query;
      
      // Construir el objeto where inicial
      const whereClause = {
        publicada: true
      };
      
      // Agregar filtro de límites del mapa si se proporcionan
      if (neLat && neLng && swLat && swLng) {
        whereClause.posicion = {
          [Op.and]: [
            { lat: { [Op.between]: [parseFloat(swLat), parseFloat(neLat)] } },
            { lng: { [Op.between]: [parseFloat(swLng), parseFloat(neLng)] } }
          ]
        };
      }

      const propiedadIndependiente = await PropiedadIndependiente.findAll({
        where: whereClause,
        order: [
          ['precio','DESC']
        ],
        include: [
          {
            model:ImgPropiedadIndependiente,
            attributes: ['id','orden','img_name','thumbnail_img','detalles_imgGde','detalles_imgChica'],
            separate:true,
            order: [ ['orden','ASC'] ],
          },
          {
            model:VideoYoutube
          },
          {
            model: Tour3D
          }, 
          {
            model: AmenidadesdelaPropiedad,
            through: {
                attributes: []
            }
          },
          {
            model: TipodePropiedad
          },
          {
            model: TipoOperacion
          },
          {
            model: Ciudad
          },
          {
            model: Municipio
          },
          {
            model: Estado
          },
          {
            model: Colonia
          },
          { // El modelo Cliente da la relacion de Favoritos
            model:Cliente,
            attributes: ["id", "userId"],
            required: false, // Mantiene propiedades sin clientes
            where: userId ? { userId } : {userId:"x000"} // Filtra solo si se pasa un userId, de lo contrario se da un UserId que no existe
          },
        ]
      })
      propiedadIndependiente? res.json(propiedadIndependiente) : res.json({Mensaje:"No se encontraron datos de propiedades"});
    } catch (error) {
        res.json(error)
    }
})

server.get("/detallesPropIndependiente/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const {userId} = req.query;
    const dataPropiedad = await PropiedadIndependiente.findOne({
      where:{id},
      /* order: [
        [ImgPropiedadIndependiente, 'orden','ASC']
      ], */
      include: [
        {
          model: ImgPropiedadIndependiente,
          attributes: ['orden','img_name','thumbnail_img','detalles_imgGde','detalles_imgChica'],
        },
        {
          model:VideoYoutube
        },
        {
          model: Tour3D
        }, 
        {
          model: AmenidadesdelaPropiedad,
          through: {
            attributes: []
          }
        },
        {
          model: TipodePropiedad
        },
        {
          model: TipoOperacion
        },
        {
          model: Ciudad
        },
        {
          model: Municipio
        },
        {
          model: Estado
        },
        {
          model: Colonia
        },
        {// El modelo Cliente da la relacion de desarrollos_favoritos
          model:Cliente,
          attributes: ["id", "userId"],
          required: false, // Mantiene propiedades sin clientes
          where: userId ? { userId } : {userId:"x000"} // Filtra solo si se pasa un userId, de lo contrario se da un UserId que no existe
        },
      ]
    })
    dataPropiedad? res.json(dataPropiedad) : res.json({Mensaje:"No se encontro la propiedad"});
  } catch (error) {
    res.json(error)
  }
})

server.get("/getPropIndbyOrg/:userId", async (req,res) => {
  try {
    const { userId } = req.params;
    const cliente = await Cliente.findOne({ where:{userId} });
    const dataIndependiente = await PropiedadIndependiente.findAll({
      where:{ OrganizacionId:cliente.OrganizacionId },
      order: [
        ['precio"','ASC']
      ],
      include: [
        {
          model:ImgPropiedadIndependiente,
          attributes: ['id','orden','img_name','thumbnail_img','detalles_imgGde','detalles_imgChica'],
          separate:true,
          order: [
            ['orden','ASC']
          ]
        },
        {
          model:AmenidadesdelaPropiedad,
          through: {
            attributes: []
          }
        }
      ]
    })
    dataIndependiente? res.json(dataIndependiente) : res.json({Mensaje:"No se encontraron datos de Propiedades Independientes"})
  } catch (error) {
    res.json(error)
  }
})

/* server.get("/getPropAsignar", async (req,res) => {
  try {
    const { propiedadId, userId } = req.query;
    let whereConditions = [];

    // Si solo se proporciona propiedadId, buscar directamente por ese ID
    if (propiedadId && (!userId || userId === '')) {
      const propiedad = await PropiedadIndependiente.findByPk(propiedadId);
      return propiedad ? res.json([propiedad]) : res.status(404).json({ mensaje: "Propiedad no encontrada" });
    }
    
    // Si se proporciona userId, buscar propiedades según las colonias asignadas al aliado
    if (userId) {
      const aliado = await Aliado.findOne({
        where: { userId },
        include: [{
          model: Colonia,
          through: { attributes: [] }
        }]
      });

      // Verificar si el aliado existe
      if (!aliado) {
        return res.status(404).json({ mensaje: "El aliado no existe" });
      }

      // Verificar si el aliado tiene colonias asignadas
      if (!aliado.Colonia || aliado.Colonia.length === 0) {
        return res.status(404).json({ mensaje: "El aliado no tiene colonias asignadas" });
      }

      // Obtener los IDs de las colonias asignadas al aliado
      const coloniasIds = aliado.Colonia.map(colonia => colonia.id);
      
      // Agregar condición de búsqueda por colonias
      whereConditions.push({
        [Op.and]: [
          { CiudadId: aliado.CiudadId },
          { ColoniaId: { [Op.in]: coloniasIds } }
        ]
      });
    }

    // Si se proporciona tanto userId como propiedadId, buscar por propiedadId o por colonias del aliado
    if (propiedadId && userId) {
      whereConditions.push({ id: propiedadId });
    }

    // Buscar propiedades
    const dataPropiedad = await PropiedadIndependiente.findAll({
      where: whereConditions.length > 1 ? { [Op.or]: whereConditions } : whereConditions[0] || {},
    });
    
    // Manejar diferentes casos con switch
    switch (true) {
      case !dataPropiedad || dataPropiedad.length === 0:
        return res.status(404).json({ mensaje: "No se encontraron propiedades en las colonias asignadas al aliado" });
      default:
        return res.status(200).json(dataPropiedad);
    }
  } catch (error) {
    console.error('Error en getPropAsignar:', error);
    res.status(500).json({ mensaje: "Error interno del servidor", error: error.message });
  }
}); */

server.get("/publicar/:propId", async (req,res) => {
  try{
    const { propId } = req.params;
    const propiedad = await PropiedadIndependiente.findByPk(propId);
    console.log(propiedad.calle)
    propiedad.publicada = !propiedad.publicada;
    await propiedad.save();
    
    res.json(propiedad)
  } catch(error){
    res.json(error)
  }
})
/* server.get("/hardDelete", async (req,res) => {
  try {
    const prop = await PropiedadIndependiente.findOne({
      where:{id:"25b105e1-d7ee-4426-ba4d-5e113d53793c"}
    })
    await prop.destroy();
    res.json("BORRADO")
  } catch (error) {
    res.json(error)
  }
}) */

// Para ver las imagenes
server.use('/imagenes', express.static(public));

module.exports =  server;