const server = require("express").Router();
const express = require("express");

const path = require('path');
var public = path.join(__dirname, '../../uploads');
var googleCloudStorage = "https://storage.cloud.google.com/dadinumco-media"
const { ImgPropiedad, ImgModeloAsociado } = require("../db");

server.use('/', express.static(public));


server.get("", async (req,res)=> {
    try{
      const imagenes = await ImgPropiedad.findAll()
      
      res.json(imagenes);
    }
    catch(e){
      res.send(e);
    }
});

server.get("/imagenDesarrollo/:imagenId", async (req,res)=> {
  try{
    let {imagenId} = req.params;
    const imagen = await ImgPropiedad.findByPk(imagenId);
    res.send(imagen)
  }
  catch(e){
    res.send(e);
  }
});

server.get("/imagenModelo/:imagenId", async (req,res)=> {
  try{
    let {imagenId} = req.params;
    const imagen = await ImgModeloAsociado.findByPk(imagenId);
    res.send(imagen)
  }
  catch(e){
    res.send(e);
  }
});

server.get("/imagenDesarrolloAll/:desarrolloId", async (req,res)=> {
  try{
    let {desarrolloId} = req.params;
    const imagenDesarrollo = await ImgPropiedad.findAll({
      where:{PropiedadId:desarrolloId}
    });
    res.send(imagenDesarrollo)
  }
  catch(e){
    res.send(e);
  }
});

server.get("/imagenModeloAll/:modeloId", async (req,res)=> {
  try{
    let {modeloId} = req.params;
    const imagenModelo = await ImgModeloAsociado.findAll({
      where:{ModeloAsociadoPropiedadId:modeloId}
    });
    res.send(imagenModelo)
  }
  catch(e){
    res.send(e);
  }
});



module.exports =  server;