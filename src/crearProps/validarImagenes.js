'use strict';
const fs = require('fs');

const validarImagenes = (req, res, next) => {
  try {
    const file = req.file;
    const errors = [];

    // Validate file types and sizes
    //const ConsoleLog_NombrePara = Buffer.from(file.originalname, 'ascii').toString('utf8');

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 31 * 1024 * 1024; 
    console.log("Dentro de Validacion Files ForEach")

    if (file === undefined) {
      console.log("req.file Undefined")
      errors.push(`El archivo a subir esta Undefined`);
    }
    if (!file) {
      console.log("No hay archivos a subir")
      errors.push(`No hay archivos a subir`);
    }
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
      // Borrando imagen de Local 
      fs.unlinkSync(file.path, (err) => {
        if (err) {
          throw err;
        }
        console.log("Delete File successfully.");
      });

      const respuestaError = {
        codigo:0, 
        Mensaje:`Error al intentar crear la imagen`,
        Error:errors
      }
      return res.status(400).json(respuestaError);
    }

    req.files = file;
    next();    
    
  } catch (error) {
    const respuestaError = {
      codigo:0, 
      Mensaje:`Error al validar la imagen catch`,
      Error:error
    }
    return res.status(400).json(respuestaError);
  }
  //});
};

module.exports = {
  validarImagenes
};