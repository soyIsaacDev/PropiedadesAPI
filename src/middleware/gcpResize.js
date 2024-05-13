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
    const file = req.files;
    const oname = Date.now() + file.originalname;
    const img_nombre = oname.slice(0, oname.length - 4);
    const fileName = `Thumbnail_WebP_${img_nombre}.webp`;

    
    async function imgCambioTamaño (archivo, nuevoNombre){
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
                    width:298,
                    height:240
                })
                .toFormat('webp')
                .webp({ quality: 50 })
                .toBuffer()
        }
        return img_a_cambiar;
    }

    const thumbnail = imgCambioTamaño(file,"Thumbnail_WebP_")

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

        next()
    })

    const uploadThumbnail = await uploadFile(thumbnail);
    

    try {
        
        
        
        
      
  } catch (error) {
    console.log("Error en GCP Resize "+error);
  }

  

 }


 module.exports = {
    resizeImage
  };