const https = require('https');
const crypto = require('crypto');
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
            console.error('Cliente no autenticado en Servidor HTTPS');
            return res.status(401).json({
                success: false,
                message: 'Cliente no autenticado en Servidor HTTPS: Certificado inválido o no proporcionado'
            });
        }

        const cert = req.socket.getPeerCertificate();
        if (cert && cert.raw && cert.subject) {
            const certFingerprint = crypto.createHash('sha256')
                .update(cert.raw)
                .digest('hex')
                .toLowerCase();
            console.log("Fingerprint del certificado", certFingerprint)
            console.log("Fingerprint autorizado", process.env.ALLOWED_CERT_FINGERPRINT)
            const expectedFingerprint = process.env.ALLOWED_CERT_FINGERPRINT
                .toLowerCase()
                .replace(/:/g, '')
                .trim();

            if (certFingerprint !== expectedFingerprint) {
                console.error('Fingerprint del certificado no coincide');
                return res.status(403).json({
                    success: false,
                    message: 'Acceso denegado: Certificado no autorizado'
                });
            }

            console.log('Cliente autenticado');
            next();
        }

    });

    // Crear y devolver el servidor HTTPS
    return https.createServer(httpsOptions, app)
        .listen(port, () => {
            console.log(`Servidor HTTPS escuchando en el puerto ${port}`);
        });
}

module.exports = { createHttpsServer };
