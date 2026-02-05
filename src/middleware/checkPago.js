const { HistorialdePagos, Cliente, Desarrollo, Organizacion, AutorizacionesXTipodeOrg, 
  PaquetedePago, PropiedadIndependiente  } = require("../db");
const servidorPago = require("express").Router();


const checkPagosActivos = async function (req, res, next) {
  try {
    const userId = req.body.userId;
    console.log("Check Pagos Activos userId:", userId);
    
    let orgId = req.orgId;

    if(userId){
      const cliente = await Cliente.findOne({
        where:{ userId },
      })

      if (!cliente) {
        console.log('Cliente no encontrado para userId:', userId);
        return res.status(400).json({ error: 'Cliente no encontrado' });
      }
      //console.log('Cliente encontrado:', cliente);
      orgId = cliente.OrganizacionId;
      if (!orgId) {
        console.log('No se pudo determinar la organización');
        return res.status(400).json({ error: 'No se pudo determinar la organización' });
      }
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
    
    //console.log("Historial de pagos:", historialdePagos);
    
    if(historialdePagos && historialdePagos.length>0){
      const paquetesActivos = [];
      for (let i = 0; i < historialdePagos.length; i++) {
        const fechasHistorial = new Date(historialdePagos[i].fechaFin);
        const hoy = new Date();
        
        if(hoy < fechasHistorial){
          // Si esta activo el paquete
          const historialActivo = {...historialdePagos[i].PaquetedePagoId.dataValues, orgId:historialdePagos[i].OrganizacionId }
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
     
    //console.log("Publicaciones Restantes", org.AutorizacionesXTipodeOrg)
    const cuentaDesarrollos = await Desarrollo.count(
      {
        where:{ publicada:true , OrganizacionId:orgId }, 
        attributes: ['publicada', 'TipoOperacionId', 'OrganizacionId'], 
        group:['publicada', 'TipoOperacionId', 'OrganizacionId'] 
      }
    );
    
    const cuentaPropsIndependientes = await PropiedadIndependiente.count(
      {
        where:{ publicada:true , OrganizacionId:orgId }, 
        attributes: ['publicada', 'TipoOperacionId', 'OrganizacionId'], 
        group:['publicada', 'TipoOperacionId', 'OrganizacionId'] 
      }
    );    

    let cuentaProps = undefined;
    const tipodeOrganizacion = org.AutorizacionesXTipodeOrg.nombreTipoOrg;
    tipodeOrganizacion === "TratoDirecto"? cuentaProps =cuentaPropsIndependientes  : cuentaProps = cuentaDesarrollos;
    
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

const crearPago = async (orgId, mesesPagados, idPaquetedePagoAComprar) => {
    try {
    /* Validaciones a hacer:
            Revisamos si ya se encuentra pagado el mismo paquete en el periodo actual
            Revisando si el paquete de pago existe
            Revisamos si el paquete aun se encuentra activo
    */
    
    const historial = await HistorialdePagos.findAll({
      where: {
        OrganizacionId: orgId,
      },
      order: [["fechaFin", "DESC"]],
    });

    const validacion = {
      orgActiva: "La organizacion no existe",
      paqueteExistente: "No existe ese paquete de pagos",
      paqueteActivo: "El paquete se encuentra inactivo",
    };
    const hoy = new Date();
    // Revisamos si ya se encuentra pagado el mismo paquete en el periodo actual
    for (let i = 0; i < historial.length; i++) {
      let fechaFinHistorial = new Date(historial[i].fechaFin);
      let hoy = new Date();
      if (
        hoy < fechaFinHistorial &&
        historial[i].PaquetedePagoId === idPaquetedePagoAComprar
      ) {
        return "Tienes un paquete del mismo tipo ya pagado";
      } else {
        validacion.pagoPrevio = 1;
      }
    }
    let fechaFindePago = new Date();
    fechaFindePago.setMonth(fechaFindePago.getMonth() + mesesPagados);

    const organizacion = await Organizacion.findOne({
      where: { id: orgId },
      include: AutorizacionesXTipodeOrg,
    });
    const paquetedePago = await PaquetedePago.findOne({
      where: { id: idPaquetedePagoAComprar }
    });
    //VALIDACIONES
    if (organizacion) validacion.orgActiva = 1;
    // Revisando si el paquete de pago existe
    if (paquetedePago) validacion.paqueteExistente = 1;
    // Revisamos si el paquete aun se encuentra activo
    if (new Date(paquetedePago.fechaFinOferta) >= fechaFindePago)
      validacion.paqueteActivo = 1;
    //}
    else if (new Date(paquetedePago.fechaFinOferta) < fechaFindePago) {
      fechaFindePago = new Date(paquetedePago.fechaFinOferta);
      validacion.paqueteActivo = 1;
    }

    // Todas las validaciones son correctas
    if (
      validacion.orgActiva === 1 &&
      validacion.paqueteExistente === 1 &&
      validacion.paqueteActivo === 1
    ) {
      console.log("Validaciones Correctas");
      const nuevoPago = await HistorialdePagos.create({
        fechaInicio: hoy,
        fechaFin: fechaFindePago,
        OrganizacionId: orgId,
        PaquetedePagoId: idPaquetedePagoAComprar,
      });
      return nuevoPago;
    } else {
      return validacion;
    }
  } catch (e) {
    throw e;
  }
}

//servidorPago.use(checkPagosActivos, checkPublicacionesRestantesyAutxTipodeOrg);
servidorPago.get("/verificarPago", (req, res) => {
  res.json({ mensaje: "Servicio de verificación de pago activo" });
});

servidorPago.post("/revisarPago",  async (req, res, next)=>{
  console.log("Iniciando petición a /revisarPago", { 
      body: req.body,
      headers: req.headers 
    });
    next();
  },
  checkPagosActivos, 
  checkPublicacionesRestantesyAutxTipodeOrg,
  (req, res) => {
  try {
    console.log("Procesando /revisarPago después de middlewares");
    const publicacionesRestantes = req.publicaciones;
    const tipodeOrg = req.TipodeOrg;
    //console.log(publicacionesRestantes)
    res.json({pago:"Se encuentra pagado", publicacionesRestantes, tipodeOrg})
  } catch (error) {
    res.send(error)
  }
})




module.exports = { checkPagosActivos, checkPublicacionesRestantesyAutxTipodeOrg, crearPago, servidorPago };