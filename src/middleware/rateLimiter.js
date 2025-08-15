// Configuración de rate limiting para producción
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // límite de 100 peticiones por ventana por IP
    standardHeaders: true, // Devuelve la información de rate limit en los headers `RateLimit-*`
    legacyHeaders: false, // Desactiva los headers `X-RateLimit-*`
    message: {
        success: false,
        message: 'Demasiadas peticiones desde esta IP, por favor intente de nuevo después de 15 minutos'
    }
});

module.exports = limiter;
