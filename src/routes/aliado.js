const server = require("express").Router();
const { db, Aliado, TipodeUsuario, AsignaciondePropiedad, UltimoContacto, Cliente, PropiedadIndependiente, Colonia, Ciudad, Estado } = require("../db");
const { Op, Sequelize } = require("sequelize");
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
    console.log("Buscando Aliado X UserId",aliado)
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
      where:{email},
      attributes: ['id', 'userId', 'nombre',  'email', 'telefono']
    });
    console.log(aliado.nombre)

    aliado? res.status(200).json(aliado) : res.status(400).json({mensaje:"El Aliado No Existe"});
  } catch (error) {
    res.send(error);
  }
});

server.get("/buscarAliadoxPropId/:propiedadId", async (req, res) => {
  try {
    let {propiedadId} = req.params;
    const aliado = await AsignaciondePropiedad.findOne({
      where:{propiedadId:propiedadId},
    });

    aliado? res.status(200).json(aliado) : res.status(400).json({mensaje:"Esta propiedad no tiene Aliado Asignado"});
  } catch (error) {
    res.send(error);
  }
})

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

// Autoriza Aliados por mi usuario y asigno colonias autorizadas (Las colonias donde dara servicio)
server.post("/autorizarAliados", async (req, res) => { 
  try {
    console.log("Autorizando Aliados");
    const aliados = req.body;
    console.log(aliados);

    const userId_Autorizacion = aliados.aliadoPrincipal.userId;
    const email_Autorizacion = aliados.aliadoPrincipal.email;
    
    const aliadoPrincipal = await Cliente.findOne({
      where: {
        [Op.and]: {
          userId: userId_Autorizacion,
          email: email_Autorizacion
        }
      }
    });
    
    if(aliadoPrincipal && aliadoPrincipal.id === "b6ac3295-3742-496e-905f-e7a826e42028") {
      const userTipo = await TipodeUsuario.findOne({
        where: { tipo: "AgentedeDesarrollo" }   
      });
  
      const aliadosAutorizados = await Promise.all(aliados?.aliados?.map(async aliado => { 
        
        // Iniciar una transacción para este aliado
        const transaction = await db.transaction();
        
        try {
          console.log("Procesando aliado:", aliado.email);
          
          // 1. Crear o encontrar el aliado
          let aliadoCreado, created;
          try {
            const result = await Aliado.findOrCreate({
              where: { email: aliado.email },
              defaults: {          
                tipodeAliado: aliado.tipodeAliado,
                autorizaciondePublicar: aliado.autorizaciondePublicar,
                TipodeUsuarioId: userTipo.id,
                CiudadId: aliado.ciudadId
              },
              include: [
                {
                  model: Colonia,
                  through: { attributes: [] } // No necesitamos los atributos de la tabla de unión
                }
              ],
              transaction: transaction
            });
            [aliadoCreado, created] = result;
          } catch (error) {
            console.error("Error en findOrCreate:", error);
            throw error;
          }

          // 2. Si el aliado ya existía, actualizarlo
          if (!created) {
            console.log("Actualizando aliado:", aliado.email, "en Ciudad " + aliado.ciudadId);
            await aliadoCreado.update({
              tipodeAliado: aliado.tipodeAliado,
              autorizaciondePublicar: aliado.autorizaciondePublicar,
              TipodeUsuarioId: userTipo.id,
              CiudadId: aliado.ciudadId
            }, { transaction: transaction });
          }
          console.log("Procesando colonias:", aliado.colonias, "Array Colonias", aliado.colonias.length) ;  
          // 3. Manejo de Colonias (para nuevos y existentes)
          if (aliado.colonias && aliado.colonias.length > 0) {
            console.log(`\n===== GESTIONANDO COLONIAS PARA ${aliadoCreado.id} =====`);

            // Paso A: Eliminar todas las asociaciones existentes para empezar de cero.
            console.log('[DEBUG] Eliminando asociaciones de colonias existentes...');
            await db.models.colonias_por_aliado.destroy({
              where: { AliadoId: aliadoCreado.id },
              transaction: transaction
            });
            console.log('[DEBUG] Asociaciones anteriores eliminadas.');

            // Paso B: Crear las nuevas asociaciones a partir de la lista única.
            const coloniasUnicas = [...new Set(aliado.colonias.map(Number))];
            console.log(`[DEBUG] Creando ${coloniasUnicas.length} nuevas asociaciones...`);
            const coloniasParaAsociar = coloniasUnicas.map(id => ({
              AliadoId: aliadoCreado.id,
              ColoniumId: id
            }));
            
            await db.models.colonias_por_aliado.bulkCreate(coloniasParaAsociar, { transaction });
            console.log('[INFO] Nuevas asociaciones de colonias creadas exitosamente.');
          }
  
          // 4. Enviar correo
          const correoEnviado = await enviarCorreo(aliado.email, aliadoPrincipal.nombre);
          // Hacer commit de la transacción
          await transaction.commit();
          // Devolver las colonias que acabamos de asociar
          return { 
            email: aliado.email, 
            correoEnviado: true, 
            aliadoId: aliadoCreado.id, 
            coloniasAsociadas: aliado.colonias // Usar las colonias del input ya que son las mismas que acabamos de asociar
          };
        } catch (error) {
          // Si algo falla, hacer rollback de la transacción
          await transaction.rollback();
          console.error("Error en transacción:", error);
          throw error;
        }
      }));
  
      res.status(201).json({ 
        codigo: 1,
        mensaje: "Aliados autorizados exitosamente",
        aliados: aliadosAutorizados 
      });        
    } else { 
      res.status(401).json({ 
        codigo: 0,
        mensaje: "No estás autorizado para realizar esta acción"
      });
    }    
  } catch (error) {
    console.error("Error en autorizarAliados:", error);
    res.status(500).json({ 
      codigo: 0,
      mensaje: "Error al autorizar aliados",
      error: error.message 
    });
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

server.post("/actualizarAsignacion", async (req, res) => {
  try {
    console.log("Actualizando asignación");
    
    const { id, aliadoId, clienteId, propiedadId, tipoDeAutorizacion, clientePrincipal, rolDelAliado } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: "Se requiere el ID de la asignación para actualizar" });
    }
    
    const [updatedCount] = await AsignaciondePropiedad.update(
      {
        aliadoId, 
        clienteId,
        propiedadId,
        tipoDeAutorizacion,
        clientePrincipal,
        rolDelAliado
      },
      {
        where: { id }
      }
    );
    
    if (updatedCount === 0) {
      return res.status(404).json({ error: "Asignación no encontrada" });
    }
    
    res.status(201).json({ success: true, updated: updatedCount });
  } catch (error) {
    console.error("Error al actualizar asignación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

server.get("/getPropiedadesAsignadas/:userId", async (req,res) => {
  try {
    const { userId } = req.params;
    const aliado = await Aliado.findOne({
      where:{userId}
    });
    if(!aliado){
      console.log("El Aliado No Existe")
      return res.status(404).json({ Mensaje: "El Aliado No Existe" });
    }

    console.log("Buscando propiedades asignadas para "+aliado.id)
    
    const propiedadAsignada = await AsignaciondePropiedad.findAll({
      where:{aliadoId:aliado.id},
      include:[
        {
        model:PropiedadIndependiente,
        attributes: [ 'numeroPropiedad', 'calle', 'precio'],
        include:[
          {
            model:Colonia,
            attributes: [ 'colonia']
          },
          {
            model:Ciudad,
            attributes: [ 'ciudad']
          },
          {
            model:Estado,
            attributes: [ 'estado']
          },
        ],
        },
        {
          model:Cliente,
          attributes: [ 'nombre', 'email']
        },
      ]
    })
    
    propiedadAsignada? res.status(200).json(propiedadAsignada) : res.status(404).json({Mensaje:"No se encontraron propiedades asignadas"})
  } catch (error) {
    res.status(500).json(error)
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