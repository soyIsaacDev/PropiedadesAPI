const {ImgDesarrollo, ImgModeloAsociado, ImgPropiedadIndependiente } = require("../db");
const DEVMODE = process.env.DEVELOPMENT;

const editarTablaImg = async (req, res, next) => {
  try {
    // Se obtienen los datos de la form que estan en un objeto FormData y se pasan a JSON
    const parsedbodyObj = JSON.parse(req.body.data);
    const { tipodeDesarrollo, ordenImagen, id } = parsedbodyObj;
    //const { MOD_ASOC_BUCKET_GCLOUD_BUCKET, DESARROLLO_GCLOUD_BUCKET} = req.data;
    
    let imagenPropiedad = undefined;
    if(tipodeDesarrollo === 'Desarrollo') imagenPropiedad = await ImgDesarrollo.findByPk(ordenImagen[0].id);
    else if(tipodeDesarrollo === 'Modelo') imagenPropiedad = await ImgModeloAsociado.findByPk(ordenImagen[0].id);
    else if (tipodeDesarrollo === 'PropiedadIndepente')  imagenPropiedad = await ImgPropiedadIndependiente.findByPk(ordenImagen[0].id);
    
    console.log("Imagen Propiedad " + imagenPropiedad)

    /* if(DEVMODE === "Production" ){

      if(ordenImagen[0].editar===1){ // 1 = editar
        console.log("Orden Id "+ordenImagen[0].id +  " Editar "+ ordenImagen[0].editar+  " Orden Editado " +JSON.stringify(imagenPropiedad))
        imagenPropiedad.orden= ordenImagen[0].orden
        await imagenPropiedad.save();
      }
      else if (ordenImagen[0].editar===2){ // 2 = borrar
        
        async function deleteFile(fileName) {
          if(tipodeDesarrollo=== "Desarrollo") BucketConfig = DESARROLLO_GCLOUD_BUCKET;
          else BucketConfig = MOD_ASOC_BUCKET_GCLOUD_BUCKET;

          const archivoABorrar = await BucketConfig.file(fileName).delete();
          console.log(`Se Borro el ` + JSON.stringify(archivoABorrar));
        }
        const getNombre = (Nombre) =>{
          //Borrando el sufijo de "https://storage.googleapis.com/dadinumco-media/"  ->  47 caracteres 47-7
          //https://storage.googleapis.com/dadinumco_mod_asociado/   ->  54 caracteres
          let caracteres = undefined;
          if(tipodeDesarrollo=== 'Desarrollo') caracteres = 47;
          else if (tipodeDesarrollo=== 'Modelo') caracteres = 54;

          const NombreExtraido = Nombre.slice(caracteres, Nombre.length);
          return NombreExtraido;
        }
        
        const ThumbnailImgNombre = getNombre(imagenPropiedad.thumbnail_img, 47)
        const ImgGdeNombre = getNombre(imagenPropiedad.detalles_imgGde, 47);

        deleteFile(ThumbnailImgNombre).catch(console.error);
        deleteFile(ImgGdeNombre).catch(console.error);

        if(imagenPropiedad.detalles_imgChica !== null){
          const ImgChicaNombre = getNombre(imagenPropiedad.detalles_imgChica, 47);
          deleteFile(ImgChicaNombre).catch(console.error);
        }
        
        // Borrar datos de la imagen de la propiedad
        await imagenPropiedad.destroy();
      }
    }
    else */ if(DEVMODE === "build") {
      for (let i = 0; i < ordenImagen.length; i++) {
        let imagenPropiedad = undefined;
        if(tipodeDesarrollo === 'Desarrollo') imagenPropiedad = await ImgDesarrollo.findByPk(ordenImagen[i].id);
        else if(tipodeDesarrollo === 'Modelo') imagenPropiedad = await ImgModeloAsociado.findByPk(ordenImagen[i].id);
        else if (tipodeDesarrollo === 'PropiedadIndepente')  imagenPropiedad = await ImgPropiedadIndependiente.findByPk(ordenImagen[i].id);
        
        console.log("Imagen Propiedad " + imagenPropiedad)

        if(ordenImagen[i].editar===1){ // 1 = editar
          console.log("Orden Id "+ordenImagen[i].id +  " Editar "+ ordenImagen[i].editar+  " Orden Editado " +JSON.stringify(imagenPropiedad))
          imagenPropiedad.orden= ordenImagen[i].orden
          await imagenPropiedad.save();
        }
        else if (ordenImagen[i].editar===2){ // 2 = borrar
          fs.unlink(carpeta+"/"+imagenPropiedad.img_name, (err) => {
            if (err) {
                console.log(err);
            }
            console.log("Delete File successfully " + ordenImagen[i].img_name);
          });
          fs.unlink(carpeta+"/"+imagenPropiedad.thumbnail_img, (err) => {
              if (err) {
                  console.log(err);
              }
              console.log("Delete File successfully " +imagenPropiedad.thumbnail_img);
          });
          fs.unlink(carpeta+"/"+imagenPropiedad.detalles_imgGde, (err) => {
              if (err) {
                  console.log(err);
              }
              console.log("Delete File successfully " +imagenPropiedad.detalles_imgGde);
          }); 
          if(imagenPropiedad.detalles_imgChica !== null){
            fs.unlink(carpeta+"/"+imagenPropiedad.detalles_imgChica, (err) => {
                if (err) {
                    console.log(err);
                }
                console.log("Delete File successfully " +imagenPropiedad.detalles_imgChica);
            }); 
         
          // Borrar datos de la imagen de la propiedad
          await imagenPropiedad.destroy();
          }
      }
    }

    const propCreadaJSON = {
      codigo:1, 
      Mensaje: `Se editaron exitosamente los datos del Desarrollo`,
      desarrolloId:id
    }
    res.json(propCreadaJSON? 
      propCreadaJSON 
      :
      {
        codigo:0, 
        Mensaje:`No se pudo actualizar el Desarrollo`,
        Error:"Error de actualizacion"
      } 
    );     

  }
} catch (error) {
    console.log(error);
    const respuestaError = {
        codigo:0, 
        Mensaje:`Error al editar la tabla de la imagen catch`,
        Error:error
      }
      return res.status(400).json(respuestaError);
  }
}

module.exports = editarTablaImg;