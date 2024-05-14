const multer = require('multer');
const fs = require('fs');
const path = require('path')
const carpeta = path.join(__dirname, '../../uploads')
const sharp = require('sharp');

// Configure multer storage and file name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, carpeta);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Create multer upload instance
const upload = multer({ storage: storage });

// Custom file upload middleware
const uploadImages = (req, res, next) => {
  console.log("Upload Imagenes")
  // Use multer upload instance
  upload.array('imagenesfiles', 25)(req, res, (err) => {
    if (err) {
      console.log(err)
      return res.status(400).json({ error: err.message });
    }

    // Retrieve uploaded files
    const files = req.files;
    const errors = [];
    /* req.files.map(file => {
      console.log("Mapping")
      console.log(file)
    })
    console.log("Files " + JSON.stringify(files)); */

    // Validando el tamaño y tipo de imagenes permitidas
    files.forEach(async (file) => {

      const allowedTypes = ['image/jpeg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.mimetype)) {
        errors.push(`Invalid file type: ${file.originalname}`);
      }

      if (file.size > maxSize) {
        errors.push(`File too large: ${file.originalname}`);
      }
      console.log("Dentro de Ciclo de Validacion de Imagenes");

    });

    // Handle validation errors
    if (errors.length > 0) {
      console.log("Hay un error")
      // Remove uploaded files
      files.forEach((file) => {
        fs.unlinkSync(file.path, (err) => {
          if (err) {
              throw err;
          }
          console.log("Delete File successfully.");
        });

      });

      return res.status(400).json({ errors });
    }

    // Cambiando tamaños de imagen

    files.forEach((file) => {
      //resizeImage(img_name, width, height, output_name)
      resizeImage(file.filename, 298, 240, "Thumbnail_WebP_" );
      resizeImage(file.filename, 704, 504, "Detalles_Img_Gde" );
    })

    if(files[1]) resizeImage(files[1].filename, 428, 242, "Detalles_Img_Chica_");
    if(files[2]) resizeImage(files[2].filename, 428, 242, "Detalles_Img_Chica_");

    // Attach files to the request object  
    req.files = files;
    console.log("Pasando A Next")

    // Proceed to the next middleware or route handler
    next();
  });
};

async function resizeImage(img_name, width, height, output_name) {
  const img_nombre = img_name.slice(0, img_name.length - 4);
  try {
    await sharp(carpeta+"/"+img_name)
      .resize({
        width,
        height
      })
      .toFormat('webp')
      .webp({ quality: 50 })
      .toFile(carpeta+"/"+output_name+img_nombre+'.webp');
  } catch (error) {
    console.log(error);
  }
}

module.exports = uploadImages;