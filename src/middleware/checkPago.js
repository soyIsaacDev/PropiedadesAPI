const { HistorialdePagos, Cliente, Propiedad, Organizacion, TipodeOrganizacion, PaquetedePago,  } = require("../db");
const servidorPago = require("express").Router();


const checkPagosActivos = async function (req, res, next) {
  try {
    const { userId} = req.body;

    const cliente = await Cliente.findOne({
        where:{ userId },
    })
    const historialdePagos = await HistorialdePagos.findAll({
        where:{
            OrganizacionId:cliente.OrganizacionId
        },
        order: [
            ['fechaFin','DESC']
        ],
        include:  PaquetedePago
    })
    
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
        req.paquetesActivos = paquetesActivos;
        req.orgId = cliente.OrganizacionId;
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

/* const checkCantProps = async (req, res, next)  => {
  try {
    
    const orgId  = req.orgId;
    const cuentaProps = await Propiedad.count(
    {
      where:{ publicada:"Si" , OrganizacionId:paquetesActivos.orgId }, 
      attributes: ['publicada', 'TipoOperacionId', 'OrganizacionId'], 
      group:['publicada', 'TipoOperacionId', 'OrganizacionId'] 
    });
    const org = await Organizacion.findOne({
      where:{ id:orgId },
      include:  TipodeOrganizacion
    })
    
    for (let i = 0; i < cuentaProps.length; i++) {
      const publicacionesdeMas = {
        organizacion:org.id,
        venta:"",
        renta:"",
        preVenta:"",
      }
      if(cuentaProps[i].OrganizacionId === org.id){
          if(cuentaProps[i].TipoOperacionId === 1 && cuentaProps[i].count > org.TipodeOrganizacion.cantidadPropVenta){ 
            publicacionesdeMas.venta = org.TipodeOrganizacion.cantidadPropVenta - cuentaProps[i].count;
          }
          if(cuentaProps[i].TipoOperacionId === 3 && cuentaProps[i].count > org.TipodeOrganizacion.cantidadPropRenta){
            publicacionesdeMas.renta = org.TipodeOrganizacion.cantidadPropRenta - cuentaProps[i].count;
          }
          if(cuentaProps[i].TipoOperacionId === 2 && cuentaProps[i].count > org.TipodeOrganizacion.cantidadPropPreVenta){
            publicacionesdeMas.preVenta = org.TipodeOrganizacion.cantidadPropPreVenta - cuentaProps[i].count;
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
  }
} */

const checkPublicacionesRestantes = async (req, res, next)  => {
  try {
    const paquetesActivos = req.paquetesActivos;
    
    const publicacionesDisponibles = {
      organizacion:paquetesActivos[0].orgId,
      venta:0,
      renta:0,
      preVenta:0,
    }
    
    // Organizando el total de operaciones disponibles
    for (let i = 0; i < paquetesActivos.length; i++) {
      if(paquetesActivos[i].tipodeOperacion === "Venta")
        publicacionesDisponibles.venta = publicacionesDisponibles.venta+paquetesActivos[i].cantidaddePropiedades;
      if(paquetesActivos[i].tipodeOperacion === "Renta")
        publicacionesDisponibles.renta = publicacionesDisponibles.renta+paquetesActivos[i].cantidaddePropiedades;
      if(paquetesActivos[i].tipodeOperacion === "VentaoRenta"){
        publicacionesDisponibles.renta = publicacionesDisponibles.renta+paquetesActivos[i].cantidaddePropiedades;
        publicacionesDisponibles.venta = publicacionesDisponibles.venta+paquetesActivos[i].cantidaddePropiedades;
        publicacionesDisponibles.tipodeOperacion = "VentaoRenta"
      }
      if(paquetesActivos[i].tipodeOperacion === "PreVenta")
        publicacionesDisponibles.preVenta = publicacionesDisponibles.preVenta+paquetesActivos[i].cantidaddePropiedades;
    }

    const cuentaProps = await Propiedad.count(
      {
        where:{ publicada:"Si" , OrganizacionId:paquetesActivos[0].orgId }, 
        attributes: ['publicada', 'TipoOperacionId', 'OrganizacionId'], 
        group:['publicada', 'TipoOperacionId', 'OrganizacionId'] 
      }
    );

    const publicacionesRestantes = {
      organizacion:paquetesActivos[0].orgId,
      venta:publicacionesDisponibles.venta,
      renta:publicacionesDisponibles.renta,
      preVenta:publicacionesDisponibles.preVenta,
    }      
    
    for (let i = 0; i < cuentaProps.length; i++) {
      if(publicacionesDisponibles.tipodeOperacion === "VentaoRenta" && cuentaProps[i].TipoOperacionId === 1
        ||
        publicacionesDisponibles.tipodeOperacion === "VentaoRenta" && cuentaProps[i].TipoOperacionId === 3
      ){
        publicacionesRestantes.venta = publicacionesDisponibles.venta - cuentaProps[i].count;
        publicacionesRestantes.renta =  publicacionesDisponibles.renta - cuentaProps[i].count;
      }
      else{
        if(cuentaProps[i].TipoOperacionId === 1){ 
          publicacionesRestantes.venta = publicacionesDisponibles.venta - cuentaProps[i].count;
        }
        if(cuentaProps[i].TipoOperacionId === 3 ){
          publicacionesRestantes.renta =  publicacionesDisponibles.renta - cuentaProps[i].count;
        }
        if(cuentaProps[i].TipoOperacionId === 2 ){
          publicacionesRestantes.preVenta =  publicacionesDisponibles.preVenta - cuentaProps[i].count;
        }
      }
    }
    // Si hay rentas o ventas se manda mensaje
    if(publicacionesRestantes.venta > 0 || publicacionesRestantes.renta > 0 || publicacionesRestantes.preVenta > 0){
      req.publicaciones = publicacionesRestantes;
      next();
    } 
    else {
      publicacionesRestantes.mensaje = "No cuentas con autorizacion para publicar mas propiedades"
      res.json(publicacionesRestantes);
    } 
  } catch (e) {
      res.send(e)
  }
}

const checkTipodeOrganizacion = async(req, res, next) => {
  try {
    //const publicacionesRestantes = req.publicacionesRestantes; 
    const orgId = req.orgId;
    const org = await Organizacion.findOne({
      where:{ id:orgId },
      include:  TipodeOrganizacion
    })
    req.TipodeOrg = org.TipodeOrganizacion;
    next();
  } catch (error) {
    res.json(error)
  }
}

servidorPago.use(checkPagosActivos, checkPublicacionesRestantes, checkTipodeOrganizacion);

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


module.exports = { checkPagosActivos, servidorPago };