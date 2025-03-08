const server = require("express").Router();
const express = require("express");
const path = require('path');


var public = path.join(__dirname,'../../uploads');

const { Propiedad, ImgPropiedad, AmenidadesDesarrollo, AmenidadesPropiedad,TipodePropiedad, 
  TipoOperacion, Estado, Municipio, Ciudad, Colonia, Cliente, Favoritos, ModeloAsociadoPropiedad, 
  ImgModeloAsociado, EstiloArquitectura  } = require("../db");

const {literal} = require ('sequelize');

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
          model: AmenidadesPropiedad,
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
    let {userId} = req.query;

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
          model: AmenidadesPropiedad,
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

server.get("/getDataandImagenModeloAsociadoPropiedad/:PropiedadId", async (req, res) => {
  try {
    const {PropiedadId} = req.params;
    const dataPropiedad = await ModeloAsociadoPropiedad.findAll({
      where: {
        PropiedadId
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
          model: AmenidadesPropiedad,
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
    console.log("Buscando Detalles" + id);
    const dataPropiedad = await ModeloAsociadoPropiedad.findOne({
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
          model: AmenidadesPropiedad,
          through: {
            attributes: []
          }
        },
        {
          model: Propiedad,
          attributes: ['id','precioMin', 'precioMax', 'calle', 'numeroPropiedad','posicion'],
          include: [{
              model: ImgPropiedad,
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
        }
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

      const ModeloAsociado = await ModeloAsociadoPropiedad.findAll({
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
              model: AmenidadesPropiedad,
              through: {
                attributes: []
              }
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

server.get("/propiedadesconfavoritos/:ClienteId", isAuthenticated, async (req, res) => {
  try {
      let {ClienteId} = req.params;

      const AllPropiedades = await Propiedad.findAll({
          include: [
            {
              model: ImgPropiedad,
              attributes: ['img_name','thumbnail_img','detalles_imgGde','detalles_imgChica'],
            }
          ]
        },);

      const Fav = await Favoritos.findAll({
          where: {
              ClienteId
            }
      });
      
      const AllPropandFav = [];
      for (let i = 0; i < AllPropiedades.length; i++) {
          const PropandFav = {
              id: AllPropiedades[i].id,
              nombreDesarrollo:AllPropiedades[i].nombreDesarrollo,
              precio: AllPropiedades[i].precio,
              recamaras: AllPropiedades[i].recamaras,
              baños: AllPropiedades[i].baños,
              favorita: 0,
              posicion:AllPropiedades[i].posicion,
              ImgPropiedads: AllPropiedades[i].ImgPropiedads,
              
          }
          for (let x = 0; x < Fav.length; x++) {
              if(Fav[x].PropiedadId === AllPropiedades[i].id){
                  PropandFav.favorita= 1
              }
          }
          AllPropandFav.push(PropandFav);
      }
      res.json(AllPropandFav);
  } catch (e) {
      res.send(e)
  }
})

server.get("/seedRefId", async (req, res) => {
  try {
    const Modelo = await ModeloAsociadoPropiedad.findAll();
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
    const Modelo = await ModeloAsociadoPropiedad.findAll();
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
    const propiedad = await ModeloAsociadoPropiedad.findOne({
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
    const dataPropiedad = await ModeloAsociadoPropiedad.findAll({
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
          model: AmenidadesPropiedad,
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
);


// Para ver las imagenes
server.use('/imagenes', express.static(public));

module.exports =  server;