
const { ImgModeloAsociado, ImgPropiedadIndependiente } = require("../db");
const DEVMODE = process.env.DEVELOPMENT;

const crearTablaImg = async (req, res, next) => {
    try {
        // Se obtienen los datos de la form que estan en un objeto FormData y se pasan a JSON
        const bodyObj = req.body.data;
        const parsedbodyObj = JSON.parse(bodyObj);
        const { tipodeDesarrollo, modeloId, propIndependienteId } = parsedbodyObj

        
        const {file, ordenData, MOD_ASOC_BUCKET_GCLOUD_BUCKET, uniqueDateName} = req.data;
        
        let detalles_imgGde = undefined;
        let thumbnail_img = undefined;
        let detalles_imgChica = undefined

        if(DEVMODE === "Production" ){
            // Agregro al file los nombres segun tamaño
            detalles_imgGde = `https://storage.googleapis.com/${MOD_ASOC_BUCKET_GCLOUD_BUCKET}/Detalles_Img_Gde_${uniqueDateName}.webp`;
            thumbnail_img = `https://storage.googleapis.com/${MOD_ASOC_BUCKET_GCLOUD_BUCKET}/Thumbnail_WebP_${uniqueDateName}.webp`;
            detalles_imgChica = `https://storage.googleapis.com/${MOD_ASOC_BUCKET_GCLOUD_BUCKET}/Detalles_Img_Chica_${uniqueDateName}.webp`;
        }
        else{
            detalles_imgGde = `Detalles_Img_Gde_${uniqueDateName}.webp`;
            thumbnail_img = `Thumbnail_WebP_${uniqueDateName}.webp`;
            detalles_imgChica = `Detalles_Img_Chica_${uniqueDateName}.webp`;
        }

        if(tipodeDesarrollo === 'ModeloRelacionado'){
            const imagenModeloAsociado = await ImgModeloAsociado.create({
                orden:ordenData[0].orden,
                type: file.mimetype,
                ModeloAsociadoPropiedadId: modeloId,
                img_name: uniqueDateName,
                detalles_imgGde,
                thumbnail_img,
                detalles_imgChica,        
            });
        }
        else if (tipodeDesarrollo === 'PropiedadIndepente'){
            const imagenPropiedadIndependiente = await ImgPropiedadIndependiente.create({
                orden:ordenData[0].orden,
                type: file.mimetype,
                PropiedadIndependienteId: propIndependienteId,
                img_name: uniqueDateName,
                detalles_imgGde,
                thumbnail_img,
                detalles_imgChica,
            });
        }
    
        console.log("Termino de Cargar la imagen");
        res.json({
            codigo:1, 
            Mensaje:`Si pasaron las imagenes`
        });

    } catch (error) {
        const respuestaError = {
            codigo:0, 
            Mensaje:`Error al crear la tabla de la imagen catch`,
            Error:error
          }
          return res.status(400).json(respuestaError);
    }
}


    module.exports = crearTablaImg;