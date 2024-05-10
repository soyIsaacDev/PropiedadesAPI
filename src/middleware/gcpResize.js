
const sharp = require('sharp'); 

const resizeImage = async (req, res, next) => {
    const file = req.file;
    const buffer = Buffer.from(file, "base64");

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