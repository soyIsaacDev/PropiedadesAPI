const server = require("express").Router();
const express = require("express");
const path = require('path');


var public = path.join(__dirname,'../../uploads');
const upload = require("../middleware/upload");
const uploadImgPropiedad = require("../controllers/uploadImgPropiedad");
const uploadMultiple = require("../middleware/uploadMultiple");
const uploadImagenesPropiedad = require("../controllers/uploadMultipleImg");

const { Propiedad, ImgPropiedad, AmenidadesDesarrollo, AmenidadesPropiedad,TipodePropiedad, 
  TipoOperacion, Estado, Municipio, Ciudad, Colonia  } = require("../db");


server.post("/agregarImagenPropiedad", upload.single("file"), 
uploadImgPropiedad.uploadImagenPropiedad );

server.post('/nuevaPropiedad', uploadMultiple, uploadImagenesPropiedad.uploadImagenPropiedad); 

server.get("/getDataandImagenPropiedades", async (req, res) => {
  try {
    const dataPropiedad = await Propiedad.findAll({
      include: [
        {
          model: ImgPropiedad,
          attributes: ['img_name'],
        },
      ]
    },);
    
    dataPropiedad? res.send(dataPropiedad) : res.json({Mensaje:"No se encontraron datos de propiedades"});
    
  } catch (e) {
    res.send(e);
  } 
}
);

/*    REQ QUERY

server.get("/detallespropiedad", async (req, res) => {
  try {
    const {id} = req.query 
  In Browser   /detallespropiedad/?id=2
*/

server.get("/detallespropiedad/:id", async (req, res) => {
  try {
    const {id} = req.params;
    console.log("Buscando Detalles" + id);
    const dataPropiedad = await Propiedad.findOne({
      where:{id:id},
      include: [
        {
          model: ImgPropiedad,
          attributes: ['img_name'],
        },
        {
          model: AmenidadesDesarrollo,
          through: {
            attributes: []
          }
        },
        {
          model: AmenidadesPropiedad,
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
      ]
    })
    dataPropiedad? res.send(dataPropiedad) : res.json({Mensaje:"No se encontro la propiedad"});
  } catch (e) {
    res.send(e);
  }
})
// Para ver las imagenes
server.use('/imagenes', express.static(public));

module.exports =  server;

module.exports = {
    PropiedadRoute: server
  }