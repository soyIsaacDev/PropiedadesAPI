const server = require("express").Router();
const { Propiedad, Estado, Municipio, Ciudad, Colonia, AmenidadesdelaPropiedad, AmenidadesDesarrollo,
    TipoOperacion, TipodePropiedad, ImgPropiedad, ModeloAsociadoPropiedad, ImgModeloAsociado,
    ColoniaCiudad, AmenidadesDesarrolloPropiedad, AmenidadesModeloAmenidad, EstiloArquitectura,
    Organizacion, AutorizacionesXTipodeOrg, TipodeUsuario, HistorialdePagos, PaquetedePago, PaquetePagoPorOrg,
    Equipamiento, Mascotas
} = require("../db");
const organizacion = require("../models/organizacion");



server.get("/bulk", async (req, res) => {
    const DEVMODE = process.env.DEVELOPMENT;

    console.log(DEVMODE);

    try {
        const EstadoCreado = await Estado.create({
            estado: "Sonora"
        });
        const MunicipioCreado = await Municipio.create({
            municipio: "Hermosillo"
        });
        const CiudadCreada = await Ciudad.create({
            ciudad: "Hermosillo"
        });

        // agregando relaciones entre ellos
        MunicipioCreado.EstadoId = EstadoCreado.id;
        await MunicipioCreado.save();
        CiudadCreada.MunicipioId = await MunicipioCreado.id
        await CiudadCreada.save();

        /* for (let i = 0; i < ColoniaCreada.length; i++) {
            await ColoniaCiudad.create(
                {ColoniumId:ColoniaCreada[i].id, CiudadId:CiudadCreada.id}
            )  
        } */
    const AmenidadPropiedad = await AmenidadesdelaPropiedad.bulkCreate([               
        { nombreAmenidad: "Alberca", icon: "mdi-pool", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Asador", icon: "mdi-grill", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Balcón", icon: "mdi-balcony", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Bar", icon: "mdi-glass-cocktail", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Biblioteca", icon: "mdi-bookshelf", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Bodega", icon: "mdi-package-variant", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Bodega de Vinos", icon: "mdi-wine-bar", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Cancha de Futbol", icon: "mdi-soccer", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Cancha de Paddel", icon: "mdi-tennis", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Cancha de Tennis", icon: "mdi-tennis", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Cancha de Voleibol", icon: "mdi-volleyball", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Chimenea", icon: "mdi-fireplace", libreria: "MaterialDesignIcons" },    
        { nombreAmenidad: "Closets", icon: "mdi-wardrobe", libreria: "MaterialDesignIcons" },    
        { nombreAmenidad: "Cuarto de Huéspedes", icon: "mdi-bed", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Cuarto de Juegos", icon: "mdi-toy-brick", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Cuarto de Servicio", icon: "mdi-broom", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Cuarto de Servicio con Baño", icon: "mdi-shower", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Estancia", icon: "mdi-sofa", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Estudio", icon: "mdi-desk-lamp", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Fire Pit", icon: "mdi-fire", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Gimnasio", icon: "mdi-dumbbell", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Horno de Leña", icon: "mdi-stove", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Jacuzzi", icon: "mdi-hot-tub", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Jardín", icon: "mdi-flower", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Lavandería", icon: "mdi-washing-machine", libreria: "MaterialDesignIcons" },    
        { nombreAmenidad: "Patio", icon: "mdi-garden", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Pool Bar", icon: "mdi-pool", libreria: "MaterialDesignIcons" },        
        { nombreAmenidad: "Roof Garden", icon: "mdi-roofing", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Sala de Billar", icon: "mdi-billiards", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Sala de Cine", icon: "mdi-projector-screen", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Sala de TV", icon: "mdi-television", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Sauna", icon: "mdi-sauna", libreria: "MaterialDesignIcons" },            
        { nombreAmenidad: "Sistema de Sonido", icon: "mdi-speaker", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Terraza", icon: "mdi-terrace", libreria: "MaterialDesignIcons" },    
        { nombreAmenidad: "Vestidor", icon: "mdi-hanger", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Vista Panorámica", icon: "mdi-panorama", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Walk-in Closet", icon: "mdi-wardrobe-outline", libreria: "MaterialDesignIcons" }
    ])

        const AmenidadDesarrolloCreado = await AmenidadesDesarrollo.bulkCreate([
            { nombreAmenidad: "Acceso Controlado", icon: "mdi-gate", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Alberca", icon: "mdi-pool", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Alberca para Niños", icon: "mdi-pool", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Andador de Jogging", icon: "mdi-run", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Area de Fitness", icon: "mdi-dumbbell", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Area de Juegos", icon: "mdi-gamepad-variant", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Áreas Verdes", icon: "mdi-leaf", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Asadores", icon: "mdi-grill", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Bar", icon: "mdi-glass-cocktail", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Business Center", icon: "mdi-briefcase", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Cancha de Basquetbol", icon: "mdi-basketball", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Cancha de Futbol", icon: "mdi-soccer", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Cancha de Paddel", icon: "mdi-tennis", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Cancha de Tennis", icon: "mdi-tennis", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Cancha de Voleibol", icon: "mdi-volleyball", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Carril de Nado", icon: "mdi-swim", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Casa Club", icon: "mdi-home", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Cine", icon: "mdi-movie", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Coffee Station", icon: "mdi-coffee", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Coworking", icon: "mdi-desktop-mac", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Cuarto de Huéspedes", icon: "mdi-bed", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Elevador", icon: "mdi-elevator", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Espacio para Eventos", icon: "mdi-party-popper", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Estacionamiento de Visitas", icon: "mdi-parking", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Estacionamiento para Bicicletas", icon: "mdi-bike", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Estacionamiento Techado", icon: "mdi-garage", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Fire Pit", icon: "mdi-fire", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Gimnasio", icon: "mdi-dumbbell", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Jacuzzi", icon: "mdi-hot-tub", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Jardin", icon: "mdi-flower", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Juegos Infantiles", icon: "mdi-castle", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Lavandería Comunitaria", icon: "mdi-washing-machine", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Ludoteca", icon: "mdi-teddy-bear", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Mirador", icon: "mdi-binoculars", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Pet Park", icon: "mdi-paw", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Piñatero", icon: "mdi-party-popper", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Pool Bar", icon: "mdi-pool", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Recepción", icon: "mdi-desk", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Restaurante", icon: "mdi-silverware-fork-knife", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Roof Garden", icon: "mdi-roofing", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Ruta de Bicicleta", icon: "mdi-bike", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Sala de Billar", icon: "mdi-billiards", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Sala de Juegos", icon: "mdi-cards-playing", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Salón de Fiestas", icon: "mdi-party-popper", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Sala de TV", icon: "mdi-television", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Salón de Usos Múltiples", icon: "mdi-chair-rolling", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Sauna", icon: "mdi-sauna", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Seguridad 24/7", icon: "mdi-shield-lock", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Sistema Contra Incendios", icon: "mdi-fire-extinguisher", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "Spa", icon: "mdi-spa", libreria: "MaterialDesignIcons" },
            { nombreAmenidad: "VideoVigilancia", icon: "mdi-cctv", libreria: "MaterialDesignIcons" },
        ])

        // EQUIPAMIENTO - Sistemas e instalaciones de la propiedad
        const EquipamientoCreado = await Equipamiento.bulkCreate([
            { nombre: "Acceso Controlado", icon: "mdi-gate", libreria: "MaterialDesignIcons" },
            { nombre: "Aire Acondicionado", icon: "mdi-air-conditioner", libreria: "MaterialDesignIcons" },
            { nombre: "Calefacción", icon: "mdi-radiator", libreria: "MaterialDesignIcons" },
            { nombre: "Calentador de Agua", icon: "mdi-water-boiler", libreria: "MaterialDesignIcons" },
            { nombre: "Calentador Solar", icon: "mdi-solar-power", libreria: "MaterialDesignIcons" },
            { nombre: "Cisterna", icon: "mdi-water-pump", libreria: "MaterialDesignIcons" },
            { nombre: "Cocina Equipada", icon: "mdi-countertop", libreria: "MaterialDesignIcons" },
            { nombre: "Domótica", icon: "mdi-home-automation", libreria: "MaterialDesignIcons" },
            { nombre: "Electrodomésticos Incluidos", icon: "mdi-fridge", libreria: "MaterialDesignIcons" },
            { nombre: "Extractores de Aire", icon: "mdi-fan", libreria: "MaterialDesignIcons" },
            { nombre: "Filtro de Agua", icon: "mdi-water-filter", libreria: "MaterialDesignIcons" },
            { nombre: "Hidroneumático", icon: "mdi-water-pump", libreria: "MaterialDesignIcons" },
            { nombre: "Paneles Solares", icon: "mdi-solar-panel", libreria: "MaterialDesignIcons" },
            { nombre: "Portón Eléctrico", icon: "mdi-gate", libreria: "MaterialDesignIcons" },
            { nombre: "Sistema Contra Incendios", icon: "mdi-fire-extinguisher", libreria: "MaterialDesignIcons" },
            { nombre: "Sistema de Alarma", icon: "mdi-alarm-light", libreria: "MaterialDesignIcons" },
            { nombre: "Sistema de Riego Automático", icon: "mdi-sprinkler", libreria: "MaterialDesignIcons" },
            { nombre: "Sistema de VideoVigilancia", icon: "mdi-cctv", libreria: "MaterialDesignIcons" },
            { nombre: "Seguridad", icon: "mdi-shield-check", libreria: "MaterialDesignIcons" },
            { nombre: "Seguridad 24/7", icon: "mdi-shield-lock", libreria: "MaterialDesignIcons" },
            { nombre: "Tanque Estacionario", icon: "mdi-cylinder", libreria: "MaterialDesignIcons" },
            { nombre: "Ventanas de Doble Vidrio", icon: "mdi-window-closed", libreria: "MaterialDesignIcons" },
        ])

        const TipodeOpCreada = await TipoOperacion.bulkCreate(
            [
                { tipodeOperacion: "Venta" },
                { tipodeOperacion: "Pre Venta" },
                { tipodeOperacion: "Renta" },
            ]
        );

        const TipodePropCreada = await TipodePropiedad.bulkCreate(
            [
                { tipoPropiedad: "Casa" },
                { tipoPropiedad: "Departamento" },
                { tipoPropiedad: "Terreno Residencial" }

            ]
        );

        const EstiloArq = await EstiloArquitectura.bulkCreate(
            [
                { nombreEstilo: "Minimalista" },
                { nombreEstilo: "Moderna" },
                { nombreEstilo: "Barroco" },
            ]
        );

        const tiposdeOrg = await AutorizacionesXTipodeOrg.bulkCreate([
            {
                nombreTipoOrg: "Desarrolladora",
                tipodeOperacionAut: "Venta",
                tipodeDesarrolloAut: "Desarrollo",
                tiempodeConstruccionAut: "Nuevo",
                cantidadPropVenta: 100,
                cantidadPropRenta: 0,
                cantidadPropPreVenta: 0,
            },
            {
                nombreTipoOrg: "TratoDirecto",
                tipodeOperacionAut: "VentaoRenta",
                tipodeDesarrolloAut: "PropiedadIndependiente",
                tiempodeConstruccionAut: "ConUso",
                cantidadPropVenta: 1,
                cantidadPropRenta: 1,
                cantidadPropPreVenta: 0,
            },
            {
                nombreTipoOrg: "DireccionTotal",
                tipodeOperacionAut: "Todas",
                tipodeDesarrolloAut: "Todos",
                tiempodeConstruccionAut: "Todas",
                cantidadPropVenta: 90000,
                cantidadPropRenta: 90000,
                cantidadPropPreVenta: 90000,
            },
            {
                nombreTipoOrg: "General",
                tipodeOperacionAut: "NoAutorizado",
                tipodeDesarrolloAut: "NoAutorizado",
                tiempodeConstruccionAut: "NoAutorizado",
                cantidadPropVenta: 0,
                cantidadPropRenta: 0,
                cantidadPropPreVenta: 0,
            },
        ])

        const MascotasCreadas = await Mascotas.bulkCreate([
            { nombre: "Solo Perros", icon: "dog", libreria: "FontAwesome5" },
            { nombre: "Solo Gatos", icon: "cat", libreria: "FontAwesome5" },
            { nombre: "Mascotas Pequeñas" },
            { nombre: "Mascotas Silenciosas" },
        ])

        console.log("Creando Bulk")

        
        if (DEVMODE === "Production") {
        }
        else {

        }

        res.json(EstiloArq)

    } catch (e) {
        res.send(e);
    }
})

/* server.get("/actualizarOrg/:nombre/:orgTId", async (req, res) => { 
    try {
        const {nombre, orgTId} = req.params;
        const organizacion = await Organizacion.findOne({
            where:{organizacion:nombre}
        })
        await organizacion.update({AutorizacionesXTipodeOrgId:orgTId});
        res.send(organizacion)
    } catch (error) {
        res.send
    }
}) */

server.get("/nuevoTipodeUsuario", async (req, res) => {
    try {
        //const tiposdeUsuario = await TipodeUsuario.create(
        const tiposdeUsuario = await TipodeUsuario.bulkCreate([
            {
                tipo: "IsaDueñoBorMiquirrayDueño",
                giro: "Todos",
                manejaUsuarios: "Si",
                tipodeOperacionAut: "Todas",
                cantidadPropVenta: 90000,
                cantidadPropRenta: 90000,
                cantidadPropPreVenta: 90000,
            },
            {
                tipo: "Aliado",
                giro: "Todos",
                manejaUsuarios: "No",
            },
            {
                tipo: "ClientePropietario",
                giro: "Todos",
                manejaUsuarios: "No",
            },
            {
                tipo: "Desarrollador",
                giro: "Habitacional",
                manejaUsuarios: "Si",
                tipodeOperacionAut: "Venta",
                cantidadPropVenta: 100,
                cantidadPropRenta: 100,
                cantidadPropPreVenta: 0,
            },

            {
                tipo: "Desarrollador",
                giro: "Comercial",
                manejaUsuarios: "Si",
                tipodeOperacionAut: "Venta",
                cantidadPropVenta: 100,
                cantidadPropRenta: 100,
                cantidadPropPreVenta: 0,

            },

            {
                tipo: "Desarrollador",
                giro: "HabitacionalyComercial",
                manejaUsuarios: "Si",
                tipodeOperacionAut: "Venta",
                cantidadPropVenta: 100,
                cantidadPropRenta: 100,
                cantidadPropPreVenta: 0,
            },

            {
                tipo: "Desarrollador",
                giro: "Mixto",
                manejaUsuarios: "Si",
                tipodeOperacionAut: "Venta",
                cantidadPropVenta: 100,
                cantidadPropRenta: 100,
                cantidadPropPreVenta: 0,
            },

            {
                tipo: "Desarrollador",
                giro: "Todos",
                manejaUsuarios: "Si",
                tipodeOperacionAut: "Venta",
                cantidadPropVenta: 100,
                cantidadPropRenta: 100,
                cantidadPropPreVenta: 0,
            },
            {
                tipo: "AgentedeDesarrollo",
                giro: "Todos",
                manejaUsuarios: "No",
                tipodeOperacionAut: "Venta",
                cantidadPropVenta: 100,
                cantidadPropRenta: 100,
                cantidadPropPreVenta: 0,
            },
            {
                tipo: "ClienteFinal",
                giro: "Todos",
                manejaUsuarios: "No",
                tipodeOperacionAut: "NoAutorizado",
                cantidadPropVenta: 0,
                cantidadPropRenta: 0,
                cantidadPropPreVenta: 0,
            },
            {
                tipo: "DueñoTratoDirecto",
                giro: "Todos",
                manejaUsuarios: "No",
                tipodeOperacionAut: "VentayRenta",
                cantidadPropVenta: 1,
                cantidadPropRenta: 1,
                cantidadPropPreVenta: 0,
            },
        ])
        res.send(tiposdeUsuario);
    } catch (error) {
        res.send(error);
    }
});


server.get("/crearAutorizacionXTipodeOrg", async (req, res) => {
    try {
        const autorizacionXTipoOrg = await AutorizacionesXTipodeOrg.bulkCreate([
            {
                nombreTipoOrg: "DireccionTotal",
                tipodeOperacionAut: "Todas",
                tipodeDesarrolloAut: "Todos",
                tiempodeConstruccionAut: "Todas",
                cantidadPropVenta: 90000,
                cantidadPropRenta: 90000,
                cantidadPropPreVenta: 90000,
            },
            {
                nombreTipoOrg: "Desarrolladora",
                tipodeOperacionAut: "Venta",
                tipodeDesarrolloAut: "Desarrollo",
                tiempodeConstruccionAut: "Nuevo",
                cantidadPropVenta: 100,
                cantidadPropRenta: 0,
                cantidadPropPreVenta: 0,
            },
            {
                nombreTipoOrg: "TratoDirecto",
                tipodeOperacionAut: "VentaoRenta",
                tipodeDesarrolloAut: "PropiedadIndependiente",
                tiempodeConstruccionAut: "ConUso",
                cantidadPropVenta: 1,
                cantidadPropRenta: 1,
                cantidadPropPreVenta: 0,
            },
            {
                nombreTipoOrg: "General",
                tipodeOperacionAut: "NoAutorizado",
                tipodeDesarrolloAut: "NoAutorizado",
                tiempodeConstruccionAut: "NoAutorizado",
                cantidadPropVenta: 0,
                cantidadPropRenta: 0,
                cantidadPropPreVenta: 0,
            },
        ])
        res.json(autorizacionXTipoOrg);
    } catch (error) {
        res.send(error)
    }
})

/* server.get("/actualizarTipoOrg", async (req, res) => { 
    try {
        console.log("Actualizando Tipo Org")
        const tipoOrg = {
            nombreTipoOrg:"TratoDirecto",
            tipodeOperacionAut:"VentaoRenta",
            tipodeDesarrolloAut:"PropiedadIndependiente",
            tiempodeConstruccionAut:"ConUso",
            cantidadPropVenta:1,
            cantidadPropRenta:1,
            cantidadPropPreVenta:0,
          }
        const tipoOrganizacion = await AutorizacionesXTipodeOrg.findOne({
            where:{nombreTipoOrg:tipoOrg.nombreTipoOrg}
        })
        //res.json(tipoOrganizacion)
        await tipoOrganizacion.update({
            tipodeOperacionAut:tipoOrg.tipodeOperacionAut,
            tipodeDesarrolloAut:tipoOrg.tipodeDesarrolloAut,
            tiempodeConstruccionAut:tipoOrg.tiempodeConstruccionAut,
        });
        res.json(tipoOrganizacion)
    } catch (error) {
        res.send
    }
}) */

server.get("/crearPaquetePago", async (req, res) => {
    try {
        const paquetesCreados = await PaquetedePago.bulkCreate([
            {
                nombrePaquete: "DireccionTotal",
                precio: 0,
                periodicidad: "Mensual",
                tipodePago: "Gratuito",
                fechaInicioOferta: "2025-01-01",
                fechaFinOferta: "2200-01-01",
            },
            {
                tipodeOrg: "Desarrolladora",
                nombrePaquete: "Desarrollador",
                precio: 0,
                periodicidad: "Mensual",
                tipodePago: "Gratuito",
                fechaInicioOferta: "2025-01-01",
                fechaFinOferta: "2025-05-31",
            },
            {
                tipodeOrg: "TratoDirecto",
                nombrePaquete: "TratoDirecto",
                precio: 0,
                periodicidad: "Mensual",
                tipodePago: "Gratuito",
                fechaInicioOferta: "2025-01-01",
                fechaFinOferta: "2025-05-31",
            },
        ])

        /* const paquetesxOrg = await PaquetePagoPorOrg.bulkCreate([
            { // Direccion
                AutorizacionesXTipodeOrgId:"41a8c882-0d85-4c91-a17a-e94c42e2248a",
                PaquetedePagoId:paquetesCreados[0].id
            },
            { // Desarrollador
                AutorizacionesXTipodeOrgId:"fd02f96f-888a-40f1-a170-7d2778980f19",
                PaquetedePagoId:paquetesCreados[1].id
            },
            {  // TratoDirecto
                AutorizacionesXTipodeOrgId:"22a44bfc-ce80-4803-bc7e-cda92be7448a",
                PaquetedePagoId:paquetesCreados[2].id
            },
        ]); */


        res.json(paquetesCreados);

    } catch (error) {
        res.json(error)
    }
})

//Actualizar la org Id para aplicar el paquete
server.get("/pagar", async (req, res) => {
    try {
        const pagar = await HistorialdePagos.bulkCreate([
            {   // Inmozz
                fechaInicio: "2025-02-01",
                fechaFin: "2200-01-01",
                OrganizacionId: "b1548035-bf52-4063-9328-91dbaee6e3a6",
                PaquetedePagoId: 1,
            },
            /* {   // General 
                fechaInicio:"2025-02-01",
                fechaFin:"2025-05-31",
                OrganizacionId:"6521961c-1a27-4cec-956a-e0891faa577f",
                PaquetedePagoId:3,          
            },  */
        ])

        res.json(pagar);

    } catch (error) {
        res.json(error)
    }
})

//Actualizar la org Id y la autorizacionpara aplicar la autorizacion
server.get("/cambiarAutorizacion", async (req, res) => {
    try {
        const org = await Organizacion.findByPk("4df64930-eced-4964-9e0b-5b1606449ea2");
        org.AutorizacionId = "c5a66490-14f8-4e6e-9af2-7dc93c0d9cb4";
        await org.save();
        res.json(org);
    } catch (error) {
        res.json(error)
    }
})

server.get("/crearAmenidadesPropiedad", async (req, res) => {
  try {
    const AmenidadPropiedad = await AmenidadesdelaPropiedad.bulkCreate([               
        { nombreAmenidad: "Alberca", icon: "mdi-pool", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Asador", icon: "mdi-grill", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Balcón", icon: "mdi-balcony", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Bar", icon: "mdi-glass-cocktail", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Biblioteca", icon: "mdi-bookshelf", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Bodega", icon: "mdi-package-variant", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Bodega de Vinos", icon: "mdi-wine-bar", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Cancha de Futbol", icon: "mdi-soccer", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Cancha de Paddel", icon: "mdi-tennis", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Cancha de Tennis", icon: "mdi-tennis", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Cancha de Voleibol", icon: "mdi-volleyball", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Chimenea", icon: "mdi-fireplace", libreria: "MaterialDesignIcons" },    
        { nombreAmenidad: "Closets", icon: "mdi-wardrobe", libreria: "MaterialDesignIcons" },    
        { nombreAmenidad: "Cuarto de Huéspedes", icon: "mdi-bed", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Cuarto de Juegos", icon: "mdi-toy-brick", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Cuarto de Servicio", icon: "mdi-broom", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Cuarto de Servicio con Baño", icon: "mdi-shower", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Estancia", icon: "mdi-sofa", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Estudio", icon: "mdi-desk-lamp", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Fire Pit", icon: "mdi-fire", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Gimnasio", icon: "mdi-dumbbell", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Horno de Leña", icon: "mdi-stove", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Jacuzzi", icon: "mdi-hot-tub", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Jardín", icon: "mdi-flower", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Lavandería", icon: "mdi-washing-machine", libreria: "MaterialDesignIcons" },    
        { nombreAmenidad: "Patio", icon: "mdi-garden", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Pool Bar", icon: "mdi-pool", libreria: "MaterialDesignIcons" },        
        { nombreAmenidad: "Roof Garden", icon: "mdi-roofing", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Sala de Billar", icon: "mdi-billiards", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Sala de Cine", icon: "mdi-projector-screen", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Sala de TV", icon: "mdi-television", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Sauna", icon: "mdi-sauna", libreria: "MaterialDesignIcons" },            
        { nombreAmenidad: "Sistema de Sonido", icon: "mdi-speaker", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Terraza", icon: "mdi-terrace", libreria: "MaterialDesignIcons" },    
        { nombreAmenidad: "Vestidor", icon: "mdi-hanger", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Vista Panorámica", icon: "mdi-panorama", libreria: "MaterialDesignIcons" },
        { nombreAmenidad: "Walk-in Closet", icon: "mdi-wardrobe-outline", libreria: "MaterialDesignIcons" }
    ])
    res.json(AmenidadPropiedad);
  } catch (error) {
    res.json(error)
  }
})

server.get('/equipamiento', async (req, res) => {
    try {
        const EquipamientoCreado = await Equipamiento.bulkCreate([
            { nombre: "Acceso Controlado", icon: "mdi-gate", libreria: "MaterialDesignIcons" },
            { nombre: "Aire Acondicionado", icon: "mdi-air-conditioner", libreria: "MaterialDesignIcons" },
            { nombre: "Calefacción", icon: "mdi-radiator", libreria: "MaterialDesignIcons" },
            { nombre: "Calentador de Agua", icon: "mdi-water-boiler", libreria: "MaterialDesignIcons" },
            { nombre: "Calentador Solar", icon: "mdi-solar-power", libreria: "MaterialDesignIcons" },
            { nombre: "Cisterna", icon: "mdi-water-pump", libreria: "MaterialDesignIcons" },
            { nombre: "Cocina Equipada", icon: "mdi-countertop", libreria: "MaterialDesignIcons" },
            { nombre: "Domótica", icon: "mdi-home-automation", libreria: "MaterialDesignIcons" },
            { nombre: "Electrodomésticos Incluidos", icon: "mdi-fridge", libreria: "MaterialDesignIcons" },
            { nombre: "Extractores de Aire", icon: "mdi-fan", libreria: "MaterialDesignIcons" },
            { nombre: "Filtro de Agua", icon: "mdi-water-filter", libreria: "MaterialDesignIcons" },
            { nombre: "Hidroneumático", icon: "mdi-water-pump", libreria: "MaterialDesignIcons" },
            { nombre: "Paneles Solares", icon: "mdi-solar-panel", libreria: "MaterialDesignIcons" },
            { nombre: "Portón Eléctrico", icon: "mdi-gate", libreria: "MaterialDesignIcons" },
            { nombre: "Sistema Contra Incendios", icon: "mdi-fire-extinguisher", libreria: "MaterialDesignIcons" },
            { nombre: "Sistema de Alarma", icon: "mdi-alarm-light", libreria: "MaterialDesignIcons" },
            { nombre: "Sistema de Riego Automático", icon: "mdi-sprinkler", libreria: "MaterialDesignIcons" },
            { nombre: "Sistema de VideoVigilancia", icon: "mdi-cctv", libreria: "MaterialDesignIcons" },
            { nombre: "Seguridad", icon: "mdi-shield-check", libreria: "MaterialDesignIcons" },
            { nombre: "Seguridad 24/7", icon: "mdi-shield-lock", libreria: "MaterialDesignIcons" },
            { nombre: "Tanque Estacionario", icon: "mdi-cylinder", libreria: "MaterialDesignIcons" },
            { nombre: "Ventanas de Doble Vidrio", icon: "mdi-window-closed", libreria: "MaterialDesignIcons" },
        ])
        res.json(EquipamientoCreado);
    } catch (error) {
        res.json(error);
    }
})

server.get('/mascotas', async (req, res) => {
    try {
        const MascotasCreadas = await Mascotas.bulkCreate([
            { nombre: "Solo Perros", icon: "dog", libreria: "FontAwesome5" },
            { nombre: "Solo Gatos", icon: "cat", libreria: "FontAwesome5" },
            { nombre: "Mascotas Pequeñas" },
            { nombre: "Mascotas Silenciosas" },
        ])
        res.json(MascotasCreadas);
    } catch (error) {
        console.error(error);
        res.json(error);
    }
})



module.exports = server;