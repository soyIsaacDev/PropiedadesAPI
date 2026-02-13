const server = require("express").Router();
const express = require("express");
const path = require('path');
const { Op } = require('sequelize');

var public = path.join(__dirname,'../../uploads');

const { Desarrollo, ImgDesarrollo, AmenidadesDesarrollo, AmenidadesdelaPropiedad, TipodePropiedad, 
  TipoOperacion, Estado, Municipio, Ciudad, Colonia, Cliente, Favoritos, ModeloAsociadoAlDesarrollo, 
  ImgModeloAsociado, EstiloArquitectura, VideoYoutube, Tour3D, Equipamiento } = require("../db");

const { literal } = require('sequelize');

/* server.get("/getAllDataandImagenModeloAsociadoPropiedad", async (req, res) => {
  try {
    const dataPropiedad = await ModeloAsociadoPropiedad.findAll({
      //where:{publicada:"Si"},
      order: [
        ['precio"','DESC']
      ],
      include: [
        {
          model: ImgModeloAsociado,
          attributes: ['id','orden','img_name','thumbnail_img','detalles_imgGde','detalles_imgChica'],
          separate:true,
          order: [
            ['orden','ASC']
          ],
        }, 
        {
          model: AmenidadesdelaPropiedad, 
          through: {
            attributes: []
          }
        },
      ]
    },);
    
    dataPropiedad? res.json(dataPropiedad) : res.json({Mensaje:"No se encontraron datos de propiedades"});
    
  } catch (e) {
    res.send(e);
  } 
}
); */

server.get("/getAllDataandImagenModeloAsociadoPropiedad", async (req, res) => {
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

    const dataPropiedad = await ModeloAsociadoAlDesarrollo.findAll({
      where: whereClause,
      order: [
        ['precio"','DESC']
      ],
      include: [
        {
          model: ImgModeloAsociado,
          attributes: ['id','orden','img_name','thumbnail_img','detalles_imgGde','detalles_imgChica'],
          separate:true,
          order: [
            ['orden','ASC']
          ],
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
        { // El modelo Cliente da la relacion de Favoritos
          model:Cliente,
          attributes: ["id", "userId"],
          required: false, // Mantiene propiedades sin clientes
          where: userId ? { userId } : {userId:"x000"} // Filtra solo si se pasa un userId, de lo contrario se da un UserId que no existe
        },
      ]
    },);
    
    dataPropiedad? res.json(dataPropiedad) : res.json({Mensaje:"No se encontraron datos de propiedades"});
    
  } catch (e) {
    res.send(e);
  } 
}
);

server.get("/getDataandImagenModeloAsociadoPropiedad/:DesarrolloId", async (req, res) => {
  try {
    const {DesarrolloId} = req.params;
    const dataPropiedad = await ModeloAsociadoAlDesarrollo.findAll({
      where: {
        DesarrolloId, publicada:true
      },
      order: [
        ['precio', 'ASC'],
      ],
      include: [
        {
          model: ImgModeloAsociado,
          attributes: ['orden','img_name','thumbnail_img','detalles_imgGde','detalles_imgChica'],
          separate:true,
          order: [
            ['orden','ASC']
          ],
        },
        {
          model: AmenidadesdelaPropiedad, 
          through: {
            attributes: []
          }
        },
      ], 
      
    },);
    
    dataPropiedad? res.json(dataPropiedad) : res.json({Mensaje:"No se encontraron datos de propiedades"});
    
  } catch (e) {
    res.send(e);
  } 
});

/* server.get("/getModelo/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const dataPropiedad = await ModeloAsociadoPropiedad.findAll({
      where: {
        id
      },
      include: [
        {
          model: ImgModeloAsociado,
          attributes: ['img_name'],
        }
      ]
    },);
    
    dataPropiedad? res.json(dataPropiedad) : res.json({Mensaje:"No se encontraron datos de propiedades"});
    
  } catch (e) {
    res.send(e);
  } 
}); */

