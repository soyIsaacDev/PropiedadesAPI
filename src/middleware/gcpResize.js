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
    console.log("Files en Resize " + JSON.stringify(file));
    const buffer = file.buffer

    try {
        await sharp(buffer)
        .resize({
            width:298,
            height:240
        })
        .toFormat('webp')
        .webp({ quality: 10 })
        .toBuffer()
        
        const img_name= file.fileName
        const img_nombre = img_name.slice(0, file.filename.length - 4);
        console.log("Thumbnail para UploadStream " + img_nombre)
        const fileName = `Thumbnail_WebP_${img_nombre}.webp`;
        const fileUpload = bucket.file(fileName);

        const uploadStream = fileUpload.createWriteStream();

        uploadStream.on("error", async (err) => {
            console.log("Error uploading image", err);

            throw new functions.https.HttpsError("unknown", "Error uploading image");
        });

        uploadStream.on("finish", async () => {
            await fileUpload.setMetadata({ contentType: "image/webp" });

            console.log("Upload success");
        });

        uploadStream.end(buffer);

        next()
      
  } catch (error) {
    console.log("Error en GCP Resize "+error);
  }

  

 }


 module.exports = {
    resizeImage
  };