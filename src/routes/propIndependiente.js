const server = require("express").Router();
const express = require("express");
const path = require('path');
const public = path.join(__dirname,'../../uploads');

const { PropiedadIndependiente, ImgPropiedadIndependiente, AmenidadesdelaPropiedad, TipodePropiedad, 
  TipoOperacion, Estado, Municipio, Ciudad, Colonia, Cliente, VideoYoutube, Tour3D,
 } = require("../db");
const { Console } = require("console");

server.get("/getPropiedadesIndependientes", async (req, res) => {
    try {
      let {userId} = req.query;

      const propiedadIndepeniente = await PropiedadIndependiente.findAll({
        where:{publicada:true},
        order: [
          ['precio"','DESC']
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
      propiedadIndepeniente? res.json(propiedadIndepeniente) : res.json({Mensaje:"No se encontraron datos de propiedades"});
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