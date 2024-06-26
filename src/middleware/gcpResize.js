// https://stackoverflow.com/questions/68923598/resizing-images-with-sharp-before-uploading-to-google-cloud-storage
const sharp = require('sharp'); 
const config = require('../../configCloudBucket');
const {Storage} = require('@google-cloud/storage');

const storage = new Storage({
    projectId: config.get('GCLOUD_PROJECT')
  });

const GCLOUD_BUCKET = config.get('GCLOUD_BUCKET');

// Get a reference to the Cloud Storage bucket
const bucket = storage.bucket(GCLOUD_BUCKET);

const resizeImage = async (req, res, next) => {
    console.log("En Resize Image")
    

    
    async function imgCambioTamaño (archivo, width, height, nuevoNombre){
        const oname = Date.now() + archivo.originalname;
        const img_nombre = oname.slice(0, oname.length - 4);
        const fileName = `${nuevoNombre+img_nombre}.webp`;
        
        const img_a_cambiar = {
            fieldname: archivo.fieldname,
            originalname: fileName,
            encoding: archivo.encoding,
            mimetype: archivo.mimetype,
            buffer: await sharp(archivo.buffer)
                .resize({
                    width,
                    height
                })
                .toFormat('webp')
                .webp({ quality: 50 })
                .toBuffer()
        }
        return img_a_cambiar;
    }

    

    /* const thumbnail = {
        fieldname: file.fieldname,
        originalname: fileName,
        encoding: file.encoding,
        mimetype: file.mimetype,
        buffer: await sharp(file.buffer)
            .resize({
                width:298,
                height:240
            })
            .toFormat('webp')
            .webp({ quality: 50 })
            .toBuffer()
    } */

   
      
    const uploadFile = async (file) => new Promise((resolve, reject) => {
        const fileName = file.originalname;
        const fileUpload = bucket.file(fileName);

        const uploadStream = fileUpload.createWriteStream({
            resumable: false,
            metadata: {
                contentType: file.mimetype
            }
        });

        uploadStream.on("error", async (err) => {
            console.log("Error uploading image", err);

            reject(err);
        });

        uploadStream.on("finish", async () => {
            resolve({ 
                name: fileName
            });
            await fileUpload.setMetadata({ 
                contentType: "webp",
                mimetype: "webp"
         });
            console.log("Upload success");
        });

        uploadStream.end(file.buffer);
        req.files = file;
        next()
    })


    const files = req.files;

    console.log("Files en Resize "+ JSON.stringify(files))

    files.forEach(async file => {
        const oname = Date.now() + file.originalname;
        const img_nombre = oname.slice(0, oname.length - 4);
        const fileName = `Thumbnail_WebP_${img_nombre}.webp`;
        
        const thumbnail = await imgCambioTamaño(file, 298, 240,"Thumbnail_WebP_");
        console.log("Thumbnail Resize " + JSON.stringify(thumbnail))
        const uploadThumbnail = await uploadFile(thumbnail);
    
        const Big_Img = await imgCambioTamaño(file, 298, 240,"Details_Big_Img_");
        const uploadBig_Img = await uploadFile(Big_Img);
        
    });
    

    try {
        
        
        
        
      
  } catch (error) {
    console.log("Error en GCP Resize "+error);
  }

  

 }


 module.exports = {
    resizeImage
  };