const { Propiedad, Organizacion, AutorizacionesXTipodeOrg } = require("../db");
const servidorCantProps = require("express").Router();

const checkCantProps = async (req, res, next)  => {
    /* try {
      const { orgId } = req.params;
      const cuentaProps = await Propiedad.count(
      {
        where:{ publicada:"Si" , OrganizacionId:orgId }, 
        attributes: ['publicada', 'TipoOperacionId', 'OrganizacionId'], 
        group:['publicada', 'TipoOperacionId', 'OrganizacionId'] 
      });
      const org = await Organizacion.findOne({
        where:{ id:orgId },
        include:  AutorizacionesXTipodeOrg
      })
      
      for (let i = 0; i < cuentaProps.length; i++) {
        const publicacionesdeMas = {
          organizacion:org.id,
          venta:"",
          renta:"",
          preVenta:"",
        }
        if(cuentaProps[i].OrganizacionId === org.id){
            if(cuentaProps[i].TipoOperacionId === 1 && cuentaProps[i].count < org.AutorizacionesXTipodeOrg.cantidadPropVenta){ 
              publicacionesdeMas.venta = org.AutorizacionesXTipodeOrg.cantidadPropVenta - cuentaProps[i].count;
            }
            if(cuentaProps[i].TipoOperacionId === 3 && cuentaProps[i].count > org.AutorizacionesXTipodeOrg.cantidadPropRenta){
              publicacionesdeMas.renta = org.AutorizacionesXTipodeOrg.cantidadPropRenta - cuentaProps[i].count;
            }
            if(cuentaProps[i].TipoOperacionId === 2 && cuentaProps[i].count > org.AutorizacionesXTipodeOrg.cantidadPropPreVenta){
              publicacionesdeMas.preVenta = org.AutorizacionesXTipodeOrg.cantidadPropPreVenta - cuentaProps[i].count;
            }

        }
        // Si hay rentas o ventas de manda mensaje
        if(publicacionesdeMas.venta || publicacionesdeMas.renta || publicacionesdeMas.preVenta){
          publicacionesdeMas.mensaje = "No cuentas con autorizacion para publicar mas propiedades"
          res.json(publicacionesdeMas)
        } 
        else {
            req.publicaciones = publicacionesdeMas;
            next();
        } 
      }
      
      

    } catch (e) {
        res.send(e)
    } */
}

servidorCantProps.get("/:orgId", checkCantProps, async (req, res)=>{
 try {

    const publicacionesdeMas = req.publicaciones;
    res.send(publicacionesdeMas)
    
 } catch (error) {
    res.send(error)
 }
})


module.exports = {checkCantProps, servidorCantProps};