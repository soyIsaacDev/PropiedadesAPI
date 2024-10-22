
const multer = require('multer');

const multerUpload = multer({
  limits: {
    fileSize: 31 * 1024 * 1024, // no larger than 31mb
    fieldSize: 31 * 1024 * 1024 
  }
});

const pruebaMiddleware = async (req, res, next) => {
    try {
        
        console.log("MIDDLEWARE");
        next();
    } catch (error) {
        
    }
  
};

module.exports = {
  pruebaMiddleware
};