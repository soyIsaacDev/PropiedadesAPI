const {Storage} = require('@google-cloud/storage');
const config = require('../../configCloudBucket');
const GCLOUD_BUCKET = config.get('GCLOUD_MOD_ASOC_BUCKET');



const storage = new Storage({
    projectId: config.get('GCLOUD_PROJECT')
});



server.get("/", async (req, res) => {
    const maxAgeSeconds = 3600;

    async function addBucketCors() {
        await storage.bucket(GCLOUD_BUCKET).setCorsConfiguration([
          {
            maxAgeSeconds,
            method: ["GET", "POST", "DELETE"],
            origin: ['https://www.inmozz.com/'],
            responseHeader: ["Content-Type", "Authorization","Access-Control-Allow-Origin"],
          },
    
        ]);
    
        console.log(`Se agrego la configuracion de CORS al bucket ${GCLOUD_BUCKET}`);
    }
    addBucketCors().catch(console.error);

    process.on('unhandledRejection', err => {
        console.error(err.message);
        process.exitCode = 1;
      });
      addBucketCors(...process.argv.slice(2));
})

server.get("/quitarCors", async (req, res) => {
    await storage.bucket(GCLOUD_BUCKET).setCorsConfiguration([]);

    console.log(`Removed CORS configuration from bucket ${GCLOUD_BUCKET}`);
})

