
const {ImgPropiedad, ImgModeloAsociado, ImgPropiedadIndependiente } = require("../db");
const DEVMODE = process.env.DEVELOPMENT;

const crearTablaImg = async (req, res, next) => {
    try {
        // Se obtienen los datos de la form que estan en un objeto FormData y se pasan a JSON
        const bodyObj = req.body.data;
        const parsedbodyObj = JSON.parse(bodyObj);
        const { tipodeDesarrollo, desarrolloId, modeloId, propIndependienteRefId } = parsedbodyObj

        
        const {file, ordenData, MOD_ASOC_BUCKET_GCLOUD_BUCKET, DESARROLLO_GCLOUD_BUCKET, uniqueDateName} = req.data;
        
        let detalles_imgGde = undefined;
        let thumbnail_img = undefined;
        let detalles_imgChica = undefined;
        let BucketConfig = undefined;

        if(DEVMODE === "Production" ){
            if(tipodeDesarrollo=== "Desarrollo") BucketConfig = DESARROLLO_GCLOUD_BUCKET;
            else BucketConfig = MOD_ASOC_BUCKET_GCLOUD_BUCKET;
            // Agregro al file los nombres segun tamaño
            detalles_imgGde = `https://storage.googleapis.com/${BucketConfig}/Detalles_Img_Gde_${uniqueDateName}.webp`;
            thumbnail_img = `https://storage.googleapis.com/${BucketConfig}/Thumbnail_WebP_${uniqueDateName}.webp`;
            detalles_imgChica = `https://storage.googleapis.com/${BucketConfig}/Detalles_Img_Chica_${uniqueDateName}.webp`;
        }
        else{
            detalles_imgGde = `Detalles_Img_Gde_${uniqueDateName}.webp`;
            thumbnail_img = `Thumbnail_WebP_${uniqueDateName}.webp`;
            detalles_imgChica = `Detalles_Img_Chica_${uniqueDateName}.webp`;
        }

        if(tipodeDesarrollo === 'Desarrollo'){
            const imagenDesarrollo = await ImgPropiedad.create({
                orden:ordenData[0].orden,
                type: file.mimetype,
                PropiedadId: desarrolloId,
                img_name: uniqueDateName,
                detalles_imgGde,
                thumbnail_img,
                detalles_imgChica,        
            });
        }

        else if(tipodeDesarrollo === 'ModeloRelacionado'){
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
                PropiedadIndependienteRefId: propIndependienteRefId,
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
        console.log(error)
        const respuestaError = {
            codigo:0, 
            Mensaje:`Error al crear la tabla de la imagen catch`,
            Error:error
          }
          return res.status(400).json(respuestaError);
    }
}


    module.exports = crearTablaImg;