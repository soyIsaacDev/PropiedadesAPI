const server = require("express").Router();
const { Op } = require("sequelize");

const { Propiedad, Favoritos, ImgPropiedad, Cliente, ModelosFavoritos, ModeloAsociadoPropiedad, ImgModeloAsociado  } = require("../db");

// TipodeProp:  1 = Desarrollo : 2 = ModeloAsociado
server.post("/agregarFavorito",  async (req,res)=> {
    try {
        const { userId, PropiedadId, TipodeProp} = req.body;
        const cliente = await Cliente.findOne({
            where: {
                userId
              }
        });
        console.log("Cliente ID " + userId + " Prop Id " + PropiedadId)

        if(TipodeProp===1){
            const desarrolloFavorito = await Favoritos.create({
                ClienteId:cliente.id,
                PropiedadId
            });
            res.json(desarrolloFavorito)
        }
        else{
            const modeloFavorito = await ModelosFavoritos.create({
                ClienteId:cliente.id,
                ModeloAsociadoPropiedadId:PropiedadId
            });
            res.json(modeloFavorito)
        }
        
    } catch (e) {
        res.send(e);
    }
})

server.post("/eliminarFavorito", async(req, res) => {
    try {
        const { userId, PropiedadId, TipodeProp } = req.body;
        const cliente = await Cliente.findOne({
            where: {
                userId
              }
        });
        const eliminarDesarrolloFavorito = await Favoritos.findOne({
            where: {
                [Op.and]:[{"PropiedadId":PropiedadId}, {"ClienteId":cliente.id}]
            }
        })
        const eliminarModeloFavorito = await ModelosFavoritos.findOne({
            where: {
                [Op.and]:[{"ModeloAsociadoPropiedadId":PropiedadId}, {"ClienteId":cliente.id}]
            }
        })
        if(TipodeProp===1){
            await eliminarDesarrolloFavorito.destroy();
        }
        else{
            await eliminarModeloFavorito.destroy();
        }

        res.json(TipodeProp===1? eliminarDesarrolloFavorito : eliminarModeloFavorito);
    } catch (e) {
        res.send(e);
    }
})

server.get("/esfavorita/:PropiedadId/:ClienteId", async (req, res) => {
    try {
        const { PropiedadId, ClienteId } = req.params
        const propiedadFavorita = await Favoritos.findOne({
            where: {
                [Op.and]:[{"PropiedadId":PropiedadId}, {"ClienteId":ClienteId}]
            }
        });
        const esfavorita = {favorita : 0};
        propiedadFavorita? esfavorita.favorita = 1 : esfavorita.favorita = 0
        res.send(esfavorita)
    } catch (e) {
        res.send(e)
    }
})

server.get("/favoritos/:userId", async (req, res) => {
    try {
        let {userId} = req.params;

        const propiedadesFavoritas = await Cliente.findOne({
            where: {
                userId
              }, 
              include: [
                {
                    model:Propiedad
                },
              ]
        });

        const FavoritasconImg = [];

        for (let i = 0; i < propiedadesFavoritas.Propiedads.length; i++) {
            const imgProp = await ImgPropiedad.findAll({
                where: {
                    PropiedadId:propiedadesFavoritas.Propiedads[i].id
                },
                attributes: ['img_name']
            })
            const Favoritas = {
                id: propiedadesFavoritas.Propiedads[i].id,
                nombreDesarrollo:propiedadesFavoritas.Propiedads[i].nombreDesarrollo,
                precio: propiedadesFavoritas.Propiedads[i].precio,
                recamaras: propiedadesFavoritas.Propiedads[i].recamaras,
                baños: propiedadesFavoritas.Propiedads[i].baños,
                favorita: 1,
                ImgPropiedads:imgProp
            }
            FavoritasconImg.push(Favoritas)
        }
        
        res.json(FavoritasconImg);
    } catch (e) {
        res.send(e)
    }
})

server.get("/desarrolloFav/:userId", async (req, res) => {
    try {
        let {userId} = req.params;

        const cliente = await Cliente.findOne({
            where: {
                userId
              }
        });
        const propiedadFavorita = await Favoritos.findAll({
            where: {
                ClienteId:cliente.id
            },
        });
        res.send(propiedadFavorita)
    } catch (e) {
        res.send(e)
    }
})

server.get("/modelosFav/:userId", async (req, res) => {
    try {
        let {userId} = req.params;

        const cliente = await Cliente.findOne({
            where: {
                userId
              }
        });
        const modelosFavoritos = await ModelosFavoritos.findAll({
            where: {
                ClienteId:cliente.id
            },
        });
        res.send(modelosFavoritos)
    } catch (e) {
        res.send(e)
    }
})

server.get("/propiedadesconfavoritos/:userId",  async (req, res) => {
    try {
        let {userId} = req.params;
  
        const cliente = await Cliente.findOne({
          where: {
              userId
            }
        });
  
        const AllPropiedades = await Propiedad.findAll({
            include: [
              {
                model: ImgPropiedad,
                attributes: ['img_name','thumbnail_img','detalles_imgGde','detalles_imgChica'],
              }
            ]
        },);
        
        const AllModelos = await ModeloAsociadoPropiedad.findAll({
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
          ]
        },);
  
        const desarrollosFavoritos = await Favoritos.findAll({
            where: {
                ClienteId:cliente.id
              }
        });

        const modeloFavorito = await ModelosFavoritos.findAll({
            where: {
                ClienteId:cliente.id
            },
        });
        
        const AllPropandFav = [];
        const AllPropCopy = JSON.parse(JSON.stringify(AllPropiedades));
        const AllModelosCopy = JSON.parse(JSON.stringify(AllModelos));
        //PropiedadId

        for (let i = 0; i < AllPropCopy.length; i++) {
            for (let x = 0; x < desarrollosFavoritos.length; x++) {
                if(desarrollosFavoritos[x].PropiedadId === AllPropCopy[i].id){
                  AllPropCopy[i].favorita=1;
                  AllPropandFav.push(AllPropCopy[i]);
                }
            }
            for (let z = 0; z < AllModelosCopy.length; z++) {
                if(AllModelosCopy[z].PropiedadId === AllPropCopy[i].id ){
                    for (let y = 0; y < modeloFavorito.length; y++) {
                        if(modeloFavorito[y].ModeloAsociadoPropiedadId === AllModelosCopy[z].id){

                            AllModelosCopy[z].favorita = 1;
                            AllPropandFav.push(AllModelosCopy[z]);
                        }
                    }
                }
            }
        }
            
        res.json(AllPropandFav);
    } catch (e) {
        res.send(e)
    }
  });



module.exports = server;