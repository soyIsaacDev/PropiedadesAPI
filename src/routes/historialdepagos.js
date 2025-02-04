const server = require("express").Router();

const { HistorialdePagos } = require("../db");

server.get("/", async (req,res)=> {
    try {
        const historialDePagos = HistorialdePagos.findAll({
            where: {
                userId
              }
        });
    } catch (e) {
        
    }
});

module.exports = server;