
const sharp = require('sharp'); 

const GCLOUD_BUCKET = config.get('GCLOUD_BUCKET');

// Get a reference to the Cloud Storage bucket
const bucket = storage.bucket(GCLOUD_BUCKET);

const resizeImage = async (req, res, next) => {
    const file = req.files;
    console.log("Files en Resize " + JSON.stringify(file))
    const buffer = file.buffer

    try {
        await sharp(buffer)
        .resize({
            width:298,
            height:240
        })
        .toFormat('webp')
        .webp({ quality: 50 })
        .toBuffer()
        
        const nombre = "Thumbnail";

        const fileName = `${nombre}.webp`;
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

        uploadStream.end(bufferSharp);

        next()
      
  } catch (error) {
    console.log(error);
  }

  

 }


 module.exports = {
    resizeImage
  };