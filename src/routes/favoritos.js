const server = require("express").Router();
const { Op } = require("sequelize");

const { Propiedad, Favoritos, ImgPropiedad, Cliente  } = require("../db");


server.post("/agregarFavorito",  async (req,res)=> {
    try {
        const { ClienteId, PropiedadId} = req.body;
        console.log("Cliente ID " + ClienteId + " Prop Id " + PropiedadId)

        const favorito = await Favoritos.create({
            ClienteId,
            PropiedadId
        })
        console.log("Favorito ->  "+ JSON.stringify(favorito))
        res.json(favorito)

    } catch (e) {
        res.send(e);
    }
})

server.post("/eliminarFavorito", async(req, res) => {
    try {
        const { ClienteId, PropiedadId } = req.body;
        const eliminardeFavoritos = await Favoritos.findOne({
            where: {
                [Op.and]:[{"PropiedadId":PropiedadId}, {"ClienteId":ClienteId}]
            }
        })
        await eliminardeFavoritos.destroy();
        res.json(eliminardeFavoritos);
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

server.get("/favoritos/:ClienteId", async (req, res) => {
    try {
        let {ClienteId} = req.params;

        const propiedadesFavoritas = await Cliente.findOne({
            where: {
                id:ClienteId
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




module.exports = server;