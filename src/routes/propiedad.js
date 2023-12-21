const server = require("express").Router();
const express = require("express");
const path = require('path');


var public = path.join(__dirname,'../../uploads');
const upload = require("../middleware/upload");
const uploadImgPropiedad = require("../controllers/uploadImgPropiedad");
const uploadMultiple = require("../middleware/uploadMultiple");
const uploadImagenesPropiedad = require("../controllers/uploadMultipleImg");
const gcpImageUpload = require('../middleware/uploadMulipleGCP');

const { Propiedad, ImgPropiedad, AmenidadesDesarrollo, AmenidadesPropiedad,TipodePropiedad, 
  TipoOperacion, Estado, Municipio, Ciudad, Colonia, Cliente, Favoritos  } = require("../db");


/* server.post("/agregarImagenPropiedad", upload.single("file"), 
uploadImgPropiedad.uploadImagenPropiedad ) */;

server.post("/nuevaPropiedad", 
  gcpImageUpload.multer.single('imagenesfiles'),
  console.log("Uploaded, now send to GCS"),
  gcpImageUpload.sendUploadToGCS,
  async (req, res) => {
    try {
      res.json(`Se creo la Propiedad` )
      
    } catch (e) {
      res.send(e)
    }
  }
);

//server.post('/nuevaPropiedad', uploadMultiple, uploadImagenesPropiedad.uploadImagenPropiedad); 

server.get("/getDataandImagenPropiedades", async (req, res) => {
  try {
    const dataPropiedad = await Propiedad.findAll({
      include: [
        {
          model: ImgPropiedad,
          attributes: ['img_name'],
        }
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

function isAuthenticated (req, res, next) {
  console.log("77 En IS AUTH " +req.session.passport)
  if (req.session.passport.user) {
    console.log("79 SI ESTA Authenticado ")
    next()}
  else next('route')
}

server.get("/propiedadesconfavoritos/:ClienteId", isAuthenticated, async (req, res) => {
  try {
      let {ClienteId} = req.params;

      const AllPropiedades = await Propiedad.findAll({
          include: [
            {
              model: ImgPropiedad,
              attributes: ['img_name'],
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

// Para ver las imagenes
server.use('/imagenes', express.static(public));

module.exports =  server;