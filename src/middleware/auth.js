// Middleware para verificar si el usuario está autenticado
exports.checkIfSignedIn = (req, res, next) => {
  if (req.session && req.session.tokens) {
    return next();
  }
  
  // Si no está autenticado, devolver error 401
  res.status(401).json({ 
    error: 'No autorizado',
    message: 'Por favor inicia sesión para acceder a este recurso' 
  });
};

// Middleware para verificar si el usuario es un administrador
exports.checkIfAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  
  res.status(403).json({ 
    error: 'Acceso denegado',
    message: 'Se requieren privilegios de administrador' 
  });
};
