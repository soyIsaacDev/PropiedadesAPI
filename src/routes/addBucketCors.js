const server = require("express").Router();
const config = require('../../configCloudBucket');

// Solo configurar CORS si estamos en producción
if (process.env.NODE_ENV === 'production') {
    const storage = config.storage;
    const GCLOUD_BUCKET = config.bucketModAsoc;

    server.get("/agregarCors", async (req, res) => {
        try {
            const maxAgeSeconds = 3600;
            await storage.bucket(GCLOUD_BUCKET).setCorsConfiguration([
                {
                    maxAgeSeconds,
                    method: ["GET", "POST", "DELETE"],
                    origin: ['https://www.inmozz.com','https://inmozz.com'],
                    responseHeader: ["Content-Type", "Authorization","Access-Control-Allow-Origin"],
                }
            ]);
            console.log(`Se agregó la configuración de CORS al bucket ${GCLOUD_BUCKET}`);
            res.send(`Configuración de CORS actualizada para ${GCLOUD_BUCKET}`);
        } catch (e) {
            console.error('Error al configurar CORS:', e);
            res.status(500).send(e.message);
        }
    });

    server.get("/quitarCors", async (req, res) => {
        try {
            await storage.bucket(GCLOUD_BUCKET).setCorsConfiguration([]);
            console.log(`Se eliminó la configuración de CORS del bucket ${GCLOUD_BUCKET}`);
            res.send(`Configuración de CORS eliminada de ${GCLOUD_BUCKET}`);
        } catch (e) {
            console.error('Error al eliminar CORS:', e);
            res.status(500).send(e.message);
        }
    });
} else {
    console.log('Modo desarrollo: No se configura CORS para Google Cloud Storage');
    
    // Endpoints simulados para desarrollo
    server.get("/agregarCors", (req, res) => {
        res.send("Modo desarrollo: La configuración de CORS no se aplica localmente");
    });

    server.get("/quitarCors", (req, res) => {
        res.send("Modo desarrollo: No hay configuración de CORS para eliminar");
    });
}

module.exports = server;