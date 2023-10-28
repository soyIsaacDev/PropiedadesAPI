const server = require("express").Router();
const express = require("express");
const path = require('path');


var public = path.join(__dirname,'../../uploads');
const upload = require("../middleware/upload");
const uploadImgPropiedad = require("../controllers/uploadImgPropiedad");
const uploadMultiple = require("../middleware/uploadMultiple");
const uploadImagenesPropiedad = require("../controllers/uploadMultipleImg");

const { Propiedad, ImgPropiedad } = require("../db");


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

/* server.get("/detallespropiedad", async (req, res) => {
  try {
    const {id} = req.query
    const dataPropiedad = await Propiedad.findByPk({
      id,
      include: [
        {
          model: ImgPropiedad,
          attributes: ['img_name'],
        },
      ]
    })
    dataPropiedad? res.send(dataPropiedad) : res.json({Mensaje:"No se encontro la propiedad"});
  } catch (e) {
    res.send(e);
  }
}) */
// Para ver las imagenes
server.use('/imagenes', express.static(public));

module.exports =  server;

module.exports = {
    PropiedadRoute: server
  }