const server = require("express").Router();
const { Op } = require("sequelize");

const { Propiedad, Favoritos, ImgPropiedad, Cliente, ModelosFavoritos, ModeloAsociadoPropiedad,
    AmenidadesPropiedad,
  ImgModeloAsociado, PropIndependienteFavoritas,
   AmenidadesDesarrollo,TipodePropiedad,TipoOperacion, Estado, Municipio, Ciudad, 
  Colonia,  AmenidadesDesarrolloPropiedad, 
  Organizacion, AutorizacionesXTipodeOrg, 
  } = require("../db");

// TipodeProp:  1 = Desarrollo : 2 = ModeloAsociado
server.post("/agregarFavorito",  async (req,res)=> {
    try {
        const { userId, PropiedadId, tipodeDesarrollo} = req.body;
        const cliente = await Cliente.findOne({
            where: {
                userId
              }
        });
        console.log("Cliente ID " + userId + " Prop Id " + PropiedadId)
        
        if(tipodeDesarrollo==="Desarrollo"){
            const desarrolloFavorito = await Favoritos.create({
                ClienteId:cliente.id,
                PropiedadId
            });
            res.json(desarrolloFavorito)
        }
        else if(tipodeDesarrollo==="Modelo"){
            const modeloFavorito = await ModelosFavoritos.create({
                ClienteId:cliente.id,
                ModeloAsociadoPropiedadId:PropiedadId
            });
            res.json(modeloFavorito)
        }
        else if(tipodeDesarrollo==="Independiente"){
            const independienteFavorita = await PropIndependienteFavoritas.create({
                ClienteId:cliente.id,
                PropiedadIndependienteId:PropiedadId
            });
            res.json(independienteFavorita)
        }
        
    } catch (e) {
        res.send(e);
    }
})

server.post("/eliminarFavorito", async(req, res) => {
    try {
        const { userId, PropiedadId, tipodeDesarrollo } = req.body;
        const cliente = await Cliente.findOne({
            where: {
                userId
              }
        });
        
        switch (tipodeDesarrollo) {
            case "Desarrollo":
                const eliminarDesarrolloFavorito = await Favoritos.findOne({
                    where: {
                        [Op.and]:[{"PropiedadId":PropiedadId}, {"ClienteId":cliente.id}]
                    }
                })
                await eliminarDesarrolloFavorito.destroy();
                favoritoEliminado = eliminarDesarrolloFavorito;
                break;
            case "Modelo":
                const eliminarModeloFavorito = await ModelosFavoritos.findOne({
                    where: {
                        [Op.and]:[{"ModeloAsociadoPropiedadId":PropiedadId}, {"ClienteId":cliente.id}]
                    }
                })
                await eliminarModeloFavorito.destroy();
                favoritoEliminado = eliminarModeloFavorito;
                break;
            case "Independiente":
                const eliminarIndependienteFavorito = await PropIndependienteFavoritas.findOne({
                    where: {
                        [Op.and]:[{"PropiedadIndependienteId":PropiedadId}, {"ClienteId":cliente.id}]
                    }
                })
                await eliminarIndependienteFavorito.destroy();
                favoritoEliminado = eliminarIndependienteFavorito;
                break;
            default:
                break;
        }

        res.json(favoritoEliminado);
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
        if(userId === null){res.json([])}

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
        console.log(propiedadFavorita)
        propiedadFavorita? res.json(propiedadFavorita) : res.json([])        
    } catch (e) {
        res.send(e)
    }
})

server.get("/modelosFav/:userId", async (req, res) => {
    try {
        console.log("SOLICITANDO MODELOS FAV")
        let {userId} = req.params;
        if(userId === null){res.json([])}

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

server.get("/independienteFav/:userId", async (req, res) => {
    try {
        let {userId} = req.params;
        if(userId === null){res.json([])}

        const cliente = await Cliente.findOne({
            where: {
                userId
              }
        });
        const independienteFavorita = await PropIndependienteFavoritas.findAll({
            where: {
                ClienteId:cliente.id
            },
        });
        res.send(independienteFavorita)
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
            
        //res.json(AllPropandFav);
    } catch (e) {
        res.send(e)
    }
  });

  




module.exports = server;