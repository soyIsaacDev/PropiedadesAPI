const server = require("express").Router();

const { Agente, Organizacion, AgenteDeDesarrollo, PaquetedePago, HistorialdePagos, Autorizacion } = require("../db");

const formatDateYMD = (date) => {
    // Convert the date to ISO string
    const isoString = date.toISOString();
    // Split at the "T" character to get the date part
    const formattedDate = isoString.split("T")[0];
    return formattedDate;
};

const {checkPago } = require("../middleware/checkPago");

server.get("/", async (req,res)=> {
    try {
        
        const crearOrg = await Organizacion.create({
            organizacion:"Velox",
        });

        crearAgente.OrganizacionId=crearOrg.id;
        crearAgente.save();

        const paquetePago1Gratis = await PaquetedePago.create(
            {                
                nombrePaquete:"Gratis",
                precio:0.00,
                tipodeOperacion:"Venta/Renta",
                periodicidad:"Mensual",     
                cantidaddePropiedades:1, 
                tipodePago:"Gratuito",
                tipodePropiedad:"Individual",
                tiempodeConstruccion:"ConUso",
                fechaInicioOferta:"2025-01-01",
                fechaFinOferta:"2025-04-01",
            }
        )

        res.send(crearAgente)

    } catch (e) {
        
    }
});

server.get("/paquetepago", async (req,res)=> {
    try {
       const paquetePagoDesarrollador = await PaquetedePago.create(
        {                
            nombrePaquete:"Desarrollador",
            precio:1000,
            tipodeOperacion:"Venta",
            periodicidad:"Mensual",     
            cantidaddePropiedades:1, 
            tipodePago:"Pagado",
            tipodePropiedad:"Desarrollo",
            tiempodeConstruccion:"Nueva",
            fechaInicioOferta:"2025-01-01",
            fechaFinOferta:"2025-12-31",
        }
    )

    res.send(paquetePagoDesarrollador )
    } catch (e) {
        res.send(e)
    }
})

server.get("/paquetepagoGratis", async (req,res)=> {
    try {
        const paquetePago1Gratis = await PaquetedePago.create(
            {                
                nombrePaquete:"Gratis",
                precio:0.00,
                tipodeOperacion:"Venta/Renta",
                periodicidad:"Mensual",     
                cantidaddePropiedades:1, 
                tipodePago:"Gratuito",
                tipodePropiedad:"Individual",
                tiempodeConstruccion:"ConUso",
                fechaInicioOferta:"2025-01-01",
                fechaFinOferta:"2025-04-01",
            }
        )

    res.send(paquetePago1Gratis )
    } catch (e) {
        res.send(e)
    }
})

server.get("/paquetes", async(req,res)=>{
    try {
        const paquetes = await PaquetedePago.findAll();
        res.send(paquetes)
    } catch (e) {
        res.send(e)
    }
})

server.get("/statusdePaquete", async(req,res)=>{
    try {
        const paquete = await PaquetedePago.findOne({
            where:{
                nombrePaquete:"Gratis"
            }
        })
    
        const hoy = new Date();
        const fechahoy = formatDateYMD(hoy);

        if(paquete.fechaFinOferta>fechahoy){
            res.send("PAQUETE ACTIVO");
        }
        else {
            res.send("RENOVAR PAQUETE");
        }
    } catch (e) {
        res.send(e)
    }
})

server.get("/nuevoPago", async(req,res)=>{
    try {
        const historial = await HistorialdePagos.findAll({
            where:{
                OrganizacionId:"b7b986c7-b2e9-45fa-8087-eda07c1b22ae"
            },
            order: [
                ['fechaFin','DESC']
            ],
        })
        const hoy = new Date();   
        var fechaHistorial;  
        // Si no existe un historial previo   
        if(historial.length!==0){
            //Formateando como fecha para poder comparar
            fechaHistorial = new Date(historial[0].fechaFin);
        }
        else{
            fechaHistorial = hoy;
        }
    
        // Revisamos si ya se encuentra pagado el periodo actual
        if(hoy < fechaHistorial){
            res.send("STATUS PAGADO")
        }
        else{
            console.log("PAGANDO")
            const ProximoMes = new Date();
            ProximoMes.setMonth(ProximoMes.getMonth() + 1);
    
            const nuevoPago = await HistorialdePagos.create(
                {               
                    fechaInicio:hoy,
                    fechaFin:ProximoMes,
                    OrganizacionId:"b7b986c7-b2e9-45fa-8087-eda07c1b22ae",
                    PaquetedePagoId:1, 
                }
            )     
            res.send(nuevoPago); 
        }
    } catch (e) {
        res.send(e)
    }
})


module.exports = server;