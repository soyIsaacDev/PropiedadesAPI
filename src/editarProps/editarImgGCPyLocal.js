'use strict';
const sharp = require('sharp');
const config = require('../../configCloudBucket');
// Load the module for Cloud Storage
const {Storage} = require('@google-cloud/storage');
// Get the GCLOUD_BUCKET environment variable
// Recall that earlier you exported the bucket name into an
// environment variable.
// The config module provides access to this environment
// variable so you can use it in code
const MOD_ASOC_BUCKET_GCLOUD_BUCKET = config.get('GCLOUD_MOD_ASOC_BUCKET');
const DESARROLLO_GCLOUD_BUCKET = config.get('GCLOUD_BUCKET');

// Create the storage client
// The Storage(...) factory function accepts an options
// object which is used to specify which project's Cloud
// Storage buckets should be used via the projectId
// property.
// The projectId is retrieved from the config module.
// This module retrieves the project ID from the
// GCLOUD_PROJECT environment variable.
const storage = new Storage({
  projectId: config.get('GCLOUD_PROJECT')
});
// Get a reference to the Cloud Storage bucket
const modeloBucket = storage.bucket(MOD_ASOC_BUCKET_GCLOUD_BUCKET);
const desarrolloBucket = storage.bucket(DESARROLLO_GCLOUD_BUCKET);

const path = require('path')
const carpeta = path.join(__dirname, '../../uploads')

const DEVMODE = process.env.DEVELOPMENT;

const editarImagenGCPyLocal = async (req, res, next) => {
  try {
    const bodyObj = req.body.data;
    const parsedbodyObj = JSON.parse(bodyObj);
    const { ordenImagen, tipodeDesarrollo } = parsedbodyObj;
    const file = req.files;
    
  } catch (error) {
    console.log("Error al editar la imagen" + error);
    res.send(error)
  }
}

module.exports = {
  editarImagenGCPyLocal
};