server.get("/detallesModeloAsociadoPropiedad/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const {userId} = req.query;
    console.log("Buscando Detalles" + id);
    const dataPropiedad = await ModeloAsociadoAlDesarrollo.findOne({
      where:{id:id},
      order: [
        [ImgModeloAsociado, 'orden','ASC']
      ],
      include: [
        {
          model: ImgModeloAsociado,
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
          model: Equipamiento
        },
        {
          model: Desarrollo,
          attributes: ['id','precioMin', 'precioMax', 'calle', 'numeroPropiedad','posicion', 'tipodeDesarrollo'],
          include: [{
              model: ImgDesarrollo,
              attributes: ['orden','img_name','thumbnail_img','detalles_imgGde','detalles_imgChica'],
              separate:true,
              order: [
                [ 'orden','ASC']
              ],
            }, 
            {
              model: AmenidadesDesarrollo,
              attributes: ['nombreAmenidad']
            },
            {
              model: TipodePropiedad
            },
            {
              model: EstiloArquitectura
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
          ],
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
  } catch (e) {
    res.send(e);
  }
})

function isAuthenticated (req, res, next) {
  console.log("77 En IS AUTH " +req.session.passport)
  if (req.session.passport.user) {
    console.log("79 SI ESTA Authenticado ")
    next()}
  else next('route')
}

server.get("/modelosFavoritos/:userId",  async (req, res) => {
  try {
      let {userId} = req.params;

      const cliente = await Cliente.findOne({
        where: {
            userId
          }
      });

      const ModeloAsociado = await ModeloAsociadoAlDesarrollo.findAll({
          where:{publicada:true},
          order: [
            ['precio"','DESC']
          ],
          include: [
            {
              model: ImgModeloAsociado,
              attributes: ['id','orden','img_name','thumbnail_img','detalles_imgGde','detalles_imgChica'],
              separate:true,
              order: [
                ['orden','ASC']
              ],
            }, 
            {
              model: AmenidadesdelaPropiedad, 
              through: {
                attributes: []
              }
            },
            {
              model: Equipamiento
            },
            {
              model:Cliente,
              attributes: ['id'],
            }
          ]
      });
      res.json(ModeloAsociado)
  }
  catch (error){
      res.json(error)
  }
})

server.get("/seedRefId", async (req, res) => {
  try {
    const Modelo = await ModeloAsociadoAlDesarrollo.findAll();
    for (let i = 0; i < Modelo.length; i++) {
      Modelo[i].ref_id = literal('uuid_generate_v4()'); 
      await Modelo[i].save();
    }
    res.json(Modelo)
  } catch (e) {
    res.send(e)
  }
});

/* server.get("/pruebaRefId", async (req, res) => {
  try {
    const Modelo = await ModeloAsociadoAlDesarrollo.findAll();
    for (let i = 0; i < Modelo.length; i++) {
    }
    Modelo[0].ref_id = literal('uuid_generate_v4()'); 
    await Modelo[0].save();
    res.json(Modelo)
  } catch (e) {
    res.send(e)
  }
}); */

server.get("/actualizar/:propId/:orgId", async (req, res) =>{
  try {
    const {propId, orgId} = req.params
    const propiedad = await ModeloAsociadoAlDesarrollo.findOne({
      where:{id:propId},
    })
    await propiedad.update({OrganizacionId:orgId})
    res.send(propiedad)
  } catch (error) {
    res.send(error)
  }
})

server.get("/getModeloAsociadoPropiedadbyOrg/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const cliente = await Cliente.findOne({ where:{userId} });
    const dataPropiedad = await ModeloAsociadoAlDesarrollo.findAll({
      where:{ OrganizacionId:cliente.OrganizacionId },
      order: [
        ['precio"','ASC']
      ],
      include: [
        {
          model: ImgModeloAsociado,
          attributes: ['id','orden','img_name','thumbnail_img','detalles_imgGde','detalles_imgChica'],
          separate:true,
          order: [
            ['orden','ASC']
          ],
        }, 
        {
          model: AmenidadesdelaPropiedad, 
          through: {
            attributes: []
          }
        },
        {
          model: Equipamiento
        },
      ]
    },);
    
    dataPropiedad? res.json(dataPropiedad) : res.json({Mensaje:"No se encontraron datos de propiedades"});
    
  } catch (e) {
    res.send(e);
  } 
}
);

server.get("/publicar/:modeloId", async (req,res) => {
  try{
    const { modeloId } = req.params;
    const modelo = await ModeloAsociadoAlDesarrollo.findByPk(modeloId);
    modelo.publicada = !modelo.publicada;
    await modelo.save();
    
    res.json(modelo)
  } catch(error){
    res.json(error)
  }
})


// Para ver las imagenes
server.use('/imagenes', express.static(public));

module.exports =  server;