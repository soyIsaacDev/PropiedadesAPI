/**
 * Middleware para validar que las peticiones provengan de dominios autorizados
 * Se usa en rutas públicas que no requieren autenticación pero deben ser accesibles solo desde la aplicación web
 */

function validateAppRequest(req, res, next) {
  // Lista de dominios permitidos (los mismos que en tu configuración CORS)
  const allowedDomains = [
    'http://localhost:3000',
    'https://localhost:3000',
    'http://127.0.0.1:3000',
    'https://127.0.0.1:3000',
    'http://localhost:8081',
    'https://localhost:8081',
    'http://127.0.0.1:8081',
    'https://127.0.0.1:8081',
    'https://inmozz.com', 
    'https://www.inmozz.com', 
    'https://m3inmuebles.com'
  ];

  // Obtener el origen o referer de la petición
  const origin = req.headers.origin || req.headers.referer || '';
  
  // Verificar si la petición viene de un dominio permitido
  const isFromAllowedDomain = allowedDomains.some(domain => 
    origin.startsWith(domain)
  );
  
  // Permitir peticiones desde los dominios autorizados
  if (isFromAllowedDomain) {
    return next();
  }

  // Si no hay origen/referer o no está permitido, verificar si es una API request
  const isApiRequest = req.headers['x-requested-with'] === 'XMLHttpRequest' || 
                      req.accepts('json');
  
  // Si es una API request sin origen válido, rechazar
  if (isApiRequest) {
    return res.status(403).json({ 
      success: false,
      error: 'Acceso no autorizado',
      code: 'ORIGIN_NOT_ALLOWED'
    });
  }

  // Para peticiones directas en navegador (sin origen o referer)
  res.status(403).send('Acceso restringido');
}

module.exports = validateAppRequest;
