const server = require("express").Router();

const { Desarrollo, ModeloAsociadoAlDesarrollo, PropiedadIndependiente
} = require("../db");

const autorizadoABorrar = async (req, res, next) => {
  try {
    const autorizacion = req.auth;
    if(autorizacion==="Completa") next();
    else {
      res.json("Usuario No Autorizado para Borrar")
    }
  } catch (error) {
    res.json(error)
  }
}

server.post("/hardDeleteDesarrollo", autorizadoABorrar, async (req,res) => {
  try {
    const {id} = req.body;
    const desarrollo = await Desarrollo.findOne({
      where:{id}
    })
    
    if (!desarrollo) {
      return res.status(404).json({error: "Desarrollo no encontrado"})
    }
    
    const { ImgDesarrollo, db } = require("../db");
    
    let transaction;
    try {
      transaction = await db.transaction();
      
      // Borrar imágenes asociadas
      await ImgDesarrollo.destroy({
        where: { DesarrolloId: id }
      });
      
      // Borrar registros de tablas intermedias
      await db.query(`
        DELETE FROM "amenidades_de_los_desarrollos" 
        WHERE "DesarrolloId" = :id
      `, {
        replacements: { id }
      });
      
      await db.query(`
        DELETE FROM "desarrollos_favoritos" 
        WHERE "DesarrolloId" = :id
      `, {
        replacements: { id }
      });
      
      // Borrar el desarrollo principal
      await desarrollo.destroy();
      
      await transaction.commit();
      
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
    
    res.json("BORRADO")
  } catch (error) {
    console.error("Error al borrar desarrollo:", error)
    res.status(500).json({error: error.message})
  }
})

server.post("/hardDeleteModeloRelacionado", autorizadoABorrar, async (req,res) => {
  try {
    const {id} = req.body
    const modelo = await ModeloAsociadoAlDesarrollo.findOne({
      where:{id}
    })
    
    if (!modelo) {
      return res.status(404).json({error: "Modelo no encontrado"})
    }
    
    const { ImgModeloAsociado, db } = require("../db");
    
    let transaction;
    try {
      transaction = await db.transaction();
      
      // Borrar imágenes asociadas
      await ImgModeloAsociado.destroy({
        where: { ModeloAsociadoAlDesarrolloId: id }
      });
      
      // Borrar registros de tablas intermedias
      await db.query(`
        DELETE FROM "amenidades_de_los_modelos" 
        WHERE "ModeloAsociadoAlDesarrolloId" = :id
      `, {
        replacements: { id }
      });
      
      await db.query(`
        DELETE FROM "equipamiento_de_los_modelos" 
        WHERE "ModeloAsociadoAlDesarrolloId" = :id
      `, {
        replacements: { id }
      });
      
      await db.query(`
        DELETE FROM "modelos_favoritos" 
        WHERE "ModeloAsociadoAlDesarrolloId" = :id
      `, {
        replacements: { id }
      });
      
      // Borrar el modelo principal
      await modelo.destroy();
      
      await transaction.commit();
      
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
    
    res.json("BORRADO")
  } catch (error) {
    console.error("Error al borrar modelo:", error)
    res.status(500).json({error: error.message})
  }
})

server.post("/hardDeletePropiedadIndependiente", autorizadoABorrar, async (req,res) => {
    try {
      const {id} = req.body
      console.log("Borrando propiedad independiente con id:", id)
      const propIndependiente = await PropiedadIndependiente.findOne({
        where:{id}
      })
      console.log("propIndependiente encontrado:", propIndependiente)
      
      if (!propIndependiente) {
        return res.status(404).json({error: "Propiedad no encontrada"})
      }
      
      // Opción 2: Borrar manualmente las dependencias primero (necesario para belongsToMany)
      const { ImgPropiedadIndependiente, AsignaciondePropiedad, db } = require("../db");
      
      // Iniciar transacción para asegurar consistencia
      let transaction;
      try {
        transaction = await db.transaction();
        
        // Borrar imágenes asociadas
        await ImgPropiedadIndependiente.destroy({
          where: { PropiedadIndependienteId: id }
        });
        
        // Borrar asignaciones de propiedad
        await AsignaciondePropiedad.destroy({
          where: { propiedadId: id }
        });
        
        // Borrar registros de tablas intermedias (belongsToMany)
        await db.query(`
          DELETE FROM "amenidades_de_las_prop_independientes" 
          WHERE "PropiedadIndependienteId" = :id
        `, {
          replacements: { id }
        });
        
        await db.query(`
          DELETE FROM "equipamiento_de_las_prop_independientes" 
          WHERE "PropiedadIndependienteId" = :id
        `, {
          replacements: { id }
        });
        
        await db.query(`
          DELETE FROM "prop_independientes_favoritas" 
          WHERE "PropiedadIndependienteId" = :id
        `, {
          replacements: { id }
        });
        
        // Borrar la propiedad principal
        await propIndependiente.destroy();
        
        // Confirmar transacción
        await transaction.commit();
        
      } catch (error) {
        // Revertir cambios si hay error
        if (transaction) await transaction.rollback();
        throw error;
      }
      
      res.json("BORRADO")
    } catch (error) {
      console.error("Error al borrar propiedad:", error)
      res.status(500).json({error: error.message})
    }
  })

module.exports =  server;