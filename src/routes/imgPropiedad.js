const server = require("express").Router();
const express = require("express");

const path = require('path');
var public = path.join(__dirname, '../../uploads');
var googleCloudStorage = "https://storage.cloud.google.com/dadinumco-media"
const {  ImgPropiedad} = require("../db");

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


module.exports =  server;