const https = require('https');
const { httpsOptions } = require('../config/certificates');

/**
 * Crea y configura un servidor HTTPS con autenticación mutua
 * @param {Object} app - Aplicación Express
 * @param {number} port - Puerto para el servidor
 * @returns {Object} - Instancia del servidor HTTPS
 */
function createHttpsServer(app, port) {
    // Middleware de verificación de certificado
    app.use((req, res, next) => {
        if (!req.client.authorized) {
            return res.status(401).json({ 
                success: false,
                message: 'Cliente no autenticado: Certificado inválido o no proporcionado' 
            });
        }
        
        // Opcional: Registrar información del certificado
        const cert = req.socket.getPeerCertificate();
        if (cert && cert.subject) {
            console.log('Cliente autenticado:', cert.subject.CN || 'Sin CN');
        }
        
        next();
    });

    // Crear y devolver el servidor HTTPS
    return https.createServer(httpsOptions, app)
        .listen(port, () => {
            console.log(`Servidor HTTPS escuchando en el puerto ${port}`);
        });
}

module.exports = { createHttpsServer };
