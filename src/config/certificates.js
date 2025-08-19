const fs = require('fs');
const path = require('path');

// Ruta base donde están los certificados (en la raíz del proyecto)
const certsPath = path.join(__dirname, '../..');

module.exports = {
    httpsOptions: {
        key: fs.readFileSync(path.join(certsPath, 'server.key')),
        cert: fs.readFileSync(path.join(certsPath, 'server.crt')),
        ca: fs.readFileSync(path.join(certsPath, 'ca.crt')),
        requestCert: true,
        rejectUnauthorized: true
    },
    clientCertOptions: {
        key: fs.readFileSync(path.join(certsPath, 'client.key')),
        cert: fs.readFileSync(path.join(certsPath, 'client.crt')),
        ca: fs.readFileSync(path.join(certsPath, 'ca.crt')),
        rejectUnauthorized: true
    }
};
