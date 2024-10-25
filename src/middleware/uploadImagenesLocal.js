const multer = require('multer');
const fs = require('fs');
const path = require('path')
const carpeta = path.join(__dirname, '../../uploads')
const sharp = require('sharp');
const { Buffer } = require('node:buffer');

// Configure multer storage and file name

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, carpeta);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  }
});

// Create multer upload instance
const upload = multer({ storage: storage, limits:{fieldSize: 25 * 1024 * 1024} });

// Custom file upload middleware
const uploadImages = (req, res, next) => {
  console.log("Upload Imagenes")
  // Use multer upload instance
  upload.array('imagenesfiles', 40)(req, res, (err) => {
    //console.log(req)
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
    }) */
    

    // Validando el tamaño y tipo de imagenes permitidas
    files.forEach(async (file) => {
      //console.log("Files " + JSON.stringify(file));

      const allowedTypes = ['image/jpeg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.mimetype)) {
        errors.push(`Invalid file type: ${file.originalname}`);
      }

      if (file.size > maxSize) {
        errors.push(`File too large: ${file.originalname}`);
      }
      //console.log("Dentro de Ciclo de Validacion de Imagenes");
    });

    // Handle validation errors
    if (errors.length > 0) {
      console.log("Hay un error " + errors)
      // Remove uploaded files
      files.forEach((file) => {
        fs.unlinkSync(file.path, (err) => {
          if (err) {
              throw err;
          }
          console.log("Delete File successfully.");
        });
      });

      const respuestaError = {
        codigo:0, 
        Mensaje:`Error al intentar crear la imagen`,
        Error:errors
      }
      return res.status(400).json(respuestaError);
    }

    const bodyObj = req.body.data;
    const parsedbodyObj = JSON.parse(bodyObj);
    const { ordenImagen } = parsedbodyObj;
    //console.log(ordenImagen)
    // Cambiando tamaños de imagen
    
    files.forEach((file) => {
      const nombreOriginal = Buffer.from(file.originalname, 'ascii').toString('utf8');
      console.log("Nombre Original " + nombreOriginal)
      file.originalname= nombreOriginal
      // Agregando Nombre Unico segun la fecha
      const nombreUnicoFecha = file.filename;
      const esJpeg = file.originalname.includes("jpeg")
      var uniqueDateName = undefined;
      if(esJpeg){
        uniqueDateName = nombreUnicoFecha.slice(0, nombreUnicoFecha.length - 5);
      }
      else{
        uniqueDateName = nombreUnicoFecha.slice(0, nombreUnicoFecha.length - 4);
      }

      // Agregro el nombre con sello unico de fecha tomandolo de thumbnail
      file.uniqueDateName = uniqueDateName;
      file.resizeNameThumbnail = `Thumbnail_WebP_${uniqueDateName}.webp` ;
      file.resizeNameGde = `Detalles_Img_Gde_${uniqueDateName}.webp`;


      const ordenData = ordenImagen.filter((imagen)=>imagen.img_name === file.originalname);
      //console.log(ordenData)
      //resizeImage(img_name, width, height, output_name)
      resizeImage(file.filename, uniqueDateName, 393, 388, "Thumbnail_WebP_" );
      /* resizeImage(file.filename, uniqueDateName, 298, 240, "Thumbnail_WebP_" ); */
      resizeImage(file.filename, uniqueDateName, 704, 504, "Detalles_Img_Gde_" );

      // Si estan ordenadas al principio se cambia el tamaño a Chico
      
      if( ordenData.length>0 && ordenData[0].orden === 1 || 
          ordenData.length>0 && ordenData[0].orden === 2 || 
          ordenData.length>0 && ordenData[0].orden === 3)
          {
            resizeImage(file.filename, uniqueDateName, 428, 242, "Detalles_Img_Chica_");

            file.resizeNameChico = `Detalles_Img_Chica_${uniqueDateName}.webp`;
          }
    })

    // Attach files to the request object  
    req.files = files;
    console.log("Pasando A Next")

    // Proceed to the next middleware or route handler
    next();
  });
};

async function resizeImage(filename, img_name, width, height, output_name) {
  try {
    await sharp(carpeta+"/"+filename)
      .resize({
        width,
        height
      })
      .toFormat('webp')
      .webp({ quality: 100 })
      .toFile(carpeta+"/"+output_name+img_name+'.webp');
  } catch (error) {
    console.log(error);
  }
}

module.exports = uploadImages;