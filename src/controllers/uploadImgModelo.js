
const {  ImgModeloAsociado, ModeloAsociadoPropiedad } = require("../db");

const uploadImagenModeloAsociadoPropiedad = async (req, res) => {
    try {
      const bodyObj = req.body.data;
      const parsedbodyObj = JSON.parse(bodyObj)
      const { nombreModelo, precio, recamaras, baños, calle, 
        colonia, numeroCasa, numeroInterior, nombreDesarrollo} = parsedbodyObj
      console.log("Nombre del Modelo " + nombreModelo)
      
      const modelo = await ModeloAsociadoPropiedad.create({
        nombreModelo,
        precio,
        recamaras, 
        baños, 
        calle,
        colonia,
        numeroCasa,
        numeroInterior,
        PropiedadId:parseInt(nombreDesarrollo),
         
      })

      const files = req.files;

      if (files === undefined) {
        console.log("Selecciona una imagen para tu propiedad")
        return res.send(`Selecciona una imagen para tu propiedad`);
      }
      console.log("Files en creacion de Instancia " + JSON.stringify(files))

      // se crea una imagen por cada archivo y se liga a la Propiedad
      files.forEach(async (file) => {
        console.log("Image File " + JSON.stringify(file))
        console.log("Modelo Asociado " + modelo.id);
          
          const imagenModeloAsociado = await ImgModeloAsociado.create({
            type: file.mimetype,
            img_name: file.filename,
            ModeloAsociadoPropiedadId: modelo.id
          });
          console.log("Imagen propiedad "+imagenModeloAsociado);
      })
      

      /* const modelo = await ModeloAsociadoPropiedad.create({
        nombreModelo,
        precio,
        recamaras, 
        baños, 
        calle,
        colonia,
        numeroCasa,
        numeroInterior,
        PropiedadId:parseInt(nombreDesarrollo),
         
      }).then((response) => {
          imagenModeloAsociado.ModeloAsociadoPropiedadId = response.id
      }); 
      
      await imagenModeloAsociado.save();
      console.log("Modelo " + JSON.stringify(modelo));
      */

      //res.json(`Se creo la imagen de propiedad ` + imagenModeloAsociado + " de la propiedad " );
      
    } catch (error) {
      console.log("Error " + error);
      return res.send(`Error al intentar crear la imagen de la propiedad: ${error}`);
    }
  };

  module.exports = {
    uploadImagenModeloAsociadoPropiedad
  };