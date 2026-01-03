// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// Hierarchical node.js configuration with command-line arguments, environment
// variables, and files.
const nconf = require('nconf');
const path = require('path');

nconf
  // 1. Command-line arguments
  .argv()
  // 2. Environment variables
  .env([
    'GCLOUD_PROJECT',
    'GCLOUD_BUCKET',
    'GCLOUD_MOD_ASOC_BUCKET',
    'NODE_ENV',
    'PORT'
  ])
  // 3. Config file
  .file({ file: path.join(__dirname, 'config.json') })
  // 4. Defaults
  .defaults({
    // This is the id of your project in the Google Cloud Developers Console.
    GCLOUD_PROJECT: '',
    GCLOUD_BUCKET: '',
    GCLOUD_MOD_ASOC_BUCKET: '',
    PORT: 8080,
    NODE_ENV: 'development'
  });

// Check for required settings
checkConfig('GCLOUD_PROJECT');

// Solo verificar los buckets si estamos en producción
if (nconf.get('NODE_ENV') === 'production') {
  checkConfig('GCLOUD_BUCKET');
  checkConfig('GCLOUD_MOD_ASOC_BUCKET');
}

function checkConfig(setting) {
  if (!nconf.get(setting)) {
    throw new Error(`You must set ${setting} as an environment variable or in config.json!`);
  }
}

// Configuración de Google Cloud Storage
let storage = null;
let bucket = null;
let bucketModAsoc = null;

// Solo configurar Google Cloud Storage en producción
if (nconf.get('NODE_ENV') === 'production') {
  const { Storage } = require('@google-cloud/storage');
  storage = new Storage({
    projectId: nconf.get('GCLOUD_PROJECT')
  });
  bucket = storage.bucket(nconf.get('GCLOUD_BUCKET'));
  bucketModAsoc = storage.bucket(nconf.get('GCLOUD_MOD_ASOC_BUCKET'));
}

// Exportar configuración
module.exports = {
  storage,
  bucket,
  bucketModAsoc,
  nconf
};
