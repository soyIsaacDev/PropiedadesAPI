const fs = require('fs');
const path = require('path');

// Ruta base donde están los certificados (en la raíz del proyecto)
const certsPath = path.join(__dirname, '../../cert');

module.exports = {
    httpsOptions: {
        key: fs.readFileSync(path.join(certsPath, 'server.key')),
        cert: fs.readFileSync(path.join(certsPath, 'server.crt')),
        ca: fs.readFileSync(path.join(certsPath, 'ca.crt')),
        requestCert: true,
        rejectUnauthorized: true,
        minVersion: 'TLSv1.2',     // Versión mínima de TLS
        ciphers: [                // Cifrados fuertes
          'TLS_AES_256_GCM_SHA384',
          'TLS_CHACHA20_POLY1305_SHA256',
          'TLS_AES_128_GCM_SHA256'
        ].join(':'),
    },
    /* clientCertOptions: {
        key: fs.readFileSync(path.join(certsPath, 'client.key')),
        cert: fs.readFileSync(path.join(certsPath, 'client.crt')),
        ca: fs.readFileSync(path.join(certsPath, 'ca.crt')),
        rejectUnauthorized: true
    } */
};
