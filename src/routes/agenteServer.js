const server = require("express").Router();

const { Agente, Organizacion, AgenteDeDesarrollo, PaquetedePago, HistorialdePagos, Autorizacion } = require("../db");

const formatDateYMD = (date) => {
    // Convert the date to ISO string
    const isoString = date.toISOString();
    // Split at the "T" character to get the date part
    const formattedDate = isoString.split("T")[0];
    return formattedDate;
};

const {checkPago }= require("../middleware/checkPago");

server.post("/checarPago", checkPago, async (req,res)=> {
    res.send("PAGO OK")
})

server.get("/", async (req,res)=> {
    try {
        const crearAgente = await Agente.create(
            {
                nombre:"Juan",
                apellidoP:"Garza",
                apellidoM:"Miquirray",
                Email:"jgarza@gmail.com",
                Telefono:"66212234562",
                tipo:"Desarrollador",
                giro:"Habitacional",
                escala:"Desarrollador",
            }
        )
        const crearOrg = await Organizacion.create({
            organizacion:"Velox",
        });

        crearAgente.OrganizacionId=crearOrg.id;
        crearAgente.save();

        const AgenteDesarollo = await AgenteDeDesarrollo.create(
            {
                nombre:"Cristina",
                apellidoP:"Morales",
                apellidoM:"juarez",
                Email:"cmorales@gmail.com",
                Telefono:"66212538591",
                tipo:"AgentedeDesarrollo",
                escala:"Agente",
                AgenteId:crearAgente.id,
                OrganizacionId:crearOrg.id,
            },
        )
        
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
                OrganizacionId:"e29c1eae-6bc4-4e18-9799-995e8ab00994"
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
                    OrganizacionId:"e29c1eae-6bc4-4e18-9799-995e8ab00994",
                    PaquetedePagoId:1, 
                }
            )     
            res.send(nuevoPago); 
        }
    } catch (e) {
        res.send(e)
    }
})

//server.get("/historialdePagosAgentes", async(req,res)=>{
server.get("/historialdePagosAgentes/:tipodeAgente/:idAgente", async(req,res)=>{
    try {
        const { tipodeAgente, idAgente} = req.params;
        //const { tipodeAgente, idAgente} = req.body;
        var agente;
        if(tipodeAgente==="AgenteDeDesarrollo"){
            agente = await AgenteDeDesarrollo.findOne({
                where:{
                    id:idAgente
                }            
            });
        }
        else{
            agente = await Agente.findOne({
                where:{
                    id:idAgente
                }            
            });
        }
        const historialdePagos = await HistorialdePagos.findAll({
            where:{
                OrganizacionId:agente.OrganizacionId
            },
            order: [
                ['fechaFin','DESC']
            ],
        })
        
        //Formateando como fecha para poder comparar
        const fechaHistorial = new Date(historialdePagos[0].fechaFin);
        const hoy = new Date();
        if(hoy < fechaHistorial){
            res.send("Si esta pagado")
            //Next
        }
        else{
            res.send("NO pagado")
        }
    } catch (e) {
        res.send(e)
    }
});

server.get("/agentes", async(req, res)=>{
    try {
        const Agentes = await Agente.findAll();
        res.send(Agentes)
    } catch (e) {
        res.send(e)
    }
})

server.get("/agentesdeDesarrollo", async(req, res)=>{
    try {
        const Agentes = await AgenteDeDesarrollo.findAll();
        res.send(Agentes)
    } catch (e) {
        res.send(e)
    }
})

server.get("/autorizarAgente", async (req, res) => {
    try {
        const autorizacion = await Autorizacion.findOrCreate({
            where:{
                AgenteDeDesarrolloId:"636a4ca4-6dc4-44c1-82f6-b19ed89057a8",
            },
            defaults:{
                niveldeAutorizacion:"Editar"
            }            
        })
        console.log(autorizacion)
        if(autorizacion[1] === false) res.send("Ya tiene auth previa");
        else res.send(autorizacion);
    } catch (e) {
        res.send(e)
    }
})
server.get("/borrarAutorizacion", async (req,res)=> {
    try {
        await Autorizacion.destroy({
            where:{
                AgenteDeDesarrolloId:"636a4ca4-6dc4-44c1-82f6-b19ed89057a8",
            }
        })
        res.send("Borrado")
    } catch (e) {
        res.send(e)
    }
})
server.get("/borrarTablas", async (req,res)=> {
    try {
       await Agente.destroy({
        where:{
            nombre:"Juan"
        }
       });
       await Agente.destroy({
        where:{
            nombre:"Cristina"
        }
       });
       await Organizacion.destroy({
        where:{
            organizacion:"Velox"
        }
       })
       res.send("Ok")
    } catch (e) {
        res.send(e)
    }
})
module.exports = server;