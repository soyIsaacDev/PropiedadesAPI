const server = require("express").Router();
const express = require("express");
const path = require('path');
var public = path.join(__dirname,'../../uploads');
const upload = require("../middleware/upload");



const { Propiedad, ImgPropiedad } = require("../db");
const uploadImgPropiedad = require("../controllers/uploadImgPropiedad");
//const upload = require("../middleware/upload");
const uploadMultiple = require("../middleware/uploadMultiple");

server.post("/agregarImagenPropiedad", upload.single("file"), 
uploadImgPropiedad.uploadImagenPropiedad );

server.post('/nuevaPropiedad', uploadMultiple, function (req, res, next) {
  /* console.log(JSON.stringify(req.file));
  const archivos = req.file;
  console.log(JSON.stringify(archivos))
  res.json(archivos) */
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
})

server.post("/enuevaPropiedad", uploadMultiple ,async (req, res) => { 
    try {
      // creamos la propiedad con sus datos
      console.log("Req File "+JSON.stringify(req.file))
      const bodyObj = req.body.data;
      const parsedbodyObj = JSON.parse(bodyObj)
      const {nombrePropiedad, precio, recamaras, baños, calle, 
        colonia, numeroCasa, numeroInterior} = parsedbodyObj
      
        
      // guardamos las imagenes
      const files = req.files;
      console.log("Archivos Cargados "+ files)
      if (files === undefined || files === null || files === "") {
        return res.json({"Mensaje":`Selecciona una imagen para tu propiedad`});
      }
      else{
        /* const Property = await Propiedad.create({
          nombrePropiedad,
          precio,
          recamaras, 
          baños, 
          calle,
          colonia,
          numeroCasa,
          numeroInterior
           
      }) */
         const Property = await Propiedad.findOrCreate({
          where: {
            nombrePropiedad
          },
          defaults:{ 
            precio, 
            recamaras, 
            baños, 
            calle, 
            colonia, 
            numeroCasa, 
            numeroInterior
          }
        })/* .then((response) => {
          // Guardar los archivos en uploads
          files.forEach(async (file) => {
  
            const imagenPropiedad = await ImgPropiedad.create({
              type: req.file.mimetype,
              img_name: req.file.filename
            }).then(() => {
              imagenPropiedad.PropiedadId = response.id
            });
            await imagenPropiedad.save();
  
            const filePath = `uploads/${file.filename}`;
            fs.rename(file.path, filePath, (err) => {
              if (err) {
                // Handle error appropriately and send an error response
                return res.status(500).json({ error: 'Failed to store the file' });
              }
            });
          });
          

        });  */
        res.json(Property);
      }
      
      
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
server.use('/imagenes', express.static(public));

module.exports =  server;

module.exports = {
    PropiedadRoute: server
  }