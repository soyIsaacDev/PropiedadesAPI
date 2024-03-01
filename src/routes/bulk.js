const server = require("express").Router();
const { Propiedad, Estado, Municipio, Ciudad, Colonia, AmenidadesPropiedad, AmenidadesDesarrollo,
    TipodePropiedad, ImgPropiedad, ModeloAsociadoPropiedad, ImgModeloAsociado } = require("../db");


server.get("/bulk", async (req,res)=> {
    try {
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
            {colonia:"Centro"},
            {colonia:"Villa Satelite"},
            {colonia:"Modelo"},
            {colonia:"La Jolla"},
            {colonia:"Modelo"},
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
        
        const AmenidadPropiedadCreada = await AmenidadesPropiedad.bulkCreate([
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
            {tipoPropiedad:"Departamento"},
            {tipoPropiedad:"Casa"},
            {tipoPropiedad:"Loft"},
        );
        
        const Desarrollo = await Propiedad.bulkCreate([
            {
                nombreDesarrollo:"Alta Monaco",
                EstadoId:1,
                MunicipioId: 1,
                CiudadId:1,
                ColoniumId:1,
                añodeConstruccion:2024,
                calle:"Olivares",
                numeroPropiedad:120,
                numeroInterior,
                posicion:{lat: 29.084588110911056, lng: -110.9905877674592}
            },
            {
                nombreDesarrollo,
                EstadoId:1,
                MunicipioId: 1,
                CiudadId:1,
                ColoniumId:colonia,
                añodeConstruccion,
                calle,
                numeroPropiedad,
                numeroInterior,
                posicion
            },
            {
                nombreDesarrollo,
                EstadoId:1,
                MunicipioId: 1,
                CiudadId:1,
                ColoniumId:colonia,
                añodeConstruccion,
                calle,
                numeroPropiedad,
                numeroInterior,
                posicion
            },
            {
                nombreDesarrollo,
                EstadoId:1,
                MunicipioId: 1,
                CiudadId:1,
                ColoniumId:colonia,
                añodeConstruccion,
                calle,
                numeroPropiedad,
                numeroInterior,
                posicion
            },
        
          ]);
        res.json(Desarrollo);
    } catch (e) {
        res.send(e);
    }
})

module.exports =  server;