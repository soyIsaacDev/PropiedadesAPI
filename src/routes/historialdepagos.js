const server = require("express").Router();

const { HistorialdePagos } = require("../db");

server.get("/", async (req,res)=> {
    try {
        /* const historialDePagos = await HistorialdePagos.findAll({
            where: {
                userId
              }
        }); */
        const historialDePagos = await HistorialdePagos.findAll()

        res.send(historialDePagos)
    } catch (e) {
        
    }
});

module.exports = server;