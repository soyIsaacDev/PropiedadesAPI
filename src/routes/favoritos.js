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
        
        if (!cliente) {
            return res.status(404).json({Mensaje:"Cliente no encontrado"});
        }
        
        if(tipodeDesarrollo==="Desarrollo"){
            console.log("Crear desarrollo")
            const desarrolloFavorito = await desarrollos_favoritos.create({
                ClienteId:cliente.id,
                DesarrolloId:PropiedadId
            });
            console.log(desarrolloFavorito)
            res.status(201).json(desarrolloFavorito)
        }
        else if(tipodeDesarrollo==="Modelo"){
            const modeloFavorito = await modelos_favoritos.create({
                ClienteId:cliente.id,
                ModeloAsociadoAlDesarrolloId:PropiedadId
            });
            res.status(201).json(modeloFavorito)
        }
        else if(tipodeDesarrollo==="Independiente"){
            const independienteFavorita = await prop_independientes_favoritas.create({
                ClienteId:cliente.id,
                PropiedadIndependienteId:PropiedadId
            });
            res.status(201).json(independienteFavorita)
        }
        
    } catch (e) {
        res.status(500).json(e);
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
        if (!cliente) {
            return res.status(404).json({Mensaje:"Cliente no encontrado"});
        }
        
        let favoritoEliminado;
        switch (tipodeDesarrollo) {
            case "Desarrollo":
                const eliminarDesarrolloFavorito = await desarrollos_favoritos.findOne({
                    where: {
                        [Op.and]:[{"DesarrolloId":PropiedadId}, {"ClienteId":cliente.id}]
                    }
                })
                if (!eliminarDesarrolloFavorito) {
                    return res.status(404).json({Mensaje:"Favorito no encontrado"});
                }
                await eliminarDesarrolloFavorito.destroy();
                favoritoEliminado = eliminarDesarrolloFavorito;
                break;
            case "Modelo":
                const eliminarModeloFavorito = await modelos_favoritos.findOne({
                    where: {
                        [Op.and]:[{"ModeloAsociadoAlDesarrolloId":PropiedadId}, {"ClienteId":cliente.id}]
                    }
                })
                if (!eliminarModeloFavorito) {
                    return res.status(404).json({Mensaje:"Favorito no encontrado"});
                }
                await eliminarModeloFavorito.destroy();
                favoritoEliminado = eliminarModeloFavorito;
                break;
            case "Independiente":
                const eliminarIndependienteFavorito = await prop_independientes_favoritas.findOne({
                    where: {
                        [Op.and]:[{"PropiedadIndependienteId":PropiedadId}, {"ClienteId":cliente.id}]
                    }
                })
                if (!eliminarIndependienteFavorito) {
                    return res.status(404).json({Mensaje:"Favorito no encontrado"});
                }
                await eliminarIndependienteFavorito.destroy();
                favoritoEliminado = eliminarIndependienteFavorito;
                break;
            default:
                break;
        }

        res.status(200).json(favoritoEliminado);
    } catch (e) {
        res.status(500).json(e);
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
        res.status(200).json(esfavorita)
    } catch (e) {
        res.status(500).json(e);
    }
})

server.get("/desarrolloFav/:userId", async (req, res) => {
    try {
        let {userId} = req.params;
        if(userId === null){return res.status(400).json({Mensaje:"UserId no puede ser null"})}
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
        desarrollosFavoritos? res.status(200).json(desarrollosFavoritos) : res.status(404).json({Mensaje:"No se encontraron desarrollos favoritos"});
    } catch (e) {
        res.status(500).json(e);
    }
})

server.get("/modelosFav/:userId", async (req, res) => {
    try {
        console.log("SOLICITANDO MODELOS FAV")
        let {userId} = req.params;
        if(userId === null){return res.status(400).json({Mensaje:"UserId no puede ser null"})}
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
        modelosFavoritos? res.status(200).json(modelosFavoritos) : res.status(404).json({Mensaje:"No se encontraron modelos favoritos"});
    } catch (e) {
        res.status(500).json(e);
    }
})

server.get("/independienteFav/:userId", async (req, res) => {
    try {
        let {userId} = req.params;
        if(userId === null){return res.status(400).json({Mensaje:"UserId no puede ser null"})}

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
        propiedadesIndependientesFav? res.status(200).json(propiedadesIndependientesFav) : res.status(404).json({Mensaje:"No se encontraron propiedades independientes favoritas"});
    } catch (e) {
        res.status(500).json(e);
    }
})

server.get("/propiedadesconfavoritos/:userId",  async (req, res) => {
  try {
      let {userId} = req.params;
      if(userId === null){return res.status(400).json({Mensaje:"UserId no puede ser null"})}
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
      res.status(200).json(todasLasPropiedades)
  }
  catch (e){
      res.send(e)
  }
})


module.exports = server;