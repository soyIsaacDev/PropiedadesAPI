const multer = require('multer');
const fs = require('fs');
const path = require('path')
const carpeta = path.join(__dirname, '../../uploads')
const sharp = require('sharp');
const { Buffer } = require('node:buffer');


// Custom file upload middleware
const uploadImages = (req, res, next) => {
    
  const bodyObj = req.body.data;
  const parsedbodyObj = JSON.parse(bodyObj);
  const { ordenImagen } = parsedbodyObj;
  const file = req.files;
  // Cambiando tamaños de imagen
  
  //const nombreOriginal = Buffer.from(file.originalname, 'ascii').toString('utf8');
  const nombreUnicoFecha = Date.now()+"_" + file.originalname;
  //console.log("Nombre Original " + nombreOriginal)
  //file.originalname= nombreOriginal;
  // Agregando Nombre Unico segun la fecha
  //const nombreUnicoFecha = file.filename;
  const esJpeg = file.originalname.includes("jpeg")
  let uniqueDateName = undefined;
  if(esJpeg){
    uniqueDateName = nombreUnicoFecha.slice(0, nombreUnicoFecha.length - 5);
  }
  else{
    uniqueDateName = nombreUnicoFecha.slice(0, nombreUnicoFecha.length - 4);
  }

  const ordenData = ordenImagen.filter((imagen)=>imagen.img_name === file.originalname);
  
  //resizeImage(img_name, width, height, output_name)
  resizeImage(file.filename, uniqueDateName, 393, 388, "Thumbnail_WebP_" );
  resizeImage(file.filename, uniqueDateName, 704, 504, "Detalles_Img_Gde_" );

  // Si estan ordenadas al principio se cambia el tamaño a Chico
  
  if( ordenData.length>0 && ordenData[0].orden === 1 || 
      ordenData.length>0 && ordenData[0].orden === 2 || 
      ordenData.length>0 && ordenData[0].orden === 3)
      {
        
      }

  // Attach files to the request object  
  req.files = file;
  console.log("Pasando A Next")

  // Proceed to the next middleware or route handler
  next();
};

async function resizeImage(filename, img_name, width, height, output_name) {
  try {
    await sharp(carpeta+"/"+filename)
      .resize({
        width,
        height,
        fit:'fill'
      })
      .toFormat('webp')
      .webp({ quality: 100 })
      .toFile(carpeta+"/"+output_name+img_name+'.webp');
  } catch (error) {
    console.log(error);
  }
}

module.exports = uploadImages;