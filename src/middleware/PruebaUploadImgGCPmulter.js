'use strict';
const multer = require('multer');

const multerUpload = multer({
  limits: {
    fileSize: 31 * 1024 * 1024, // no larger than 31mb
    fieldSize: 31 * 1024 * 1024 
  }
});

const pruebaUploadModeloImages = (req, res, next) => {
  // Use multer upload instance
  multerUpload.array('imagenesfiles', 40)(req, res, (err) => {
    if (err) {
      console.log(err)
      const respuestaError = {
        codigo:0, 
        Mensaje:`Error al intentar crear la imagen`,
        Error:err.message
      }
      return res.status(400).json(respuestaError);
    }
    const files = req.files;
    const errors = [];
    
    // Validate file types and sizes
    files.forEach((file) => {
      //const ConsoleLog_NombrePara = Buffer.from(file.originalname, 'ascii').toString('utf8');
      const allowedTypes = ['image/jpeg', 'image/png'];
      const maxSize = 31 * 1024 * 1024; 

      if (!allowedTypes.includes(file.mimetype)) {
        console.log(`Tipo de archivo invalido`)
        errors.push(`Tipo de archivo invalido: ${file.originalname}`);
      }
      if (file.size > maxSize) {
        console.log("Archivo demasiado grande")
        errors.push(`Archivo demasiado grande: ${file.originalname}`);
      }
    });

    // Handle validation errors
    if (errors.length > 0) {
      const respuestaError = {
        codigo:0, 
        Mensaje:`Error al intentar crear la imagen`,
        Error:errors
      }
      return res.status(400).json(respuestaError);
    }

    req.files = files;
    next();    
  });
};

module.exports = {
  pruebaUploadModeloImages
};