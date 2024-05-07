const server = require("express").Router();
const { Propiedad, Estado, Municipio, Ciudad, Colonia, AmenidadesPropiedad, AmenidadesDesarrollo,
    TipoOperacion, TipodePropiedad, ImgPropiedad, ModeloAsociadoPropiedad, ImgModeloAsociado, 
    ColoniaCiudad, AmenidadesDesarrolloPropiedad, AmenidadesModeloAmenidad } = require("../db");


server.get("/bulk", async (req,res)=> {
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
        
        const TipodeOpCreada = await TipoOperacion.create({tipodeOperacion:"Venta"});
        
        const TipodePropCreada = await TipodePropiedad.bulkCreate(
            [
                {tipoPropiedad:"Departamento"},
                {tipoPropiedad:"Casa"},
                {tipoPropiedad:"Loft"}
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
                TipodePropiedadId:1,
                TipoOperacionId:1, 
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
                TipodePropiedadId:1,
                TipoOperacionId:1,
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
                TipodePropiedadId:1,
                TipoOperacionId:1,
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
                cocheraTechada:"No",
                m2Construccion:160,
                m2Terreno:240,
                m2Total:400,
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
                cocheraTechada:"No",
                m2Construccion:120,
                m2Terreno:100,
                m2Total:220,
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
                cocheraTechada:"No",
                m2Construccion:120,
                m2Terreno:100,
                m2Total:220,
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
                cocheraTechada:"Si",
                m2Construccion:120,
                m2Terreno:100,
                m2Total:220,
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
                cocheraTechada:"No",
                m2Construccion:160,
                m2Terreno:240,
                m2Total:400,
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
                cocheraTechada:"Si",
                m2Construccion:160,
                m2Terreno:240,
                m2Total:400,
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
                cocheraTechada:"Si",
                m2Construccion:160,
                m2Terreno:240,
                m2Total:400,
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
                cocheraTechada:"No",
                m2Construccion:160,
                m2Terreno:240,
                m2Total:400,
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
                cocheraTechada:"Si",
                m2Construccion:160,
                m2Terreno:240,
                m2Total:400,
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
                cocheraTechada:"Si",
                m2Construccion:160,
                m2Terreno:200,
                m2Total:360,
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
                cocheraTechada:"Si",
                m2Construccion:190,
                m2Terreno:240,
                m2Total:430,
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
                cocheraTechada:"No",
                m2Construccion:160,
                m2Terreno:240,
                m2Total:400,
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
                cocheraTechada:"Si",
                m2Construccion:160,
                m2Terreno:240,
                m2Total:400,
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
                cocheraTechada:"Si",
                m2Construccion:160,
                m2Terreno:240,
                m2Total:400,
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
                cocheraTechada:"Si",
                m2Construccion:300,
                m2Terreno:240,
                m2Total:540,
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
                cocheraTechada:"No",
                m2Construccion:360,
                m2Terreno:240,
                m2Total:600,
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
                cocheraTechada:"Si",
                m2Construccion:400,
                m2Terreno:300,
                m2Total:700,
                
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

        const imagenPropiedad = await ImgPropiedad.bulkCreate([
            //Lagos
            {
                type: "image/jpeg",
                img_name: "Lagos1.jpg",
                PropiedadId:1
            },
            {
                type: "image/jpeg",
                img_name: "Lagos2.jpg",
                PropiedadId:1
            },
            {
                type: "image/jpeg",
                img_name: "Lagos3.jpg",
                PropiedadId:1
            },
            {
                type: "image/jpeg",
                img_name: "Lagos4.jpg",
                PropiedadId:1
            },
            {
                type: "image/jpeg",
                img_name: "Lagos5.jpg",
                PropiedadId:1
            },
            {
                type: "image/jpeg",
                img_name: "Lagos6.jpg",
                PropiedadId:1
            },
            {
                type: "image/jpeg",
                img_name: "Lagos7.jpg",
                PropiedadId:1
            },
            {
                type: "image/jpeg",
                img_name: "Lagos8.jpg",
                PropiedadId:1
            },
            {
                type: "image/jpeg",
                img_name: "Lagos9.jpg",
                PropiedadId:1
            },
            {
                type: "image/jpeg",
                img_name: "Lagos10.jpg",
                PropiedadId:1
            },
            //Elementos
            {
                type: "image/jpeg",
                img_name: "Elementos1.jpg",
                PropiedadId:2
            },
            {
                type: "image/jpeg",
                img_name: "Elementos2.jpg",
                PropiedadId:2
            },
            {
                type: "image/jpeg",
                img_name: "Elementos3.jpg",
                PropiedadId:2
            },
            {
                type: "image/jpeg",
                img_name: "Elementos4.jpg",
                PropiedadId:2
            },
            //Oceano
            {
                type: "image/jpeg",
                img_name: "Oceano1.jpg",
                PropiedadId:3
            },
            {
                type: "image/jpeg",
                img_name: "Oceano2.jpg",
                PropiedadId:3
            },
            {
                type: "image/jpeg",
                img_name: "Oceano3.jpg",
                PropiedadId:3
            },
            {
                type: "image/jpeg",
                img_name: "Oceano4.jpg",
                PropiedadId:3
            },
            {
                type: "image/jpeg",
                img_name: "Oceano5.jpg",
                PropiedadId:3
            },
            {
                type: "image/jpeg",
                img_name: "Oceano6.jpg",
                PropiedadId:3
            },
            {
                type: "image/jpeg",
                img_name: "Oceano7.jpg",
                PropiedadId:3
            },
            {
                type: "image/jpeg",
                img_name: "Oceano8.jpg",
                PropiedadId:3
            },
            {
                type: "image/jpeg",
                img_name: "Oceano9.jpg",
                PropiedadId:3
            },
            {
                type: "image/jpeg",
                img_name: "Oceano10.jpg",
                PropiedadId:3
            },
            //Sierra
            {
                type: "image/jpeg",
                img_name: "Sierra1.jpg",
                PropiedadId:4
            },
            {
                type: "image/jpeg",
                img_name: "Sierra2.jpg",
                PropiedadId:4
            },
            {
                type: "image/jpeg",
                img_name: "Sierra3.jpg",
                PropiedadId:4
            },
            {
                type: "image/jpeg",
                img_name: "Sierra4.jpg",
                PropiedadId:4
            },
            {
                type: "image/jpeg",
                img_name: "Sierra5.jpg",
                PropiedadId:4
            },
            {
                type: "image/jpeg",
                img_name: "Sierra6.jpg",
                PropiedadId:4
            },
            {
                type: "image/jpeg",
                img_name: "Sierra7.jpg",
                PropiedadId:4
            },
            {
                type: "image/jpeg",
                img_name: "Sierra8.jpg",
                PropiedadId:4
            },
            {
                type: "image/jpeg",
                img_name: "Sierra9.jpg",
                PropiedadId:4
            },
            
            //Entre Rios
            {
                type: "image/jpeg",
                img_name: "EntreRios1.jpg",
                PropiedadId:5
            },
            {
                type: "image/jpeg",
                img_name: "EntreRios2.jpg",
                PropiedadId:5
            },
            {
                type: "image/jpeg",
                img_name: "EntreRios3.jpg",
                PropiedadId:5
            },
            {
                type: "image/jpeg",
                img_name: "EntreRios4.jpg",
                PropiedadId:5
            },
            {
                type: "image/jpeg",
                img_name: "EntreRios5.jpg",
                PropiedadId:5
            },
            {
                type: "image/jpeg",
                img_name: "EntreRios6.jpg",
                PropiedadId:5
            },
            {
                type: "image/jpeg",
                img_name: "EntreRios7.jpg",
                PropiedadId:5
            },
            {
                type: "image/jpeg",
                img_name: "EntreRios8.jpg",
                PropiedadId:5
            },
            {
                type: "image/jpeg",
                img_name: "EntreRios9.jpg",
                PropiedadId:5
            },
            {
                type: "image/jpeg",
                img_name: "EntreRios10.jpg",
                PropiedadId:5
            },
            {
                type: "image/jpeg",
                img_name: "EntreRios11.jpg",
                PropiedadId:5
            },
            {
                type: "image/jpeg",
                img_name: "EntreRios12.jpg",
                PropiedadId:5
            },
            {
                type: "image/jpeg",
                img_name: "EntreRios13.jpg",
                PropiedadId:5
            },
            {
                type: "image/jpeg",
                img_name: "EntreRios14.jpg",
                PropiedadId:5
            },
            //India
            {
                type: "image/jpeg",
                img_name: "ElTaj0.jpg",
                PropiedadId:6
            },
            {
                type: "image/jpeg",
                img_name: "ElTaj1.jpg",
                PropiedadId:6
            },
            {
                type: "image/jpeg",
                img_name: "ElTaj2.jpg",
                PropiedadId:6
            },
            {
                type: "image/jpeg",
                img_name: "ElTaj3.jpg",
                PropiedadId:6
            },
            {
                type: "image/jpeg",
                img_name: "ElTaj4.jpg",
                PropiedadId:6
            },
            {
                type: "image/jpeg",
                img_name: "ElTaj5.jpg",
                PropiedadId:6
            },
            {
                type: "image/jpeg",
                img_name: "ElTaj6.jpg",
                PropiedadId:6
            },
            {
                type: "image/jpeg",
                img_name: "ElTaj7.jpg",
                PropiedadId:6
            },
            {
                type: "image/jpeg",
                img_name: "ElTaj8.jpg",
                PropiedadId:6
            },
            {
                type: "image/jpeg",
                img_name: "ElTaj9.jpg",
                PropiedadId:6
            },
            {
                type: "image/jpeg",
                img_name: "ElTaj10.jpg",
                PropiedadId:6
            },
            {
                type: "image/jpeg",
                img_name: "ElTaj11.jpg",
                PropiedadId:6
            },
            {
                type: "image/jpeg",
                img_name: "ElTaj12.jpg",
                PropiedadId:6
            },
            
        ]);

        const imagenModeloAsociado = await ImgModeloAsociado.bulkCreate([
            //Lago
            {
                type: "image/jpeg",
                img_name: "LagoA1.jpg",
                ModeloAsociadoPropiedadId:1
            },
            {
                type: "image/jpeg",
                img_name: "LagoA2.jpg",
                ModeloAsociadoPropiedadId:1
            },
            {
                type: "image/jpeg",
                img_name: ".jpg",
                ModeloAsociadoPropiedadId:1
            },
            {
                type: "image/jpeg",
                img_name: "LagoA3.jpg",
                ModeloAsociadoPropiedadId:1
            },
            {
                type: "image/jpeg",
                img_name: "LagoB1.jpg",
                ModeloAsociadoPropiedadId:2
            },
            {
                type: "image/jpeg",
                img_name: "LagoB2.jpg",
                ModeloAsociadoPropiedadId:2
            },
            {
                type: "image/jpeg",
                img_name: "LagoB3.jpg",
                ModeloAsociadoPropiedadId:2
            },
            {
                type: "image/jpeg",
                img_name: "LagoB4.jpg",
                ModeloAsociadoPropiedadId:2
            },
            {
                type: "image/jpeg",
                img_name: "LagoC1.jpg",
                ModeloAsociadoPropiedadId:3
            },
            {
                type: "image/jpeg",
                img_name: "LagoC2.jpg",
                ModeloAsociadoPropiedadId:3
            },
            {
                type: "image/jpeg",
                img_name: "LagoC3.jpg",
                ModeloAsociadoPropiedadId:3
            },
            {
                type: "image/jpeg",
                img_name: "LagoD.jpg",
                ModeloAsociadoPropiedadId:4
            },
            {
                type: "image/jpeg",
                img_name: "LagoD2.jpg",
                ModeloAsociadoPropiedadId:4
            },
            {
                type: "image/jpeg",
                img_name: "LagoD3.jpg",
                ModeloAsociadoPropiedadId:4
            },
            //Elementos
            {
                type: "image/jpeg",
                img_name: "ElementoA1.jpg",
                ModeloAsociadoPropiedadId:5
            },
            {
                type: "image/jpeg",
                img_name: "ElementoA2.jpg",
                ModeloAsociadoPropiedadId:5
            },
            {
                type: "image/jpeg",
                img_name: "ElementoA3.jpg",
                ModeloAsociadoPropiedadId:5
            },
            {
                type: "image/jpeg",
                img_name: "ElementoA4.jpg",
                ModeloAsociadoPropiedadId:5
            },
            {
                type: "image/jpeg",
                img_name: "ElementoB1.jpg",
                ModeloAsociadoPropiedadId:6
            },
            {
                type: "image/jpeg",
                img_name: "ElementoB2.jpg",
                ModeloAsociadoPropiedadId:6
            },
            {
                type: "image/jpeg",
                img_name: "ElementoB3.jpg",
                ModeloAsociadoPropiedadId:6
            },
            {
                type: "image/jpeg",
                img_name: "ElementoB4.jpg",
                ModeloAsociadoPropiedadId:6
            },
            {
                type: "image/jpeg",
                img_name: "ElementoC1.jpg",
                ModeloAsociadoPropiedadId:7
            },
            {
                type: "image/jpeg",
                img_name: "ElementoC2.jpg",
                ModeloAsociadoPropiedadId:7
            },
            {
                type: "image/jpeg",
                img_name: "ElementoC3.jpg",
                ModeloAsociadoPropiedadId:7
            },
            {
                type: "image/jpeg",
                img_name: "ElementoC4.jpg",
                ModeloAsociadoPropiedadId:7
            },
            {
                type: "image/jpeg",
                img_name: "ElementoC5.jpg",
                ModeloAsociadoPropiedadId:7
            },
            //Oceano
            {
                type: "image/jpeg",
                img_name: "OceanoA1.jpg",
                ModeloAsociadoPropiedadId:8
            },
            {
                type: "image/jpeg",
                img_name: "OceanoA2.jpg",
                ModeloAsociadoPropiedadId:8
            },
            {
                type: "image/jpeg",
                img_name: "OceanoA3.jpg",
                ModeloAsociadoPropiedadId:8
            },
            {
                type: "image/jpeg",
                img_name: "OceanoA4.jpg",
                ModeloAsociadoPropiedadId:8
            },
            {
                type: "image/jpeg",
                img_name: "OceanoB1.jpg",
                ModeloAsociadoPropiedadId:9
            },
            {
                type: "image/jpeg",
                img_name: "OceanoB2.jpg",
                ModeloAsociadoPropiedadId:9
            },
            {
                type: "image/jpeg",
                img_name: "OceanoB3.jpg",
                ModeloAsociadoPropiedadId:9
            },
            {
                type: "image/jpeg",
                img_name: "OceanoB4.jpg",
                ModeloAsociadoPropiedadId:9
            },
            {
                type: "image/jpeg",
                img_name: "OceanoB5.jpg",
                ModeloAsociadoPropiedadId:9
            },
             //Sierra
            {
                type: "image/jpeg",
                img_name: "SierraA1.jpg",
                ModeloAsociadoPropiedadId:10
            },
            {
                type: "image/jpeg",
                img_name: "SierraA2.jpg",
                ModeloAsociadoPropiedadId:10
            },
            {
                type: "image/jpeg",
                img_name: "SierraA3.jpg",
                ModeloAsociadoPropiedadId:10
            },
            {
                type: "image/jpeg",
                img_name: "SierraA4.jpg",
                ModeloAsociadoPropiedadId:10
            },
            {
                type: "image/jpeg",
                img_name: "SierraA5.jpg",
                ModeloAsociadoPropiedadId:10
            },
            {
                type: "image/jpeg",
                img_name: "SierraA6.jpg",
                ModeloAsociadoPropiedadId:10
            },
            {
                type: "image/jpeg",
                img_name: "SierraA7.jpg",
                ModeloAsociadoPropiedadId:10
            },
            {
                type: "image/jpeg",
                img_name: "SierraA8.jpg",
                ModeloAsociadoPropiedadId:10
            },
            {
                type: "image/jpeg",
                img_name: "SierraA9.jpg",
                ModeloAsociadoPropiedadId:10
            },
            {
                type: "image/jpeg",
                img_name: "SierraB1.jpg",
                ModeloAsociadoPropiedadId:11
            },
            {
                type: "image/jpeg",
                img_name: "SierraB2.jpg",
                ModeloAsociadoPropiedadId:11
            },
            {
                type: "image/jpeg",
                img_name: "SierraB3.jpg",
                ModeloAsociadoPropiedadId:11
            },
            {
                type: "image/jpeg",
                img_name: "SierraB4.jpg",
                ModeloAsociadoPropiedadId:11
            },
            {
                type: "image/jpeg",
                img_name: "SierraB5.jpg",
                ModeloAsociadoPropiedadId:11
            },
            {
                type: "image/jpeg",
                img_name: "SierraB6.jpg",
                ModeloAsociadoPropiedadId:11
            },
            {
                type: "image/jpeg",
                img_name: "SierraB7.jpg",
                ModeloAsociadoPropiedadId:11
            },
            
            //Entre Rios
            {
                type: "image/jpeg",
                img_name: "EntreRiosA1.jpg",
                ModeloAsociadoPropiedadId:12
            },
            {
                type: "image/jpeg",
                img_name: "EntreRiosA2.jpg",
                ModeloAsociadoPropiedadId:12
            },
            {
                type: "image/jpeg",
                img_name: "EntreRiosA3.jpg",
                ModeloAsociadoPropiedadId:12
            },
            {
                type: "image/jpeg",
                img_name: "EntreRiosA4.jpg",
                ModeloAsociadoPropiedadId:12
            },
            {
                type: "image/jpeg",
                img_name: "EntreRiosA5.jpg",
                ModeloAsociadoPropiedadId:12
            },
            {
                type: "image/jpeg",
                img_name: "EntreRiosA6.jpg",
                ModeloAsociadoPropiedadId:12
            },
            {
                type: "image/jpeg",
                img_name: "EntreRiosA7.jpg",
                ModeloAsociadoPropiedadId:12
            },
            {
                type: "image/jpeg",
                img_name: "EntreRiosA8.jpg",
                ModeloAsociadoPropiedadId:12
            },
            {
                type: "image/jpeg",
                img_name: "EntreRiosB1.jpg",
                ModeloAsociadoPropiedadId:13
            },
            {
                type: "image/jpeg",
                img_name: "EntreRiosB2.jpg",
                ModeloAsociadoPropiedadId:13
            },
            {
                type: "image/jpeg",
                img_name: "EntreRiosB3.jpg",
                ModeloAsociadoPropiedadId:13
            },
            {
                type: "image/jpeg",
                img_name: "EntreRiosB4.jpg",
                ModeloAsociadoPropiedadId:13
            },
            {
                type: "image/jpeg",
                img_name: "EntreRiosB5.jpg",
                ModeloAsociadoPropiedadId:13
            },
            {
                type: "image/jpeg",
                img_name: "EntreRiosB6.jpg",
                ModeloAsociadoPropiedadId:13
            },
            {
                type: "image/jpeg",
                img_name: "EntreRiosC1.jpg",
                ModeloAsociadoPropiedadId:14
            },
            {
                type: "image/jpeg",
                img_name: "EntreRiosC2.jpg",
                ModeloAsociadoPropiedadId:14
            },
            {
                type: "image/jpeg",
                img_name: "EntreRiosC3.jpg",
                ModeloAsociadoPropiedadId:14
            },
            
            //India
            {
                type: "image/jpeg",
                img_name: "ElTajA1.jpg",
                ModeloAsociadoPropiedadId:15
            },
            {
                type: "image/jpeg",
                img_name: "ElTajA2.jpg",
                ModeloAsociadoPropiedadId:15
            },
            {
                type: "image/jpeg",
                img_name: "ElTajA3.jpg",
                ModeloAsociadoPropiedadId:15
            },
            {
                type: "image/jpeg",
                img_name: "ElTajA4.jpg",
                ModeloAsociadoPropiedadId:15
            },
            {
                type: "image/jpeg",
                img_name: "ElTajA5.jpg",
                ModeloAsociadoPropiedadId:15
            },
            {
                type: "image/jpeg",
                img_name: "ElTajA6.jpg",
                ModeloAsociadoPropiedadId:15
            },
            {
                type: "image/jpeg",
                img_name: "ElTajA7.jpg",
                ModeloAsociadoPropiedadId:15
            },
            {
                type: "image/jpeg",
                img_name: "ElTajA8.jpg",
                ModeloAsociadoPropiedadId:15
            },
            {
                type: "image/jpeg",
                img_name: "ElTajA9.jpg",
                ModeloAsociadoPropiedadId:15
            },
            {
                type: "image/jpeg",
                img_name: "ElTajB1.jpg",
                ModeloAsociadoPropiedadId:16
            },
            {
                type: "image/jpeg",
                img_name: "ElTajB2.jpg",
                ModeloAsociadoPropiedadId:16
            },
            {
                type: "image/jpeg",
                img_name: "ElTajB3.jpg",
                ModeloAsociadoPropiedadId:16
            },
            {
                type: "image/jpeg",
                img_name: "ElTajB4.jpg",
                ModeloAsociadoPropiedadId:16
            },
            {
                type: "image/jpeg",
                img_name: "ElTajB5.jpg",
                ModeloAsociadoPropiedadId:16
            },
            {
                type: "image/jpeg",
                img_name: "ElTajB6.jpg",
                ModeloAsociadoPropiedadId:16
            },
            {
                type: "image/jpeg",
                img_name: "ElTajB7.jpg",
                ModeloAsociadoPropiedadId:16
            },
            {
                type: "image/jpeg",
                img_name: "ElTajB8.jpg",
                ModeloAsociadoPropiedadId:16
            },
            {
                type: "image/jpeg",
                img_name: "ElTajB9.jpg",
                ModeloAsociadoPropiedadId:16
            },
            {
                type: "image/jpeg",
                img_name: "ElTajC1.jpg",
                ModeloAsociadoPropiedadId:17
            },
            {
                type: "image/jpeg",
                img_name: "ElTajC2.jpg",
                ModeloAsociadoPropiedadId:12
            },
            {
                type: "image/jpeg",
                img_name: "ElTajC3.jpg",
                ModeloAsociadoPropiedadId:12
            },
            {
                type: "image/jpeg",
                img_name: "ElTajC4.jpg",
                ModeloAsociadoPropiedadId:12
            },
            {
                type: "image/jpeg",
                img_name: "ElTajC5.jpg",
                ModeloAsociadoPropiedadId:12
            },
            {
                type: "image/jpeg",
                img_name: "ElTajC6.jpg",
                ModeloAsociadoPropiedadId:12
            },
            {
                type: "image/jpeg",
                img_name: "ElTajC7.jpg",
                ModeloAsociadoPropiedadId:12
            },
            {
                type: "image/jpeg",
                img_name: "ElTajC8.jpg",
                ModeloAsociadoPropiedadId:17
            },
        ]);

        res.json(imagenModeloAsociado)      

    } catch (e) {
        res.send(e);
    }
})

module.exports =  server;