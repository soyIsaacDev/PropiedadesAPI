const https = require('https');
const http = require('http');
const crypto = require('crypto');
const { httpsOptions } = require('../config/certificates');

// Verificar si tenemos todos los certificados necesarios
const hasValidCerts = httpsOptions.key && httpsOptions.cert && httpsOptions.ca;

// Si no hay certificados válidos, usar HTTP en desarrollo
if (process.env.NODE_ENV !== 'production' && !hasValidCerts) {
  console.warn('⚠️  No se encontraron certificados HTTPS válidos. Usando HTTP en modo desarrollo.');
  
  return {
    createServer: (app, port) => {
      return http.createServer(app).listen(port, () => {
        console.log(`Servidor HTTP (sin HTTPS) escuchando en el puerto ${port}`);
      });
    }
  };
}

/**
 * Crea y configura un servidor HTTPS con autenticación mutua
 * @param {Object} app - Aplicación Express
 * @param {number} port - Puerto para el servidor
 * @returns {Object} - Instancia del servidor HTTPS
 */
function createHttpsServer(app, port) {
    // En desarrollo, no requerir certificados de cliente para evitar problemas de CORS
    if (process.env.NODE_ENV !== 'production') {
        console.log('Modo desarrollo: HTTPS sin autenticación de cliente');
        return https.createServer(httpsOptions, app)
            .listen(port, () => {
                console.log(`Servidor HTTPS (desarrollo) escuchando en el puerto ${port}`);
            });
    }

    // Middleware de verificación de certificado (solo en producción)
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
