
const { ImgModeloAsociado } = require("../db");

const crearTablaImgModeloAsociado = async (req, res, next) => {
    try {
        // Se obtienen los datos de la form que estan en un objeto FormData y se pasan a JSON
        const bodyObj = req.body.data;
        const parsedbodyObj = JSON.parse(bodyObj);
        const { nombreModelo, nombreDesarrollo, ciudad, estado } = parsedbodyObj

        const ModeloRelacionado = await ModeloAsociadoPropiedad.findOne({
            where: {
              nombreModelo,
              PropiedadId:parseInt(nombreDesarrollo),
              CiudadId:ciudad,
              EstadoId:estado,
            }
        })

        
        const {file, ordenData, GCLOUD_BUCKET, uniqueDateName} = req.data;
        // Agregro al file los nombres segun tamaño

        const imagenModeloAsociado = await ImgModeloAsociado.create({
        orden:ordenData[0].orden,
        type: file.mimetype,
        ModeloAsociadoPropiedadId: ModeloRelacionado.id,
        img_name: uniqueDateName,
        detalles_imgGde: `https://storage.googleapis.com/${GCLOUD_BUCKET}/Detalles_Img_Gde_${uniqueDateName}.webp`,
        thumbnail_img: `https://storage.googleapis.com/${GCLOUD_BUCKET}/Thumbnail_WebP_${uniqueDateName}.webp`,
        detalles_imgChica: `https://storage.googleapis.com/${GCLOUD_BUCKET}/Detalles_Img_Chica_${uniqueDateName}.webp`,
        });
    
        console.log(imagenModeloAsociado)
        console.log("Termino de Cargar la imagen");
        res.json({
            codigo:1, 
            Mensaje:`Si pasaron las imagenes`
        });

    } catch (error) {
        res.json(error)
    }
}


    module.exports = {
        crearTablaImgModeloAsociado
    };