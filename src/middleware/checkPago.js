const { HistorialdePagos, Cliente, Propiedad, Organizacion, AutorizacionesXTipodeOrg, PaquetedePago,  } = require("../db");
const servidorPago = require("express").Router();


const checkPagosActivos = async function (req, res, next) {
  try {
    const userId = req.body.userId;
    
    let orgId = req.orgId;

    if(userId){
      const cliente = await Cliente.findOne({
        where:{ userId },
      })
      orgId = cliente.OrganizacionId;
    }
    // Paso la orgId segun de donde venga sin depender de la que esta previamente
    req.orgId = orgId;

    const historialdePagos = await HistorialdePagos.findAll({
        where:{
            OrganizacionId:orgId
        },
        order: [
            ['fechaFin','DESC']
        ],
        include:  PaquetedePago
    })
    console.log(historialdePagos[0].fechaFin)
    if(historialdePagos.length>0){
      const paquetesActivos = [];
      for (let i = 0; i < historialdePagos.length; i++) {
        const fechasHistorial = new Date(historialdePagos[i].fechaFin);
        const hoy = new Date();
        
        if(hoy < fechasHistorial){
          // Si esta activo el paquete
          const historialActivo = {...historialdePagos[i].PaquetedePago.dataValues, orgId:historialdePagos[i].OrganizacionId }
          paquetesActivos.push(historialActivo);
        }
      }
      
      if(paquetesActivos && paquetesActivos.length>0){
        
        //req.paquetesActivos = paquetesActivos;
        //req.orgId = cliente.OrganizacionId;
        next();
      }
      else{
        res.json({pago:"NO pagado"})
      }
    }
    else res.json({pago:"No existen pagos"})
  } catch (e) {
      res.send(e)
  }
}

const checkPublicacionesRestantesyAutxTipodeOrg = async (req, res, next)  => {
  try {
    const orgId = req.orgId;
    const org = await Organizacion.findOne({
      where:{ id:orgId },
      include:  AutorizacionesXTipodeOrg
    })
    
    const cuentaProps = await Propiedad.count(
      {
        where:{ publicada:"Si" , OrganizacionId:orgId }, 
        attributes: ['publicada', 'TipoOperacionId', 'OrganizacionId'], 
        group:['publicada', 'TipoOperacionId', 'OrganizacionId'] 
      }
    );

    const publicacionesAutorizadas = {
      organizacion:orgId,
      venta:org.AutorizacionesXTipodeOrg.cantidadPropVenta,
      renta:org.AutorizacionesXTipodeOrg.cantidadPropRenta,
      preVenta:org.AutorizacionesXTipodeOrg.cantidadPropPreVenta,
      tipodeOperacionAut:org.AutorizacionesXTipodeOrg.tipodeOperacionAut,
    }   
    
    for (let i = 0; i < cuentaProps.length; i++) {
      // En VentaoRenta se descuentan las disponibles - las rentadas o vendidas
      if(publicacionesAutorizadas.tipodeOperacionAut === "VentaoRenta" && cuentaProps[i].TipoOperacionId === 1
        ||
        publicacionesAutorizadas.tipodeOperacionAut === "VentaoRenta" && cuentaProps[i].TipoOperacionId === 3
      ){
        publicacionesAutorizadas.venta = publicacionesAutorizadas.venta - cuentaProps[i].count;
        publicacionesAutorizadas.renta =  publicacionesAutorizadas.renta - cuentaProps[i].count;
      }
      else{
        if(cuentaProps[i].TipoOperacionId === 1){ 
          publicacionesAutorizadas.venta = publicacionesAutorizadas.venta - cuentaProps[i].count;
        }
        if(cuentaProps[i].TipoOperacionId === 3 ){
          publicacionesAutorizadas.renta =  publicacionesAutorizadas.renta - cuentaProps[i].count;
        }
        if(cuentaProps[i].TipoOperacionId === 2 ){
          publicacionesAutorizadas.preVenta =  publicacionesAutorizadas.preVenta - cuentaProps[i].count;
        }
      }
    }
    // Si hay Publicaciones Restantes se avanza
    if(publicacionesAutorizadas.venta > 0 || publicacionesAutorizadas.renta > 0 || publicacionesAutorizadas.preVenta > 0){
      req.TipodeOrg = org.AutorizacionesXTipodeOrg;
      req.publicaciones = publicacionesAutorizadas;
      next();
    } 
    else {
      publicacionesAutorizadas.mensaje = "No cuentas con autorizacion para publicar mas propiedades"
      res.json(publicacionesAutorizadas);
    } 
  } catch (e) {
      res.send(e)
  }
}

servidorPago.use(checkPagosActivos, checkPublicacionesRestantesyAutxTipodeOrg);

servidorPago.post("/revisarPago",  async (req, res)=>{
  try {
    const publicacionesRestantes = req.publicaciones;
    const tipodeOrg = req.TipodeOrg;
    //console.log(publicacionesRestantes)
    res.json({pago:"Se encuentra pagado", publicacionesRestantes, tipodeOrg})
  } catch (error) {
    res.send(error)
  }
})


module.exports = { checkPagosActivos, checkPublicacionesRestantesyAutxTipodeOrg, servidorPago };