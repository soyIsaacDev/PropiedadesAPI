const server = require("express").Router();
const { Desarrollo, ImgDesarrollo, ModeloAsociadoAlDesarrollo, ImgModeloAsociado, AmenidadesDesarrollo, 
  TipodePropiedad, TipoOperacion, Ciudad, Municipio, Estado, Colonia, EstiloArquitectura   } = require("../db");

server.get("/getTodasLasPropiedades", async (req, res) => {
    try {
      const dataDesarrollo = await Desarrollo.findAll({
        order: [
            ['id', 'ASC'],
        ],
        include: [
          {
            model: ImgDesarrollo,
            attributes: ['img_name','thumbnail_img','detalles_imgGde','detalles_imgChica'],
          }
        ]
      },);      
      
      const dataModelo = await ModeloAsociadoAlDesarrollo.findAll({
        order: [
            ['PropiedadId', 'ASC'],
        ],
        include: [
          {
            model: ImgModeloAsociado,
            attributes: ['img_name','thumbnail_img','detalles_imgGde','detalles_imgChica'],
          }
        ]
      },);

      const allPropiedades = [];

      for (let i = 0; i < dataDesarrollo.length; i++) {
        allPropiedades.push(dataDesarrollo[i]);
        
        for (let x = 0; x < dataModelo.length; x++) {
            if(dataDesarrollo[i].id === dataModelo[x].PropiedadId){
                allPropiedades.push(dataModelo[x]);  
            }
            if(dataModelo[x+1]=== undefined){
                break
            }
            if(dataDesarrollo[i].id !== dataModelo[x+1].PropiedadId){ 
               if(dataDesarrollo[i].id === dataModelo[x].PropiedadId){
                    
                    dataModelo.splice(0,x+1);
                }             
                break
            }
            
            
          }    
      }
      //console.log("Data Desarrollo " + dataDesarrollo)
      //console.log("Data Modelo   " + dataModelo);
      //console.log("FIN ")
      console.log("FINAL        "+allPropiedades) 
      
      allPropiedades? res.json(allPropiedades) : res.json({Mensaje:"No se encontraron datos de propiedades"});
    } catch (e) {
      res.send(e);
    } 
});

server.get("/getTodasLasPropiedadesconIncludes", async (req, res) => {
  try {
    console.log("AllProp Get Todas Las Propiedades con Includes")
    const dataDesarrollo = await Desarrollo.findAll({
      order: [
          ['id', 'ASC'],
      ],
      include: [
        {
          model: ImgDesarrollo,
          attributes: ['img_name','thumbnail_img','detalles_imgGde','detalles_imgChica'],
        },
        
        {
          model: AmenidadesDesarrollo,
          through: {
            attributes: []
          }
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
        {
          model: ModeloAsociadoAlDesarrollo,
          include: 
            {
              model: ImgModeloAsociado,
              attributes: ['img_name','thumbnail_img','detalles_imgGde','detalles_imgChica'],
            }
          
        },
      ]
    },);      
    
    dataDesarrollo? res.json(dataDesarrollo) : res.json({Mensaje:"No se encontraron datos de propiedades"});
  } catch (e) {
    res.send(e);
  } 
}
);

module.exports =  server;