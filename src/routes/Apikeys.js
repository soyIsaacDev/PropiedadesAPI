const server = require("express").Router();

/*  
  GET
    googlemapsApiKey
*/
const googlemapsApiKey = process.env.GOOGLEMAPS_API_KEY;

server.get("/googlemapskey", async (req, res) => { 
  try {
    console.log("Requiriendo APIKEYS")
    res.json(googlemapsApiKey);
  } catch (error) {
    res.send(error);
  }
});

module.exports =  server;