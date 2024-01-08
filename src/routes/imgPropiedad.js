const server = require("express").Router();
const express = require("express");

const path = require('path');
var public = path.join(__dirname, '../../uploads');
var googleCloudStorage = "https://storage.cloud.google.com/dadinumco-media"
server.use('/', express.static(public));

module.exports =  server;