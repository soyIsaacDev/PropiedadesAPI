'use strict';
/* const multer = require('multer');

const multerUpload = multer({
  limits: {
    fileSize: 31 * 1024 * 1024, // no larger than 31mb
    fieldSize: 31 * 1024 * 1024 
  }
}); */

const validarImagenes = (req, res, next) => {
  console.log("Inicio Validacion")
  // Use multer upload instance
  /* multerUpload.single('imagenesfiles')(req, res, (err) => {
    console.log("En Multer Upload")
    if (err) {
      console.log("Error en Array "+err)
      const respuestaError = {
        codigo:0, 
        Mensaje:`Error al intentar crear la imagen`,
        Error:err.message
      }
      return res.status(400).json(respuestaError);
    } */
    const file = req.file;
    const errors = [];
    console.log(file)
    // Validate file types and sizes
    //const ConsoleLog_NombrePara = Buffer.from(file.originalname, 'ascii').toString('utf8');
    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 31 * 1024 * 1024; 
    console.log("Dentro de Validacion Files ForEach")

    if (!allowedTypes.includes(file.mimetype)) {
      console.log(`Tipo de archivo invalido`)
      errors.push(`Tipo de archivo invalido: ${file.originalname}`);
    }
    if (file.size > maxSize) {
      console.log("Archivo demasiado grande")
      errors.push(`Archivo demasiado grande: ${file.originalname}`);
    }

    // Handle validation errors
    if (errors.length > 0) {
      console.log("Hay un error "+ errors)
      const respuestaError = {
        codigo:0, 
        Mensaje:`Error al intentar crear la imagen`,
        Error:errors
      }
      return res.status(400).json(respuestaError);
    }

    req.files = file;
    console.log("Fin Validacion")
    next();    
  //});
};

module.exports = {
  validarImagenes
};