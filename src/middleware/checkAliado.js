const { Aliado  } = require("../db");
const servidorAutorizacion = require("express").Router();
const { Op } = require("sequelize");

const checkAliado = async (req, res, next)  => {
  try {
    const bodyObj = req.body.data;
    const parsedbodyObj = JSON.parse(bodyObj);
    userId = parsedbodyObj.userId;
    
    const aliado = await Aliado.findOne({
        where:{userId}
    })

    if(aliado === null ){
        res.status(404).json({Mensaje:"El Aliado no existe"});
        return;
    }
    if(aliado.autorizaciondePublicar === "Ninguna"){
      res.status(404).json({Mensaje:"El Aliado no esta autorizado"});
    }
    else {
      req.aliado = aliado;
      console.log("ALIADO AUTORIZADO")
      next();
    }

  } catch (error) {
        
  }
}

module.exports = { checkAliado };