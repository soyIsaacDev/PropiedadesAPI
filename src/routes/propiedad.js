const server = require("express").Router();
const express = require("express");

const { Propiedad, ImgPropiedad } = require("../db");
const uploadImgPropiedad = require("../controllers/uploadImgPropiedad");
const upload = require("../middleware/upload");

server.post("/agregarImagenPropiedad", upload.single("file"), 
uploadImgPropiedad.uploadImagenPropiedad );

server.post("/nuevaPropiedad", async (req, res) => { 
    try {
      const { nombrePropiedad, precio, recamaras, baños, calle, 
              colonia, numeroCasa, numeroInterior} = req.body;
      const propiedad = await Propiedad.findOrCreate({
          where: {
            nombrePropiedad
          } 
      });
      res.json(propiedad);
    } catch (error) {
      res.send(error);
    }
});

server.get("/getDataandImagenPropiedades", async (req, res) => {
    try {
      const dataPropiedad = await ImgPropiedad.findAll({
        attributes: ['img_name'],
        include: [
          {
            model: Propiedad
          },
        ]
      },);
      dataPropiedad? res.send(dataPropiedad) : res.json({Mensaje:"No se encontraron datos de propiedades"});
      
    } catch (e) {
      res.send(e);
    } 
  }
);

// Para ver las imagenes
const path = require('path');
var public = path.join(__dirname,'../../uploads');
server.use('/imagenes', express.static(public));

module.exports =  server;

module.exports = {
    PropiedadRoute: server
  }