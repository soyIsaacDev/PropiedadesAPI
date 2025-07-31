const server = require("express").Router();
const { Aliado, TipodeUsuario, AsignaciondePropiedad, UltimoContacto, Cliente } = require("../db");
const { Op } = require("sequelize");
const { enviarCorreo } = require("../middleware/menejoCorreo");

server.post("/registrarAliado", async (req, res) => { 
  try {
    const { userId, nombre, apellidoPaterno, apellidoMaterno, email, telefono, sexo, dia_de_nacimiento, mes_de_nacimiento,
      año_de_nacimiento,  } = req.body;
    
    const [aliado] = await Aliado.update(
        {
          userId,
          nombre,
          apellidoPaterno, 
          apellidoMaterno,          
          telefono,
          sexo,
          dia_de_nacimiento,
          mes_de_nacimiento,
          año_de_nacimiento,
        },
        { 
          where: {
            email          
          }
        }      
    );

    if(aliado === 0){
      return res.status(404).json({ mensaje: "Aliado no encontrado" });
    }
    else {
      res.status(200).json({codigo:1, mensaje:"Aliado actualizado"});
    }    
  } catch (error) {
    res.status(400).send(error);
  }
});

server.get("/aliados", async (req,res)=> {
  try{
    const aliados = await Aliado.findAll({
      
    });
    res.json(aliados);
  }
  catch(e){
    res.send(e);
  }
});

server.get("/buscarAliado/:userId", async (req, res) => {
  try {
    let {userId} = req.params;
    const aliado= await Aliado.findOne({
      where:{userId}
    });

    aliado? res.status(200).json(aliado) : res.status(400).json({mensaje:"El Aliado No Existe"});
  } catch (error) {
    res.send(error);
  }
});

server.get("/buscarAliadoxEmail/:email", async (req, res) => {
  try {
    console.log("BUSCANDO ALIADO X EMAIL")
    let { email } = req.params;
    console.log(email)
    const aliado = await Aliado.findOne({
      where:{email}
    });
    console.log(aliado.tipodeAliado)

    aliado? res.status(200).json(aliado) : res.status(400).json({mensaje:"El Aliado No Existe"});
  } catch (error) {
    res.send(error);
  }
});

server.post("/mostrarTour", async (req, res) => {
  try {
    let {userId, mostrarTour} = req.body;
    const aliado = await Aliado.findOne({
      where:{userId}
    });
    aliado.mostrar_Tour = mostrarTour;
    aliado.save();

    res.json(aliado);
  } catch (e) {
    res.json(e);
  }
})

server.post("/autorizarAliados", async (req, res) => { 
  try {
    console.log("Autorizando Aliados")
    const aliados = req.body;

    console.log(aliados)

    const userId_Autorizacion = aliados.aliadoPrincipal.userId;
    const email_Autorizacion = aliados.aliadoPrincipal.email;
    const aliadoPrincipal = await Cliente.findOne({
        where:{[Op.and]:{
        userId:userId_Autorizacion,
        email:email_Autorizacion
      }},
    });
    
    // Esta autorizado a agregar Aliados si es el aliadoPrincipal id
    if(aliadoPrincipal.id  === "b6ac3295-3742-496e-905f-e7a826e42028" ){
        const userTipo = await TipodeUsuario.findOne({
          where: { tipo: "AgentedeDesarrollo" }   
        });
    
        const aliadosAutorizados = await Promise.all(aliados?.aliados?.map(async aliado => {   
          console.log(aliado)
          const aliadoCreado = await Aliado.findOrCreate({
            where: { email: aliado.email },
            defaults: {          
              tipodeAliado: aliado.tipodeAliado,
              autorizaciondePublicar: aliado.autorizaciondePublicar,
              TipodeUsuarioId: userTipo.id,
              CiudadId:1
            }      
          });
    
          const correoEnviado = await enviarCorreo(aliado.email, aliadoPrincipal.nombre);
          return { email: aliado.email, correoEnviado };
        }));
    
        // Todos los correos se enviaron
        res.status(201).json({ 
          codigo:1,
          mensaje: "Aliados autorizados exitosamente",
          aliados: aliadosAutorizados 
        });        
    }    
    else { res.status(401).json("No estas autorizado")}    
  } catch (error) {
    console.error("Error en agregarAgenteAdicional:", error);
    res.status(500).json({ error: error.message });
  }
});


server.post("/actualizarAutorizacionAliado", async (req, res) => {
  try {
    const { email, autorizaciondePublicar} = req.body;
    const aliado = await Aliado.findOne({
      where:{ email }
    });
    await aliado.update({
      autorizaciondePublicar
    })
    res.status(201).json({ 
        codigo:1,
        mensaje: "Aliados actualizado exitosamente",
        aliado:aliado
    });  
  } catch (error) {
    res.send(error)
  }
})

server.post("/asignarAliado", async (req, res) => {
    try {
        const { aliadoId, clienteId, propiedadId, tipoDeAutorizacion, clientePrincipal, rolDelAliado } = req.body;
        const propiedadAsignada = await AsignaciondePropiedad.create({
            aliadoId, 
            clienteId,
            propiedadId,
            tipoDeAutorizacion,
            clientePrincipal,
            rolDelAliado
        })
        res.json(propiedadAsignada)
    } catch (error) {
        res.send(error)
    }
})

// Función para obtener fecha local formateada
const getFechaLocal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

server.get("/asignarAliadoDeAtencion/:userId/:propiedadId", async (req, res) => {
  try {
    const { userId } = req.params;
    const aliados = await AsignaciondePropiedad.findAll({
        where: { propiedadId }
    });
    if (!aliados.length) return res.status(400).json({ error: "No hay aliados disponibles" });

    const [ultimoContacto] = await UltimoContacto.findAll({
      attributes: [
        'id', 'userId', 'agenteId', 
        [fn('to_char', col('dia'), 'YYYY-MM-DD'), 'diaFormateado']
      ],
      where: { userId },
      order: [['dia', 'DESC']],
      limit: 1,
      raw: true
    });

    const hoyFormateado = getFechaLocal(); // Usa fecha local consistente

    console.log("Último día (DB):", ultimoContacto?.diaFormateado, "| Hoy:", hoyFormateado);

    if (ultimoContacto?.diaFormateado === hoyFormateado) {
      const aliadoActual = aliados.find(a => a.id === ultimoContacto.agenteId);
      return res.json(aliadoActual.telefono);
    }

    const nuevoIndex = ultimoContacto 
    ? (aliados.findIndex(a => a.id === ultimoContacto.agenteId) + 1) % aliados.length
    : 0;

    await UltimoContacto.create({
      userId,
      agenteId: aliados[nuevoIndex].aliadoId,
      dia: hoyFormateado
    });

    res.json(aliados[nuevoIndex].telefono);
  } catch (error) {
  }
});

server.get("/borrarAliado", async (req, res) => {
  try {
    
    const aliado = await Aliado.destroy({
      where:{
        id:"f7c32397-f4c7-425b-82f6-d2e5d731bc49"
      }
    });

    aliado? res.json(aliado) : res.json({mensaje:"El Aliado No Existe"});
  } catch (error) {
    res.send(error);
  }
});

module.exports =  server;