const server = require("express").Router();
const { Op } = require("sequelize");

const { Desarrollo, desarrollos_favoritos, ImgDesarrollo, Cliente, modelos_favoritos, ModeloAsociadoAlDesarrollo,
  ImgModeloAsociado, prop_independientes_favoritas, PropiedadIndependiente, ImgPropiedadIndependiente  } = require("../db");

// TipodeProp:  1 = Desarrollo : 2 = ModeloAsociado
server.post("/agregarFavorito",  async (req,res)=> {
    try {
        const { userId, PropiedadId, tipodeDesarrollo} = req.body;
        const cliente = await Cliente.findOne({
            where: {
                userId
              }
        });
        console.log("Cliente ID " + cliente.id + " Prop Id " + PropiedadId + " Tipo " + tipodeDesarrollo)
        
        if(tipodeDesarrollo==="Desarrollo"){
            console.log("Crear desarrollo")
            const desarrolloFavorito = await desarrollos_favoritos.create({
                ClienteId:cliente.id,
                DesarrolloId:PropiedadId
            });
            console.log(desarrolloFavorito)
            res.json(desarrolloFavorito)
        }
        else if(tipodeDesarrollo==="Modelo"){
            const modeloFavorito = await modelos_favoritos.create({
                ClienteId:cliente.id,
                ModeloAsociadoAlDesarrolloId:PropiedadId
            });
            res.json(modeloFavorito)
        }
        else if(tipodeDesarrollo==="Independiente"){
            const independienteFavorita = await prop_independientes_favoritas.create({
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
                const eliminarDesarrolloFavorito = await desarrollos_favoritos.findOne({
                    where: {
                        [Op.and]:[{"DesarrolloId":PropiedadId}, {"ClienteId":cliente.id}]
                    }
                })
                await eliminarDesarrolloFavorito.destroy();
                favoritoEliminado = eliminarDesarrolloFavorito;
                break;
            case "Modelo":
                const eliminarModeloFavorito = await modelos_favoritos.findOne({
                    where: {
                        [Op.and]:[{"ModeloAsociadoAlDesarrolloId":PropiedadId}, {"ClienteId":cliente.id}]
                    }
                })
                await eliminarModeloFavorito.destroy();
                favoritoEliminado = eliminarModeloFavorito;
                break;
            case "Independiente":
                const eliminarIndependienteFavorito = await prop_independientes_favoritas.findOne({
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
        const propiedadFavorita = await desarrollos_favoritos.findOne({
            where: {
                [Op.and]:[{"DesarrolloId":PropiedadId}, {"ClienteId":ClienteId}]
            }
        });
        const esfavorita = {favorita : 0};
        propiedadFavorita? esfavorita.favorita = 1 : esfavorita.favorita = 0
        res.send(esfavorita)
    } catch (e) {
        res.send(e)
    }
})

server.get("/desarrolloFav/:userId", async (req, res) => {
    try {
        let {userId} = req.params;
        if(userId === null){res.json("")}
        const desarrollosFavoritos = await Desarrollo.findAll({
            where:{publicada:true},
            order: [
              ['precioMin','DESC']
            ],
            include: [
                {
                    model: ImgDesarrollo,
                    attributes: ['id','orden','img_name','thumbnail_img','detalles_imgGde','detalles_imgChica'],
                    separate:true,
                    order: [
                      ['orden','ASC']
                    ],
                },
                {// El modelo Cliente da la relacion de desarrollos_favoritos
                    model:Cliente,
                    attributes: ["id", "userId"],
                    required: true, // Mantiene propiedades sin clientes
                    where: { userId } // Filtra solo si se pasa un userId, de lo contrario se da un UserId que no existe
                },
            ]
            
        });
        desarrollosFavoritos? res.json(desarrollosFavoritos) : res.json("")        
    } catch (e) {
        res.send(e)
    }
})

server.get("/modelosFav/:userId", async (req, res) => {
    try {
        console.log("SOLICITANDO MODELOS FAV")
        let {userId} = req.params;
        if(userId === null){res.json("")}
        const modelosFavoritos = await ModeloAsociadoAlDesarrollo.findAll({
            where:{publicada:true},
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
              {// El modelo Cliente da la relacion de desarrollos_favoritos
                model:Cliente,
                attributes: ["id", "userId"],
                required: true, 
                where: {userId}
              },
            ]
          });
        modelosFavoritos? res.json(modelosFavoritos) : res.json("");
    } catch (e) {
        res.send(e)
    }
})

server.get("/independienteFav/:userId", async (req, res) => {
    try {
        let {userId} = req.params;
        if(userId === null){res.json("")}

        const propiedadesIndependientesFav = await PropiedadIndependiente.findAll({
            where:{publicada:true},
            order: [ ['precio"','ASC'] ],
            include: [
              {
                model: ImgPropiedadIndependiente,
                attributes: ['id','orden','img_name','thumbnail_img','detalles_imgGde','detalles_imgChica'],
                separate:true,
                order: [
                  ['orden','ASC']
                ],
              }, 
              {// El modelo Cliente da la relacion de desarrollos_favoritos
                model:Cliente,
                attributes: ["id", "userId"],
                required: true, 
                where: {userId}
              },
            ]
        })
        propiedadesIndependientesFav? res.json(propiedadesIndependientesFav) : res.json("");
    } catch (e) {
        res.send(e)
    }
})

server.get("/propiedadesconfavoritos/:userId",  async (req, res) => {
  try {
      let {userId} = req.params;
      const DesarrollosFav = await Desarrollo.findAll({
          where:{publicada:true},
          order: [
            ['precioMin','DESC']
          ],
          include: [
              {
                  model: ImgDesarrollo,
                  attributes: ['id','orden','img_name','thumbnail_img','detalles_imgGde','detalles_imgChica'],
                  separate:true,
                  order: [
                    ['orden','ASC']
                  ],
              },
              {// El modelo Cliente da la relacion de desarrollos_favoritos
                  model:Cliente,
                  attributes: ["id", "userId"],
                  required: true, // Mantiene propiedades sin clientes
                  where: { userId } // Filtra solo si se pasa un userId, de lo contrario se da un UserId que no existe
              },
          ]
          
      });

      
      const modelosFav = await ModeloAsociadoAlDesarrollo.findAll({
        where:{publicada:true},
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
          {// El modelo Cliente da la relacion de desarrollos_favoritos
            model:Cliente,
            attributes: ["id", "userId"],
            required: true, 
            where: {userId}
          },
        ]
      });
      const propiedadesIndependientesFav = await PropiedadIndependiente.findAll({
        where:{publicada:true},
          order: [ ['precio"','ASC'] ],
          include: [
            {
              model: ImgPropiedadIndependiente,
              attributes: ['id','orden','img_name','thumbnail_img','detalles_imgGde','detalles_imgChica'],
              separate:true,
              order: [
                ['orden','ASC']
              ],
            }, 
            {// El modelo Cliente da la relacion de desarrollos_favoritos
              model:Cliente,
              attributes: ["id", "userId"],
              required: true, 
              where: {userId}
            },
          ]
      })
      const todasLasPropiedades = [...propiedadesIndependientesFav, ...DesarrollosFav, ...modelosFav]
      res.json(todasLasPropiedades)
  }
  catch (e){
      res.send(e)
  }
})


module.exports = server;