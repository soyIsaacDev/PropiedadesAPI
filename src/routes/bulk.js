const server = require("express").Router();
const { Propiedad, Estado, Municipio, Ciudad, Colonia, AmenidadesPropiedad, AmenidadesDesarrollo,
    TipoOperacion, TipodePropiedad, ImgPropiedad, ModeloAsociadoPropiedad, ImgModeloAsociado, 
    ColoniaCiudad, AmenidadesDesarrolloPropiedad, AmenidadesModeloAmenidad, EstiloArquitectura } = require("../db");



server.get("/bulk", async (req,res)=> {
    const DEVMODE = process.env.DEVELOPMENT;

    console.log(DEVMODE);
    
    try {
        // CONSIDERAR UN MODELO DE ARQUITECTURA
        // CONSIDERAR PISOS DE LA PROPIEDAD
        const EstadoCreado = await Estado.create({
            estado:"Sonora" 
        });
        const MunicipioCreado = await Municipio.create({
            municipio:"Hermosillo"
        });
        const CiudadCreada = await Ciudad.create({
             ciudad:"Hermosillo"
        });
        
        
        const ColoniaCreada = await Colonia.bulkCreate([
            {colonia:"Las Quintas"},
            {colonia:"Santa Fe"},
            {colonia:"Los Lagos"},
            {colonia:"Valle Grande"},
            {colonia:"Valle Verde"},
            {colonia:"Pitic"},
            {colonia:"Centenario"},
            {colonia:"Centro"},
            {colonia:"Montecarlo"},
            {colonia:"Corceles"},
            {colonia:"La Encantada"},
            {colonia:"Villas del Mediterraneo"},
            {colonia:"La Coruña"},
            {colonia:"Villa Satelite"},
            {colonia:"La Jolla"},
            {colonia:"Los Arcos"},
            {colonia:"Villa de Seris"},
            {colonia:"Jardines de Monaco"},
            {colonia:"Palermo"},
            {colonia:"Monterosa"},
        ]);
        
          // agregando relaciones entre ellos
        MunicipioCreado.EstadoId = EstadoCreado.id; 
        await MunicipioCreado.save();
        CiudadCreada.MunicipioId= await MunicipioCreado.id
        await CiudadCreada.save();
        
        for (let i = 0; i < ColoniaCreada.length; i++) {
            await ColoniaCiudad.create(
                {ColoniumId:ColoniaCreada[i].id, CiudadId:CiudadCreada.id}
            )  
        }
        
        const AmenidadPropiedad = await AmenidadesPropiedad.bulkCreate([
            { nombreAmenidad:"Terraza" },
            { nombreAmenidad:"Roof Garden" },
            { nombreAmenidad:"Biblioteca" },
            { nombreAmenidad:"Alberca" },
            { nombreAmenidad:"Gimnasio" },
            { nombreAmenidad:"Sala de Juegos" },
        ])
        
        const AmenidadDesarrolloCreado = await AmenidadesDesarrollo.bulkCreate([
            { nombreAmenidad:"Roof Garden" },
            { nombreAmenidad:"Alberca" },
            { nombreAmenidad:"Gimnasio" },
            { nombreAmenidad:"Sala de Juegos" },
            { nombreAmenidad:"Ludoteca" },
            { nombreAmenidad:"Cancha de Tennis" },
            { nombreAmenidad:"Cancha de Paddel" },
            { nombreAmenidad:"Cancha de Futbol" },
            { nombreAmenidad:"Cancha de Basquetbol" },
        ])
        
        const TipodeOpCreada = await TipoOperacion.bulkCreate(
            [
                {tipodeOperacion:"Venta"},
                {tipodeOperacion:"Renta"},
            ]
        );
        
        const TipodePropCreada = await TipodePropiedad.bulkCreate(
            [
                {tipoPropiedad:"Casa"},
                {tipoPropiedad:"Departamento"},
                {tipoPropiedad:"Terreno"}
            ]
        );

        const EstiloArq = await EstiloArquitectura.bulkCreate(
            [
                {nombreEstilo:"Minimalista"},
                {nombreEstilo:"Moderno"},
                {nombreEstilo:"Barroco"},
            ]
        );

          console.log("Creando Bulk")
          
        const Desarrollo = await Propiedad.bulkCreate([
            {
                nombreDesarrollo:"Lagos",
                precioMin:1.2,
                precioMax:2.5,
                añodeConstruccion:2024,
                calle:"Blvd Colosio",
                numeroPropiedad:285,
                numeroInterior:1,
                posicion:{lat: 29.074899516830552, lng: -111.00259924118788},
                EstadoId:1,
                MunicipioId: 1,
                CiudadId:1,
                ColoniumId:1,
                TipodePropiedadId:2,
                TipoOperacionId:1, 
                EstiloArquitecturaId:1,
            },
            {
                nombreDesarrollo:"Elementos",
                precioMin:2.4,
                precioMax:3.5,
                añodeConstruccion:2024,
                calle:"Blvd Quiroga",
                numeroPropiedad:382,
                numeroInterior:1,
                posicion:{lat: 29.133071191291105, lng: -111.02505811800508},
                EstadoId:1,
                MunicipioId: 1,
                CiudadId:1,
                ColoniumId:1,
                TipodePropiedadId:1,
                TipoOperacionId:1,
                EstiloArquitecturaId:2,
            },
            {
                nombreDesarrollo:"Oceano",
                precioMin:3.1,
                precioMax:4.2,
                añodeConstruccion:2024,
                calle:"Blvd Colosio",
                numeroPropiedad:285,
                numeroInterior:1,
                posicion:{lat: 29.087602597220876, lng: -110.97243726520614},
                EstadoId:1,
                MunicipioId: 1,
                CiudadId:1,
                ColoniumId:1,
                TipodePropiedadId:2,
                TipoOperacionId:1,
                EstiloArquitecturaId:2,
            },
            {
                nombreDesarrollo:"Sierra",
                precioMin:2.5,
                precioMax:3.5,
                añodeConstruccion:2024,
                calle:"Blvd Quiroga",
                numeroPropiedad:382,
                numeroInterior:1,
                posicion:{lat: 29.07578238006772, lng: -110.96164099650971},
                EstadoId:1,
                MunicipioId: 1,
                CiudadId:1,
                ColoniumId:1,
                TipodePropiedadId:2,
                TipoOperacionId:1,
                EstiloArquitecturaId:3,
            },
            {
                nombreDesarrollo:"Entre Rios",
                precioMin:2.6,
                precioMax:3.5,
                añodeConstruccion:2024,
                calle:"Blvd Colosio",
                numeroPropiedad:285,
                numeroInterior:1,
                posicion:{lat: 29.08241177974686, lng: -110.92095991168634},
                EstadoId:1,
                MunicipioId: 1,
                CiudadId:1,
                ColoniumId:1,
                TipodePropiedadId:1,
                TipoOperacionId:1,
                EstiloArquitecturaId:1,
            },
            {
                nombreDesarrollo:"India",
                precioMin:4.2,
                precioMax:5.6,
                añodeConstruccion:2024,
                calle:"Blvd Quiroga",
                numeroPropiedad:382,
                numeroInterior:1,
                posicion:{lat: 29.148856713442562, lng: -110.94678963997549},
                EstadoId:1,
                MunicipioId: 1,
                CiudadId:1,
                ColoniumId:1,
                TipodePropiedadId:1,
                TipoOperacionId:1,
                EstiloArquitecturaId:2,
            },
        
        ]);
          
          /* AmenidadesDesarrollo */
        const AmenidadesdelDesarrolloCreado = await AmenidadesDesarrolloPropiedad.bulkCreate([
            {PropiedadId:Desarrollo[0].id, AmenidadesDesarrolloId:AmenidadDesarrolloCreado[0].id},
            {PropiedadId:Desarrollo[0].id, AmenidadesDesarrolloId:AmenidadDesarrolloCreado[1].id},
            {PropiedadId:Desarrollo[0].id, AmenidadesDesarrolloId:AmenidadDesarrolloCreado[3].id},
            {PropiedadId:Desarrollo[1].id, AmenidadesDesarrolloId:AmenidadDesarrolloCreado[2].id},
            {PropiedadId:Desarrollo[1].id, AmenidadesDesarrolloId:AmenidadDesarrolloCreado[4].id},
            {PropiedadId:Desarrollo[1].id, AmenidadesDesarrolloId:AmenidadDesarrolloCreado[7].id},
            {PropiedadId:Desarrollo[2].id, AmenidadesDesarrolloId:AmenidadDesarrolloCreado[0].id},
            {PropiedadId:Desarrollo[2].id, AmenidadesDesarrolloId:AmenidadDesarrolloCreado[2].id},
            {PropiedadId:Desarrollo[2].id, AmenidadesDesarrolloId:AmenidadDesarrolloCreado[3].id},
            {PropiedadId:Desarrollo[2].id, AmenidadesDesarrolloId:AmenidadDesarrolloCreado[6].id},
            {PropiedadId:Desarrollo[3].id, AmenidadesDesarrolloId:AmenidadDesarrolloCreado[1].id},
            {PropiedadId:Desarrollo[3].id, AmenidadesDesarrolloId:AmenidadDesarrolloCreado[5].id},
            {PropiedadId:Desarrollo[3].id, AmenidadesDesarrolloId:AmenidadDesarrolloCreado[8].id},
            {PropiedadId:Desarrollo[4].id, AmenidadesDesarrolloId:AmenidadDesarrolloCreado[0].id},
            {PropiedadId:Desarrollo[4].id, AmenidadesDesarrolloId:AmenidadDesarrolloCreado[1].id},
            {PropiedadId:Desarrollo[4].id, AmenidadesDesarrolloId:AmenidadDesarrolloCreado[2].id},
            {PropiedadId:Desarrollo[4].id, AmenidadesDesarrolloId:AmenidadDesarrolloCreado[5].id},
            {PropiedadId:Desarrollo[4].id, AmenidadesDesarrolloId:AmenidadDesarrolloCreado[6].id},
            {PropiedadId:Desarrollo[4].id, AmenidadesDesarrolloId:AmenidadDesarrolloCreado[7].id},
            {PropiedadId:Desarrollo[5].id, AmenidadesDesarrolloId:AmenidadDesarrolloCreado[0].id},
            {PropiedadId:Desarrollo[5].id, AmenidadesDesarrolloId:AmenidadDesarrolloCreado[1].id},
            {PropiedadId:Desarrollo[5].id, AmenidadesDesarrolloId:AmenidadDesarrolloCreado[3].id},
            {PropiedadId:Desarrollo[5].id, AmenidadesDesarrolloId:AmenidadDesarrolloCreado[4].id},
            {PropiedadId:Desarrollo[5].id, AmenidadesDesarrolloId:AmenidadDesarrolloCreado[5].id},
            {PropiedadId:Desarrollo[5].id, AmenidadesDesarrolloId:AmenidadDesarrolloCreado[6].id},
            {PropiedadId:Desarrollo[5].id, AmenidadesDesarrolloId:AmenidadDesarrolloCreado[8].id},
        ])
        
        const Modelo = await ModeloAsociadoPropiedad.bulkCreate([
            {
                nombreModelo:"Lago de Chapala",
                PropiedadId:Desarrollo[0].id,
                CiudadId:CiudadCreada.id,
                EstadoId:EstadoCreado.id,
                precio:2.5,
                recamaras:3, 
                baños:2,
                medio_baño:1,
                espaciosCochera:2,
                cocheraTechada:false,
                m2Construccion:160,
                m2Terreno:240,
                m2Total:400,
                posicion:Desarrollo[0].posicion,
                niveles:1,
            },
            {
                nombreModelo:"Lago de Cuemacuaro",
                PropiedadId:Desarrollo[0].id,
                CiudadId:CiudadCreada.id,
                EstadoId:EstadoCreado.id,
                precio:2.1,
                recamaras:2, 
                baños:2,
                medio_baño:1,
                espaciosCochera:2,
                cocheraTechada:false,
                m2Construccion:120,
                m2Terreno:100,
                m2Total:220,
                posicion:Desarrollo[0].posicion,
                niveles:1,
            },
            {
                nombreModelo:"Lago de Montebello",
                PropiedadId:Desarrollo[0].id,
                CiudadId:CiudadCreada.id,
                EstadoId:EstadoCreado.id,
                precio:1.7,
                recamaras:2, 
                baños:2,
                medio_baño:0,
                espaciosCochera:2,
                cocheraTechada:false,
                m2Construccion:120,
                m2Terreno:100,
                m2Total:220,
                posicion:Desarrollo[0].posicion,
                niveles:1,
            },
            {
                nombreModelo:"Lago de Tequesquitengo",
                PropiedadId:Desarrollo[0].id,
                CiudadId:CiudadCreada.id,
                EstadoId:EstadoCreado.id,
                precio:1.2,
                recamaras:2, 
                baños:1,
                medio_baño:0,
                espaciosCochera:2,
                cocheraTechada:true,
                m2Construccion:120,
                m2Terreno:100,
                m2Total:220,
                posicion:Desarrollo[0].posicion,
                niveles:1,
            },
            {
                nombreModelo:"Fuego",
                PropiedadId:Desarrollo[1].id,
                CiudadId:CiudadCreada.id,
                EstadoId:EstadoCreado.id,
                precio:2.4,
                recamaras:3, 
                baños:2,
                medio_baño:1,
                espaciosCochera:2,
                cocheraTechada:false,
                m2Construccion:160,
                m2Terreno:240,
                m2Total:400,
                posicion:Desarrollo[1].posicion,
                niveles:2,
            },
            {
                nombreModelo:"Agua",
                PropiedadId:Desarrollo[1].id,
                CiudadId:CiudadCreada.id,
                EstadoId:EstadoCreado.id,
                precio:3,
                recamaras:3, 
                baños:3,
                medio_baño:1,
                espaciosCochera:3,
                cocheraTechada:true,
                m2Construccion:160,
                m2Terreno:240,
                m2Total:400,
                posicion:Desarrollo[1].posicion,
                niveles:2,
            },
            {
                nombreModelo:"Aire",
                PropiedadId:Desarrollo[1].id,
                CiudadId:CiudadCreada.id,
                EstadoId:EstadoCreado.id,
                precio:3.5,
                recamaras:3, 
                baños:3,
                medio_baño:1,
                espaciosCochera:3,
                cocheraTechada:true,
                m2Construccion:160,
                m2Terreno:240,
                m2Total:400,
                posicion:Desarrollo[1].posicion,
                niveles:1,
            },
            {
                nombreModelo:"Pacifico",
                PropiedadId:Desarrollo[2].id,
                CiudadId:CiudadCreada.id,
                EstadoId:EstadoCreado.id,
                precio:3.1,
                recamaras:3, 
                baños:3,
                medio_baño:1,
                espaciosCochera:3,
                cocheraTechada:false,
                m2Construccion:160,
                m2Terreno:240,
                m2Total:400,
                posicion:Desarrollo[2].posicion,
                niveles:2,
            },
            {
                nombreModelo:"Atlantico",
                PropiedadId:Desarrollo[2].id,
                CiudadId:CiudadCreada.id,
                EstadoId:EstadoCreado.id,
                precio:4.2,
                recamaras:4, 
                baños:4,
                medio_baño:1,
                espaciosCochera:3,
                cocheraTechada:true,
                m2Construccion:160,
                m2Terreno:240,
                m2Total:400,
                posicion:Desarrollo[2].posicion,
                niveles:1,
            },
            {
                nombreModelo:"Sierra Madre",
                PropiedadId:Desarrollo[3].id,
                CiudadId:CiudadCreada.id,
                EstadoId:EstadoCreado.id,
                precio:2.5,
                recamaras:3, 
                baños:3,
                medio_baño:0,
                espaciosCochera:4,
                cocheraTechada:true,
                m2Construccion:160,
                m2Terreno:200,
                m2Total:360,
                posicion:Desarrollo[3].posicion,
                niveles:1,
            },
            {
                nombreModelo:"Pico de Orizaba",
                PropiedadId:Desarrollo[3].id,
                CiudadId:CiudadCreada.id,
                EstadoId:EstadoCreado.id,
                precio:3.5,
                recamaras:3, 
                baños:3,
                medio_baño:1,
                espaciosCochera:4,
                cocheraTechada:true,
                m2Construccion:190,
                m2Terreno:240,
                m2Total:430,
                posicion:Desarrollo[3].posicion,
                niveles:1,
            },
            {
                nombreModelo:"Nilo",
                PropiedadId:Desarrollo[4].id,
                CiudadId:CiudadCreada.id,
                EstadoId:EstadoCreado.id,
                precio:2.6,
                recamaras:2, 
                baños:2,
                medio_baño:0,
                espaciosCochera:2,
                cocheraTechada:false,
                m2Construccion:160,
                m2Terreno:240,
                m2Total:400,
                posicion:Desarrollo[4].posicion,
                niveles:3,
            },
            {
                nombreModelo:"Amazonas",
                PropiedadId:Desarrollo[4].id,
                CiudadId:CiudadCreada.id,
                EstadoId:EstadoCreado.id,
                precio:3.1,
                recamaras:3, 
                baños:2,
                medio_baño:1,
                espaciosCochera:2,
                cocheraTechada:true,
                m2Construccion:160,
                m2Terreno:240,
                m2Total:400,
                posicion:Desarrollo[4].posicion,
                niveles:2,
            },
            {
                nombreModelo:"Tiber",
                PropiedadId:Desarrollo[4].id,
                CiudadId:CiudadCreada.id,
                EstadoId:EstadoCreado.id,
                precio:3.5,
                recamaras:3, 
                baños:3,
                medio_baño:1,
                espaciosCochera:3,
                cocheraTechada:true,
                m2Construccion:160,
                m2Terreno:240,
                m2Total:400,
                posicion:Desarrollo[4].posicion,
                niveles:3,
            },
            {
                nombreModelo:"El Taj",
                PropiedadId:Desarrollo[5].id,
                CiudadId:CiudadCreada.id,
                EstadoId:EstadoCreado.id,
                precio:4.2,
                recamaras:3, 
                baños:2,
                medio_baño:1,
                espaciosCochera:3,
                cocheraTechada:true,
                m2Construccion:300,
                m2Terreno:240,
                m2Total:540,
                posicion:Desarrollo[5].posicion,
                niveles:2,
            },
            {
                nombreModelo:"Loto",
                PropiedadId:Desarrollo[5].id,
                CiudadId:CiudadCreada.id,
                EstadoId:EstadoCreado.id,
                precio:4.8,
                recamaras:2, 
                baños:2,
                medio_baño:1,
                espaciosCochera:3,
                cocheraTechada:false,
                m2Construccion:360,
                m2Terreno:240,
                m2Total:600,
                posicion:Desarrollo[5].posicion,
                niveles:1,
            },
            {
                nombreModelo:"Akshardham",
                PropiedadId:Desarrollo[5].id,
                CiudadId:CiudadCreada.id,
                EstadoId:EstadoCreado.id,
                precio:5.6,
                recamaras:4, 
                baños:3,
                medio_baño:1,
                espaciosCochera:3,
                cocheraTechada:true,
                m2Construccion:400,
                m2Terreno:300,
                m2Total:700,
                posicion:Desarrollo[5].posicion,
                niveles:2,            
            },
            
        ]);

        for (let i = 0; i < Modelo.length; i++) {
            function RandomInt(min, max) {
                const minCeiled = Math.ceil(min);
                const maxFloored = Math.floor(max);
                return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
            }
            const RandomAmenidades= RandomInt(0,2);
            if(RandomAmenidades===0){
                const AmenidadesModelosRandom = await AmenidadesModeloAmenidad.bulkCreate([
                    {   ModeloAsociadoPropiedadId:Modelo[i].id,
                        AmenidadesPropiedadId:AmenidadPropiedad[RandomInt(0,3)].id
                    },
                    {   ModeloAsociadoPropiedadId:Modelo[i].id,
                        AmenidadesPropiedadId:AmenidadPropiedad[RandomInt(3,6)].id
                    }
                ]);
            }
            else{
                const AmenidadesModelosRandom = await AmenidadesModeloAmenidad.bulkCreate([
                    {   ModeloAsociadoPropiedadId:Modelo[i].id,
                        AmenidadesPropiedadId:AmenidadPropiedad[RandomInt(0,2)].id
                    },
                    {   ModeloAsociadoPropiedadId:Modelo[i].id,
                        AmenidadesPropiedadId:AmenidadPropiedad[RandomInt(2,4)].id
                    },
                    {   ModeloAsociadoPropiedadId:Modelo[i].id,
                        AmenidadesPropiedadId:AmenidadPropiedad[RandomInt(4,6)].id
                    },
                ]);
            }            
        }

        //detalles_imgChica: "https://storage.googleapis.com/dadinumco-media/
        if(DEVMODE === "Production"){
            const imagenPropiedad = await ImgPropiedad.bulkCreate([
                //Lagos
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Lagos1.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Lagos1.jpg",
                    detalles_imgChica: "https://storage.googleapis.com/dadinumco-media/Lagos1.jpg",
                    PropiedadId:1
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Lagos2.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Lagos2.JPG",
                    detalles_imgChica: "https://storage.googleapis.com/dadinumco-media/Lagos2.JPG",
                    PropiedadId:1
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Lagos3.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Lagos3.JPG",
                    detalles_imgChica: "https://storage.googleapis.com/dadinumco-media/Lagos3.JPG",
                    PropiedadId:1
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Lagos4.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Lagos4.JPG",
                    PropiedadId:1
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Lagos5.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Lagos5.JPG",
                    PropiedadId:1
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Lagos6.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Lagos6.JPG",
                    PropiedadId:1
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Lagos7.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Lagos7.jpg",
                    PropiedadId:1
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Lagos8.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Lagos8.jpg",
                    PropiedadId:1
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Lagos9.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Lagos9.jpg",
                    PropiedadId:1
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Lagos10.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Lagos10.JPG",
                    PropiedadId:1
                },
                //Elementos
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Elementos1.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Elementos1.jpg",
                    detalles_imgChica: "https://storage.googleapis.com/dadinumco-media/Elementos1.jpg",
                    PropiedadId:2
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Elementos2.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Elementos2.jpg",
                    detalles_imgChica: "https://storage.googleapis.com/dadinumco-media/Elementos2.jpg",
                    PropiedadId:2
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Elementos3.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Elementos3.jpg",
                    detalles_imgChica: "https://storage.googleapis.com/dadinumco-media/Elementos3.jpg",
                    PropiedadId:2
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Elementos4.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Elementos4.jpg",
                    PropiedadId:2
                },
                //Oceano
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Oceano1.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Oceano1.JPG",
                    detalles_imgChica: "https://storage.googleapis.com/dadinumco-media/Oceano1.JPG",
                    PropiedadId:3
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Oceano2.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Oceano2.JPG",
                    detalles_imgChica: "https://storage.googleapis.com/dadinumco-media/Oceano2.JPG",
                    PropiedadId:3
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Oceano3.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Oceano3.JPG",
                    detalles_imgChica: "https://storage.googleapis.com/dadinumco-media/Oceano3.JPG",
                    PropiedadId:3
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Oceano4.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Oceano4.JPG",
                    PropiedadId:3
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Oceano5.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Oceano5.JPG",
                    PropiedadId:3
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Oceano6.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Oceano6.JPG",
                    PropiedadId:3
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Oceano7.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Oceano7.JPG",
                    PropiedadId:3
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Oceano8.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Oceano8.JPG",
                    PropiedadId:3
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Oceano9.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Oceano9.jpg",
                    PropiedadId:3
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Oceano10.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Oceano10.jpg",
                    PropiedadId:3
                },
                //Sierra
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Sierra1.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Sierra1.jpg",
                    detalles_imgChica: "https://storage.googleapis.com/dadinumco-media/Sierra1.jpg",
                    PropiedadId:4
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Sierra2.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Sierra2.jpg",
                    detalles_imgChica: "https://storage.googleapis.com/dadinumco-media/Sierra2.jpg",
                    PropiedadId:4
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Sierra3.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Sierra3.jpg",
                    detalles_imgChica: "https://storage.googleapis.com/dadinumco-media/Sierra3.jpg",
                    PropiedadId:4
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Sierra4.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Sierra4.JPG",
                    PropiedadId:4
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Sierra5.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Sierra5.jpg",
                    PropiedadId:4
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Sierra6.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Sierra6.jpg",
                    PropiedadId:4
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Sierra7.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Sierra7.jpg",
                    PropiedadId:4
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Sierra8.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Sierra8.jpg",
                    PropiedadId:4
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/Sierra9.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/Sierra9.jpg",
                    PropiedadId:4
                },
                
                //Entre Rios
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/EntreRios1.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/EntreRios1.jpg",
                    detalles_imgChica: "https://storage.googleapis.com/dadinumco-media/EntreRios1.jpg",
                    PropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/EntreRios2.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/EntreRios2.jpg",
                    detalles_imgChica: "https://storage.googleapis.com/dadinumco-media/EntreRios2.jpg",
                    PropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/EntreRios3.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/EntreRios3.jpg",
                    detalles_imgChica: "https://storage.googleapis.com/dadinumco-media/EntreRios3.jpg",
                    PropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/EntreRios4.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/EntreRios4.jpg",
                    PropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/EntreRios5.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/EntreRios5.jpg",
                    PropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/EntreRios6.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/EntreRios6.jpg",
                    PropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/EntreRios7.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/EntreRios7.jpg",
                    PropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/EntreRios8.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/EntreRios8.jpg",
                    PropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/EntreRios9.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/EntreRios9.jpg",
                    PropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/EntreRios10.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/EntreRios10.jpg",
                    PropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/EntreRios11.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/EntreRios11.jpg",
                    PropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/EntreRios12.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/EntreRios12.jpg",
                    PropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/EntreRios13.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/EntreRios13.jpg",
                    PropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/EntreRios14.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/EntreRios14.jpg",
                    PropiedadId:5
                },
                //India
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTaj0.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTaj0.jpg",
                    detalles_imgChica: "https://storage.googleapis.com/dadinumco-media/ElTaj0.jpg",
                    PropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTaj1.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTaj1.jpg",
                    detalles_imgChica: "https://storage.googleapis.com/dadinumco-media/ElTaj1.jpg",
                    PropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTaj2.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTaj2.jpg",
                    detalles_imgChica: "https://storage.googleapis.com/dadinumco-media/ElTaj2.jpg",
                    PropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTaj3.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTaj3.jpg",
                    PropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTaj4.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTaj4.jpg",
                    PropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTaj5.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTaj5.jpg",
                    PropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTaj6.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTaj6.jpg",
                    PropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTaj7.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTaj7.jpg",
                    PropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTaj8.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTaj8.jpg",
                    PropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTaj9.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTaj9.jpg",
                    PropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTaj10.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTaj10.jpg",
                    PropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTaj11.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTaj11.jpg",
                    PropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTaj12.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTaj12.jpg",
                    PropiedadId:6
                },
                
            ]);
    
            const imagenModeloAsociado = await ImgModeloAsociado.bulkCreate([
                //Lago
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/LagoA1.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/LagoA1.jpg",
                    ModeloAsociadoPropiedadId:1
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/LagoA2.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/LagoA2.JPG",
                    ModeloAsociadoPropiedadId:1
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/LagoA3.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/LagoA3.JPG",
                    ModeloAsociadoPropiedadId:1
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/LagoB1.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/LagoB1.jpg",
                    ModeloAsociadoPropiedadId:2
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/LagoB2.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/LagoB2.JPG",
                    ModeloAsociadoPropiedadId:2
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/LagoB3.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/LagoB3.JPG",
                    ModeloAsociadoPropiedadId:2
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/LagoB4.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/LagoB4.JPG",
                    ModeloAsociadoPropiedadId:2
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/LagoC1.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/LagoC1.jpg",
                    ModeloAsociadoPropiedadId:3
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/LagoC2.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/LagoC2.JPG",
                    ModeloAsociadoPropiedadId:3
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/LagoC3.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/LagoC3.JPG",
                    ModeloAsociadoPropiedadId:3
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/LagoD.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/LagoD.JPG",
                    ModeloAsociadoPropiedadId:4
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/LagoD2.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/LagoD2.JPG",
                    ModeloAsociadoPropiedadId:4
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/LagoD3.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/LagoD3.JPG",
                    ModeloAsociadoPropiedadId:4
                },
                //Elementos
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElementoA1.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElementoA1.jpg",
                    ModeloAsociadoPropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElementoA2.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElementoA2.jpg",
                    ModeloAsociadoPropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElementoA3.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElementoA3.jpg",
                    ModeloAsociadoPropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElementoA4.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElementoA4.jpg",
                    ModeloAsociadoPropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElementoB1.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElementoB1.jpg",
                    ModeloAsociadoPropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElementoB2.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElementoB2.jpg",
                    ModeloAsociadoPropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElementoB3.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElementoB3.jpg",
                    ModeloAsociadoPropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElementoB4.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElementoB4.jpg",
                    ModeloAsociadoPropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElementoC1.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElementoC1.jpg",
                    ModeloAsociadoPropiedadId:7
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElementoC2.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElementoC2.jpg",
                    ModeloAsociadoPropiedadId:7
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElementoC3.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElementoC3.jpg",
                    ModeloAsociadoPropiedadId:7
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElementoC4.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElementoC4.jpg",
                    ModeloAsociadoPropiedadId:7
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElementoC5.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElementoC5.jpg",
                    ModeloAsociadoPropiedadId:7
                },
                //Oceano
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/OceanoA1.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/OceanoA1.jpg",
                    ModeloAsociadoPropiedadId:8
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/OceanoA2.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/OceanoA2.jpg",
                    ModeloAsociadoPropiedadId:8
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/OceanoA3.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/OceanoA3.jpg",
                    ModeloAsociadoPropiedadId:8
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/OceanoA4.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/OceanoA4.jpg",
                    ModeloAsociadoPropiedadId:8
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/OceanoB1.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/OceanoB1.jpg",
                    ModeloAsociadoPropiedadId:9
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/OceanoB2.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/OceanoB2.jpg",
                    ModeloAsociadoPropiedadId:9
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/OceanoB3.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/OceanoB3.jpg",
                    ModeloAsociadoPropiedadId:9
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/OceanoB4.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/OceanoB4.jpg",
                    ModeloAsociadoPropiedadId:9
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/OceanoB5.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/OceanoB5.jpg",
                    ModeloAsociadoPropiedadId:9
                },
                 //Sierra
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/SierraA1.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/SierraA1.JPG",
                    ModeloAsociadoPropiedadId:10
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/SierraA2.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/SierraA2.JPG",
                    ModeloAsociadoPropiedadId:10
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/SierraA3.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/SierraA3.JPG",
                    ModeloAsociadoPropiedadId:10
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/SierraA4.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/SierraA4.JPG",
                    ModeloAsociadoPropiedadId:10
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/SierraA5.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/SierraA5.JPG",
                    ModeloAsociadoPropiedadId:10
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/SierraA6.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/SierraA6.JPG",
                    ModeloAsociadoPropiedadId:10
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/SierraA7.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/SierraA7.JPG",
                    ModeloAsociadoPropiedadId:10
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/SierraA8.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/SierraA8.JPG",
                    ModeloAsociadoPropiedadId:10
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/SierraA9.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/SierraA9.JPG",
                    ModeloAsociadoPropiedadId:10
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/SierraB1.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/SierraB1.JPG",
                    ModeloAsociadoPropiedadId:11
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/SierraB2.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/SierraB2.JPG",
                    ModeloAsociadoPropiedadId:11
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/SierraB3.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/SierraB3.JPG",
                    ModeloAsociadoPropiedadId:11
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/SierraB4.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/SierraB4.JPG",
                    ModeloAsociadoPropiedadId:11
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/SierraB5.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/SierraB5.JPG",
                    ModeloAsociadoPropiedadId:11
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/SierraB6.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/SierraB6.JPG",
                    ModeloAsociadoPropiedadId:11
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/SierraB7.JPG",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/SierraB7.JPG",
                    ModeloAsociadoPropiedadId:11
                },
                
                //Entre Rios
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/EntreRiosA1.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/EntreRiosA1.jpg",
                    ModeloAsociadoPropiedadId:12
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/EntreRiosA2.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/EntreRiosA2.jpg",
                    ModeloAsociadoPropiedadId:12
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/EntreRiosA3.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/EntreRiosA3.jpg",
                    ModeloAsociadoPropiedadId:12
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/EntreRiosA4.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/EntreRiosA4.jpg",
                    ModeloAsociadoPropiedadId:12
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/EntreRiosA5.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/EntreRiosA5.jpg",
                    ModeloAsociadoPropiedadId:12
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/EntreRiosA6.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/EntreRiosA6.jpg",
                    ModeloAsociadoPropiedadId:12
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/EntreRiosA7.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/EntreRiosA7.jpg",
                    ModeloAsociadoPropiedadId:12
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/EntreRiosA8.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/EntreRiosA8.jpg",
                    ModeloAsociadoPropiedadId:12
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/EntreRiosB1.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/EntreRiosB1.jpg",
                    ModeloAsociadoPropiedadId:13
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/EntreRiosB2.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/EntreRiosB2.jpg",
                    ModeloAsociadoPropiedadId:13
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/EntreRiosB3.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/EntreRiosB3.jpg",
                    ModeloAsociadoPropiedadId:13
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/EntreRiosB4.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/EntreRiosB4.jpg",
                    ModeloAsociadoPropiedadId:13
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/EntreRiosB5.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/EntreRiosB5.jpg",
                    ModeloAsociadoPropiedadId:13
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/EntreRiosB6.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/EntreRiosB6.jpg",
                    ModeloAsociadoPropiedadId:13
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/EntreRiosC1.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/EntreRiosC1.jpg",
                    ModeloAsociadoPropiedadId:14
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/EntreRiosC2.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/EntreRiosC2.jpg",
                    ModeloAsociadoPropiedadId:14
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/EntreRiosC3.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/EntreRiosC3.jpg",
                    ModeloAsociadoPropiedadId:14
                },
                
                //India
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTajA1.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTajA1.jpg",
                    ModeloAsociadoPropiedadId:15
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTajA2.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTajA2.jpg",
                    ModeloAsociadoPropiedadId:15
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTajA3.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTajA3.jpg",
                    ModeloAsociadoPropiedadId:15
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTajA4.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTajA4.jpg",
                    ModeloAsociadoPropiedadId:15
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTajA5.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTajA5.jpg",
                    ModeloAsociadoPropiedadId:15
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTajA6.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTajA6.jpg",
                    ModeloAsociadoPropiedadId:15
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTajA7.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTajA7.jpg",
                    ModeloAsociadoPropiedadId:15
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTajA8.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTajA8.jpg",
                    ModeloAsociadoPropiedadId:15
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTajA9.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTajA9.jpg",
                    ModeloAsociadoPropiedadId:15
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTajB1.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTajB1.jpg",
                    ModeloAsociadoPropiedadId:16
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTajB2.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTajB2.jpg",
                    ModeloAsociadoPropiedadId:16
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTajB3.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTajB3.jpg",
                    ModeloAsociadoPropiedadId:16
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTajB4.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTajB4.jpg",
                    ModeloAsociadoPropiedadId:16
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTajB5.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTajB5.jpg",
                    ModeloAsociadoPropiedadId:16
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTajB6.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTajB6.jpg",
                    ModeloAsociadoPropiedadId:16
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTajB7.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTajB7.jpg",
                    ModeloAsociadoPropiedadId:16
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTajB8.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTajB8.jpg",
                    ModeloAsociadoPropiedadId:16
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTajB9.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTajB9.jpg",
                    ModeloAsociadoPropiedadId:16
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTajC1.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTajC1.jpg",
                    ModeloAsociadoPropiedadId:17
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTajC2.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTajC2.jpg",
                    ModeloAsociadoPropiedadId:12
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTajC3.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTajC3.jpg",
                    ModeloAsociadoPropiedadId:12
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTajC4.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTajC4.jpg",
                    ModeloAsociadoPropiedadId:12
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTajC5.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTajC5.jpg",
                    ModeloAsociadoPropiedadId:12
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTajC6.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTajC6.jpg",
                    ModeloAsociadoPropiedadId:12
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTajC7.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTajC7.jpg",
                    ModeloAsociadoPropiedadId:12
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "https://storage.googleapis.com/dadinumco-media/ElTajC8.jpg",
                    detalles_imgGde: "https://storage.googleapis.com/dadinumco-media/ElTajC8.jpg",
                    ModeloAsociadoPropiedadId:17
                },
            ]);

            res.json(imagenModeloAsociado)
        }
        else{

            const imagenPropiedad = await ImgPropiedad.bulkCreate([
                //Lagos
                {
                    type: "image/jpeg",
                    thumbnail_img: "Lagos1.jpg",
                    detalles_imgGde: "Lagos1.jpg",
                    detalles_imgChica: "Lagos1.jpg",
                    PropiedadId:1
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "Lagos2.JPG",
                    detalles_imgGde: "Lagos2.JPG",
                    detalles_imgChica: "Lagos2.JPG",
                    PropiedadId:1
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "Lagos3.JPG",
                    detalles_imgGde: "Lagos3.JPG",
                    detalles_imgChica: "Lagos3.JPG",
                    PropiedadId:1
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "Lagos4.JPG",
                    detalles_imgGde: "Lagos4.JPG",
                    PropiedadId:1
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "Lagos5.JPG",
                    detalles_imgGde: "Lagos5.JPG",
                    PropiedadId:1
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "Lagos6.JPG",
                    detalles_imgGde: "Lagos6.JPG",
                    PropiedadId:1
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "Lagos7.jpg",
                    detalles_imgGde: "Lagos7.jpg",
                    PropiedadId:1
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "Lagos8.jpg",
                    detalles_imgGde: "Lagos8.jpg",
                    PropiedadId:1
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "Lagos9.jpg",
                    detalles_imgGde: "Lagos9.jpg",
                    PropiedadId:1
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "Lagos10.JPG",
                    detalles_imgGde: "Lagos10.JPG",
                    PropiedadId:1
                },
                //Elementos
                {
                    type: "image/jpeg",
                    thumbnail_img: "Elementos1.jpg",
                    detalles_imgGde: "Elementos1.jpg",
                    detalles_imgChica: "Elementos1.jpg",
                    PropiedadId:2
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "Elementos2.jpg",
                    detalles_imgGde: "Elementos2.jpg",
                    detalles_imgChica: "Elementos2.jpg",
                    PropiedadId:2
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "Elementos3.jpg",
                    detalles_imgGde: "Elementos3.jpg",
                    detalles_imgChica: "Elementos3.jpg",
                    PropiedadId:2
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "Elementos4.jpg",
                    detalles_imgGde: "Elementos4.jpg",
                    PropiedadId:2
                },
                //Oceano
                {
                    type: "image/jpeg",
                    thumbnail_img: "Oceano1.jpg",
                    detalles_imgGde: "Oceano1.jpg",
                    detalles_imgChica: "Oceano1.jpg",
                    PropiedadId:3
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "Oceano2.JPG",
                    detalles_imgGde: "Oceano2.JPG",
                    detalles_imgChica: "Oceano2.JPG",
                    PropiedadId:3
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "Oceano3.JPG",
                    detalles_imgGde: "Oceano3.JPG",
                    detalles_imgChica: "Oceano3.JPG",
                    PropiedadId:3
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "Oceano4.JPG",
                    detalles_imgGde: "Oceano4.JPG",
                    PropiedadId:3
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "Oceano5.JPG",
                    detalles_imgGde: "Oceano5.JPG",
                    PropiedadId:3
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "Oceano6.JPG",
                    detalles_imgGde: "Oceano6.JPG",
                    PropiedadId:3
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "Oceano7.JPG",
                    detalles_imgGde: "Oceano7.JPG",
                    PropiedadId:3
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "Oceano8.JPG",
                    detalles_imgGde: "Oceano8.JPG",
                    PropiedadId:3
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "Oceano9.jpg",
                    detalles_imgGde: "Oceano9.jpg",
                    PropiedadId:3
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "Oceano10.jpg",
                    detalles_imgGde: "Oceano10.jpg",
                    PropiedadId:3
                },
                //Sierra
                {
                    type: "image/jpeg",
                    thumbnail_img: "Sierra1.jpg",
                    detalles_imgGde: "Sierra1.jpg",
                    detalles_imgChica: "Sierra1.jpg",
                    PropiedadId:4
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "Sierra2.jpg",
                    detalles_imgGde: "Sierra2.jpg",
                    detalles_imgChica: "Sierra2.jpg",
                    PropiedadId:4
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "Sierra3.jpg",
                    detalles_imgGde: "Sierra3.jpg",
                    detalles_imgChica: "Sierra3.jpg",
                    PropiedadId:4
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "Sierra4.JPG",
                    detalles_imgGde: "Sierra4.JPG",
                    PropiedadId:4
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "Sierra5.jpg",
                    detalles_imgGde: "Sierra5.jpg",
                    PropiedadId:4
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "Sierra6.jpg",
                    detalles_imgGde: "Sierra6.jpg",
                    PropiedadId:4
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "Sierra7.jpg",
                    detalles_imgGde: "Sierra7.jpg",
                    PropiedadId:4
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "Sierra8.jpg",
                    detalles_imgGde: "Sierra8.jpg",
                    PropiedadId:4
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "Sierra9.jpg",
                    detalles_imgGde: "Sierra9.jpg",
                    PropiedadId:4
                },
                
                //Entre Rios
                {
                    type: "image/jpeg",
                    thumbnail_img: "EntreRios1.jpg",
                    detalles_imgGde: "EntreRios1.jpg",
                    detalles_imgChica: "EntreRios1.jpg",
                    PropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "EntreRios2.jpg",
                    detalles_imgGde: "EntreRios2.jpg",
                    detalles_imgChica: "EntreRios2.jpg",
                    PropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "EntreRios3.jpg",
                    detalles_imgGde: "EntreRios3.jpg",
                    detalles_imgChica: "EntreRios3.jpg",
                    PropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "EntreRios4.jpg",
                    detalles_imgGde: "EntreRios4.jpg",
                    PropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "EntreRios5.jpg",
                    detalles_imgGde: "EntreRios5.jpg",
                    PropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "EntreRios6.jpg",
                    detalles_imgGde: "EntreRios6.jpg",
                    PropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "EntreRios7.jpg",
                    detalles_imgGde: "EntreRios7.jpg",
                    PropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "EntreRios8.jpg",
                    detalles_imgGde: "EntreRios8.jpg",
                    PropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "EntreRios9.jpg",
                    detalles_imgGde: "EntreRios9.jpg",
                    PropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "EntreRios10.jpg",
                    detalles_imgGde: "EntreRios10.jpg",
                    PropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "EntreRios11.jpg",
                    detalles_imgGde: "EntreRios11.jpg",
                    PropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "EntreRios12.jpg",
                    detalles_imgGde: "EntreRios12.jpg",
                    PropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "EntreRios13.jpg",
                    detalles_imgGde: "EntreRios13.jpg",
                    PropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "EntreRios14.jpg",
                    detalles_imgGde: "EntreRios14.jpg",
                    PropiedadId:5
                },
                //India
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTaj0.jpg",
                    detalles_imgGde: "ElTaj0.jpg",
                    detalles_imgChica: "ElTaj0.jpg",
                    PropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTaj1.jpg",
                    detalles_imgGde: "ElTaj1.jpg",
                    detalles_imgChica: "ElTaj1.jpg",
                    PropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTaj2.jpg",
                    detalles_imgGde: "ElTaj2.jpg",
                    detalles_imgChica: "ElTaj2.jpg",
                    PropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTaj3.jpg",
                    detalles_imgGde: "ElTaj3.jpg",
                    PropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTaj4.jpg",
                    detalles_imgGde: "ElTaj4.jpg",
                    PropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTaj5.jpg",
                    detalles_imgGde: "ElTaj5.jpg",
                    PropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTaj6.jpg",
                    detalles_imgGde: "ElTaj6.jpg",
                    PropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTaj7.jpg",
                    detalles_imgGde: "ElTaj7.jpg",
                    PropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTaj8.jpg",
                    detalles_imgGde: "ElTaj8.jpg",
                    PropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTaj9.jpg",
                    detalles_imgGde: "ElTaj9.jpg",
                    PropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTaj10.jpg",
                    detalles_imgGde: "ElTaj10.jpg",
                    PropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTaj11.jpg",
                    detalles_imgGde: "ElTaj11.jpg",
                    PropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTaj12.jpg",
                    detalles_imgGde: "ElTaj12.jpg",
                    PropiedadId:6
                },
                
            ]);
    
            const imagenModeloAsociado = await ImgModeloAsociado.bulkCreate([
                //Lago
                {
                    type: "image/jpeg",
                    thumbnail_img: "LagoA1.jpg",
                    detalles_imgGde: "LagoA1.jpg",
                    ModeloAsociadoPropiedadId:1
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "LagoA2.JPG",
                    detalles_imgGde: "LagoA2.JPG",
                    ModeloAsociadoPropiedadId:1
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "LagoA3.JPG",
                    detalles_imgGde: "LagoA3.JPG",
                    ModeloAsociadoPropiedadId:1
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "LagoB1.jpg",
                    detalles_imgGde: "LagoB1.jpg",
                    ModeloAsociadoPropiedadId:2
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "LagoB2.JPG",
                    detalles_imgGde: "LagoB2.JPG",
                    ModeloAsociadoPropiedadId:2
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "LagoB3.JPG",
                    detalles_imgGde: "LagoB3.JPG",
                    ModeloAsociadoPropiedadId:2
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "LagoB4.JPG",
                    detalles_imgGde: "LagoB4.JPG",
                    ModeloAsociadoPropiedadId:2
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "LagoC1.jpg",
                    detalles_imgGde: "LagoC1.jpg",
                    ModeloAsociadoPropiedadId:3
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "LagoC2.JPG",
                    detalles_imgGde: "LagoC2.JPG",
                    ModeloAsociadoPropiedadId:3
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "LagoC3.JPG",
                    detalles_imgGde: "LagoC3.JPG",
                    ModeloAsociadoPropiedadId:3
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "LagoD.JPG",
                    detalles_imgGde: "LagoD.JPG",
                    ModeloAsociadoPropiedadId:4
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "LagoD2.JPG",
                    detalles_imgGde: "LagoD2.JPG",
                    ModeloAsociadoPropiedadId:4
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "LagoD3.JPG",
                    detalles_imgGde: "LagoD3.JPG",
                    ModeloAsociadoPropiedadId:4
                },
                //Elementos
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElementoA1.jpg",
                    detalles_imgGde: "ElementoA1.jpg",
                    ModeloAsociadoPropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElementoA2.jpg",
                    detalles_imgGde: "ElementoA2.jpg",
                    ModeloAsociadoPropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElementoA3.jpg",
                    detalles_imgGde: "ElementoA3.jpg",
                    ModeloAsociadoPropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElementoA4.jpg",
                    detalles_imgGde: "ElementoA4.jpg",
                    ModeloAsociadoPropiedadId:5
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElementoB1.jpg",
                    detalles_imgGde: "ElementoB1.jpg",
                    ModeloAsociadoPropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElementoB2.jpg",
                    detalles_imgGde: "ElementoB2.jpg",
                    ModeloAsociadoPropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElementoB3.jpg",
                    detalles_imgGde: "ElementoB3.jpg",
                    ModeloAsociadoPropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElementoB4.jpg",
                    detalles_imgGde: "ElementoB4.jpg",
                    ModeloAsociadoPropiedadId:6
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElementoC1.jpg",
                    detalles_imgGde: "ElementoC1.jpg",
                    ModeloAsociadoPropiedadId:7
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElementoC2.jpg",
                    detalles_imgGde: "ElementoC2.jpg",
                    ModeloAsociadoPropiedadId:7
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElementoC3.jpg",
                    detalles_imgGde: "ElementoC3.jpg",
                    ModeloAsociadoPropiedadId:7
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElementoC4.jpg",
                    detalles_imgGde: "ElementoC4.jpg",
                    ModeloAsociadoPropiedadId:7
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElementoC5.jpg",
                    detalles_imgGde: "ElementoC5.jpg",
                    ModeloAsociadoPropiedadId:7
                },
                //Oceano
                {
                    type: "image/jpeg",
                    thumbnail_img: "OceanoA1.jpg",
                    detalles_imgGde: "OceanoA1.jpg",
                    ModeloAsociadoPropiedadId:8
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "OceanoA2.jpg",
                    detalles_imgGde: "OceanoA2.jpg",
                    ModeloAsociadoPropiedadId:8
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "OceanoA3.jpg",
                    detalles_imgGde: "OceanoA3.jpg",
                    ModeloAsociadoPropiedadId:8
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "OceanoA4.jpg",
                    detalles_imgGde: "OceanoA4.jpg",
                    ModeloAsociadoPropiedadId:8
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "OceanoB1.jpg",
                    detalles_imgGde: "OceanoB1.jpg",
                    ModeloAsociadoPropiedadId:9
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "OceanoB2.jpg",
                    detalles_imgGde: "OceanoB2.jpg",
                    ModeloAsociadoPropiedadId:9
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "OceanoB3.jpg",
                    detalles_imgGde: "OceanoB3.jpg",
                    ModeloAsociadoPropiedadId:9
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "OceanoB4.jpg",
                    detalles_imgGde: "OceanoB4.jpg",
                    ModeloAsociadoPropiedadId:9
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "OceanoB5.jpg",
                    detalles_imgGde: "OceanoB5.jpg",
                    ModeloAsociadoPropiedadId:9
                },
                 //Sierra
                {
                    type: "image/jpeg",
                    thumbnail_img: "SierraA1.JPG",
                    detalles_imgGde: "SierraA1.JPG",
                    ModeloAsociadoPropiedadId:10
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "SierraA2.JPG",
                    detalles_imgGde: "SierraA2.JPG",
                    ModeloAsociadoPropiedadId:10
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "SierraA3.JPG",
                    detalles_imgGde: "SierraA3.JPG",
                    ModeloAsociadoPropiedadId:10
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "SierraA4.JPG",
                    detalles_imgGde: "SierraA4.JPG",
                    ModeloAsociadoPropiedadId:10
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "SierraA5.JPG",
                    detalles_imgGde: "SierraA5.JPG",
                    ModeloAsociadoPropiedadId:10
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "SierraA6.JPG",
                    detalles_imgGde: "SierraA6.JPG",
                    ModeloAsociadoPropiedadId:10
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "SierraA7.JPG",
                    detalles_imgGde: "SierraA7.JPG",
                    ModeloAsociadoPropiedadId:10
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "SierraA8.JPG",
                    detalles_imgGde: "SierraA8.JPG",
                    ModeloAsociadoPropiedadId:10
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "SierraA9.JPG",
                    detalles_imgGde: "SierraA9.JPG",
                    ModeloAsociadoPropiedadId:10
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "SierraB1.JPG",
                    detalles_imgGde: "SierraB1.JPG",
                    ModeloAsociadoPropiedadId:11
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "SierraB2.JPG",
                    detalles_imgGde: "SierraB2.JPG",
                    ModeloAsociadoPropiedadId:11
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "SierraB3.JPG",
                    detalles_imgGde: "SierraB3.JPG",
                    ModeloAsociadoPropiedadId:11
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "SierraB4.JPG",
                    detalles_imgGde: "SierraB4.JPG",
                    ModeloAsociadoPropiedadId:11
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "SierraB5.JPG",
                    detalles_imgGde: "SierraB5.JPG",
                    ModeloAsociadoPropiedadId:11
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "SierraB6.JPG",
                    detalles_imgGde: "SierraB6.JPG",
                    ModeloAsociadoPropiedadId:11
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "SierraB7.JPG",
                    detalles_imgGde: "SierraB7.JPG",
                    ModeloAsociadoPropiedadId:11
                },
                
                //Entre Rios
                {
                    type: "image/jpeg",
                    thumbnail_img: "EntreRiosA1.jpg",
                    detalles_imgGde: "EntreRiosA1.jpg",
                    ModeloAsociadoPropiedadId:12
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "EntreRiosA2.jpg",
                    detalles_imgGde: "EntreRiosA2.jpg",
                    ModeloAsociadoPropiedadId:12
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "EntreRiosA3.jpg",
                    detalles_imgGde: "EntreRiosA3.jpg",
                    ModeloAsociadoPropiedadId:12
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "EntreRiosA4.jpg",
                    detalles_imgGde: "EntreRiosA4.jpg",
                    ModeloAsociadoPropiedadId:12
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "EntreRiosA5.jpg",
                    detalles_imgGde: "EntreRiosA5.jpg",
                    ModeloAsociadoPropiedadId:12
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "EntreRiosA6.jpg",
                    detalles_imgGde: "EntreRiosA6.jpg",
                    ModeloAsociadoPropiedadId:12
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "EntreRiosA7.jpg",
                    detalles_imgGde: "EntreRiosA7.jpg",
                    ModeloAsociadoPropiedadId:12
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "EntreRiosA8.jpg",
                    detalles_imgGde: "EntreRiosA8.jpg",
                    ModeloAsociadoPropiedadId:12
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "EntreRiosB1.jpg",
                    detalles_imgGde: "EntreRiosB1.jpg",
                    ModeloAsociadoPropiedadId:13
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "EntreRiosB2.jpg",
                    detalles_imgGde: "EntreRiosB2.jpg",
                    ModeloAsociadoPropiedadId:13
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "EntreRiosB3.jpg",
                    detalles_imgGde: "EntreRiosB3.jpg",
                    ModeloAsociadoPropiedadId:13
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "EntreRiosB4.jpg",
                    detalles_imgGde: "EntreRiosB4.jpg",
                    ModeloAsociadoPropiedadId:13
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "EntreRiosB5.jpg",
                    detalles_imgGde: "EntreRiosB5.jpg",
                    ModeloAsociadoPropiedadId:13
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "EntreRiosB6.jpg",
                    detalles_imgGde: "EntreRiosB6.jpg",
                    ModeloAsociadoPropiedadId:13
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "EntreRiosC1.jpg",
                    detalles_imgGde: "EntreRiosC1.jpg",
                    ModeloAsociadoPropiedadId:14
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "EntreRiosC2.jpg",
                    detalles_imgGde: "EntreRiosC2.jpg",
                    ModeloAsociadoPropiedadId:14
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "EntreRiosC3.jpg",
                    detalles_imgGde: "EntreRiosC3.jpg",
                    ModeloAsociadoPropiedadId:14
                },
                
                //India
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTajA1.jpg",
                    detalles_imgGde: "ElTajA1.jpg",
                    ModeloAsociadoPropiedadId:15
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTajA2.jpg",
                    detalles_imgGde: "ElTajA2.jpg",
                    ModeloAsociadoPropiedadId:15
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTajA3.jpg",
                    detalles_imgGde: "ElTajA3.jpg",
                    ModeloAsociadoPropiedadId:15
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTajA4.jpg",
                    detalles_imgGde: "ElTajA4.jpg",
                    ModeloAsociadoPropiedadId:15
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTajA5.jpg",
                    detalles_imgGde: "ElTajA5.jpg",
                    ModeloAsociadoPropiedadId:15
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTajA6.jpg",
                    detalles_imgGde: "ElTajA6.jpg",
                    ModeloAsociadoPropiedadId:15
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTajA7.jpg",
                    detalles_imgGde: "ElTajA7.jpg",
                    ModeloAsociadoPropiedadId:15
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTajA8.jpg",
                    detalles_imgGde: "ElTajA8.jpg",
                    ModeloAsociadoPropiedadId:15
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTajA9.jpg",
                    detalles_imgGde: "ElTajA9.jpg",
                    ModeloAsociadoPropiedadId:15
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTajB1.jpg",
                    detalles_imgGde: "ElTajB1.jpg",
                    ModeloAsociadoPropiedadId:16
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTajB2.jpg",
                    detalles_imgGde: "ElTajB2.jpg",
                    ModeloAsociadoPropiedadId:16
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTajB3.jpg",
                    detalles_imgGde: "ElTajB3.jpg",
                    ModeloAsociadoPropiedadId:16
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTajB4.jpg",
                    detalles_imgGde: "ElTajB4.jpg",
                    ModeloAsociadoPropiedadId:16
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTajB5.jpg",
                    detalles_imgGde: "ElTajB5.jpg",
                    ModeloAsociadoPropiedadId:16
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTajB6.jpg",
                    detalles_imgGde: "ElTajB6.jpg",
                    ModeloAsociadoPropiedadId:16
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTajB7.jpg",
                    detalles_imgGde: "ElTajB7.jpg",
                    ModeloAsociadoPropiedadId:16
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTajB8.jpg",
                    detalles_imgGde: "ElTajB8.jpg",
                    ModeloAsociadoPropiedadId:16
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTajB9.jpg",
                    detalles_imgGde: "ElTajB9.jpg",
                    ModeloAsociadoPropiedadId:16
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTajC1.jpg",
                    detalles_imgGde: "ElTajC1.jpg",
                    ModeloAsociadoPropiedadId:17
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTajC2.jpg",
                    detalles_imgGde: "ElTajC2.jpg",
                    ModeloAsociadoPropiedadId:12
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTajC3.jpg",
                    detalles_imgGde: "ElTajC3.jpg",
                    ModeloAsociadoPropiedadId:12
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTajC4.jpg",
                    detalles_imgGde: "ElTajC4.jpg",
                    ModeloAsociadoPropiedadId:12
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTajC5.jpg",
                    detalles_imgGde: "ElTajC5.jpg",
                    ModeloAsociadoPropiedadId:12
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTajC6.jpg",
                    detalles_imgGde: "ElTajC6.jpg",
                    ModeloAsociadoPropiedadId:12
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTajC7.jpg",
                    detalles_imgGde: "ElTajC7.jpg",
                    ModeloAsociadoPropiedadId:12
                },
                {
                    type: "image/jpeg",
                    thumbnail_img: "ElTajC8.jpg",
                    detalles_imgGde: "ElTajC8.jpg",
                    ModeloAsociadoPropiedadId:17
                },
            ]);

            res.json(imagenModeloAsociado)  
        }

            

    } catch (e) {
        res.send(e);
    }
})

module.exports =  server;