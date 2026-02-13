
const {ImgDesarrollo, ImgModeloAsociado, ImgPropiedadIndependiente } = require("../db");
const DEVMODE = process.env.DEVELOPMENT;

const crearTablaImg = async (req, res, next) => {
    try {
        // Se obtienen los datos de la form que estan en un objeto FormData y se pasan a JSON
        const parsedbodyObj = JSON.parse(req.body.data);
        const { id, tipodeDesarrollo, desarrolloId, modeloId, propiedadIndependienteId } = parsedbodyObj
        console.log("Tipo de Desarrrollo " + tipodeDesarrollo)
        
        const {file, ordenData, modeloBucket, desarrolloBucket, uniqueDateName} = req.data;
        
        let detalles_imgGde = undefined;
        let thumbnail_img = undefined;
        let detalles_imgChica = undefined;
        let BucketConfig = undefined;

        if(DEVMODE === "Production" ){
            if(tipodeDesarrollo=== "Desarrollo") BucketConfig = desarrolloBucket;
            else BucketConfig = modeloBucket;
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
            const imagenDesarrollo = await ImgDesarrollo.create({
                orden:ordenData[0].orden,
                type: file.mimetype,
                DesarrolloId: desarrolloId,
                img_name: uniqueDateName,
                detalles_imgGde,
                thumbnail_img,
                detalles_imgChica,        
            });
        }

        else if(tipodeDesarrollo === 'Modelo'){
            const imagenModeloAsociado = await ImgModeloAsociado.create({
                orden:ordenData[0].orden,
                type: file.mimetype,
                ModeloAsociadoAlDesarrolloId: modeloId,
                img_name: uniqueDateName,
                detalles_imgGde,
                thumbnail_img,
                detalles_imgChica,        
            });
        }
        else if (tipodeDesarrollo === 'PropiedadIndependiente'){
            console.log("Creando Tabla Img Independiente " + propiedadIndependienteId)
            const imagenPropiedadIndependiente = await ImgPropiedadIndependiente.create({
                orden:ordenData[0].orden,
                type: file.mimetype,
                PropiedadIndependienteId:propiedadIndependienteId,
                img_name: uniqueDateName,
                detalles_imgGde,
                thumbnail_img,
                detalles_imgChica,
            });
            console.log("Nombre Imagen " + imagenPropiedadIndependiente.img_name)
        }
    
        console.log("Termino de Cargar la imagen");
        
        res.json({
            codigo:1, 
            Mensaje: `Se editaron exitosamente las imagenes del Desarrollo`,
            desarrolloId:id
        });
        

    } catch (error) {
        console.log(error);
        const respuestaError = {
            codigo:0, 
            Mensaje:`Error al crear la tabla de la imagen catch`,
            Error:error
          }
          return res.status(400).json(respuestaError);
    }
}


    module.exports = crearTablaImg;