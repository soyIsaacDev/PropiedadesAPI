const server = require("express").Router();
var nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const { Cliente, TipodeUsuario, Organizacion, AutorizacionesXTipodeOrg, UltimoContacto, AsignaciondePropiedad, PropiedadIndependiente, Colonia, Ciudad, Estado } = require("../db");
const { Op, fn, col } = require("sequelize");

const { checkManejodeUsuarios } = require("../middleware/checkAutorizacion");

server.post("/nuevoCliente", async (req, res) => { 
  try {
    const { userId, nombre, email, telefono, sexo, dia_de_nacimiento, mes_de_nacimiento,
      año_de_nacimiento, planeacion_compra, tipoUsuario, giro, organizacion } = req.body;

    const cliente = await Cliente.findOrCreate({
        where: {
          userId
        },
        defaults: {
          nombre,
          email,
          telefono,
          sexo,
          dia_de_nacimiento,
          mes_de_nacimiento,
          año_de_nacimiento, 
          planeacion_compra,
        }      
    });

    console.log(cliente)

    if(tipoUsuario === "Desarrollador"){
      const tipodeOrganizacion = await AutorizacionesXTipodeOrg.findOne({
        where:{ nombreTipoOrg:"Desarrolladora" }
      });
      const userTipo = await TipodeUsuario.findOne({
        where: {
          tipo:"Desarrollador",
          giro,
        }   
      });
      const org = await Organizacion.create({
        organizacion:organizacion,
        AutorizacionesXTipodeOrgId:tipodeOrganizacion.id
      });
      cliente[0].OrganizacionId = org.id;
      cliente[0].TipodeUsuarioId= userTipo.id;
      cliente[0].autorizaciondePublicar = "Completa";
    }
    
    if(tipoUsuario === "DueñoTratoDirecto") {
      
      const tipodeOrganizacion = await AutorizacionesXTipodeOrg.findOne({
        where:{ nombreTipoOrg:"TratoDirecto" }
      });
      const org = await Organizacion.create({
        organizacion:email,
        AutorizacionesXTipodeOrgId:tipodeOrganizacion.id
      });
      const userTipo = await TipodeUsuario.findOne({
        where: {
          tipo:"DueñoTratoDirecto"
        }   
      });
      cliente[0].OrganizacionId = org.id;
      cliente[0].TipodeUsuarioId= userTipo.id;
      cliente[0].autorizaciondePublicar = "Completa";
    }
   
    await cliente[0].save();

    res.json(cliente);
  } catch (error) {
    res.send(error);
  }
});

server.get("/clientes", async (req,res)=> {
  try{
    const cliente = await Cliente.findAll({
      
    });
    res.json(cliente);
  }
  catch(e){
    res.send(e);
  }
});

server.get("/buscarCliente", async (req, res) => {
  try {
    console.log("EN BuscarCliente")
    let {userId, email} = req.query;
    console.log("BUscando cliente " + userId + " Email " + email)

    // Construir condiciones válidas
    const condiciones = [];
    if (userId) condiciones.push({ userId });
    if (email) condiciones.push({ email });

    if (condiciones.length === 0) {
      return res.status(400).json({ mensaje: "Debes proporcionar userId o email" });
    }

    const cliente = await Cliente.findOne({
      where: {
        [Op.or]: condiciones
      }
    });

    console.log("Cliente Encontrado " +cliente)
    cliente? res.status(200).json(cliente) : res.status(400).json({mensaje:"El Cliente No Existe"});
  } catch (error) {
    res.send(error);
  }
});


server.post("/mostrarTour", async (req, res) => {
  try {
    let {userId, mostrarTour} = req.body;
    const cliente= await Cliente.findOne({
      where:{userId}
    });
    cliente.mostrar_Tour = mostrarTour;
    cliente.save();

    res.json(cliente);
  } catch (e) {
    res.json(e);
  }
})

/* server.post("/revisarCaracteristicasUsuario", async (req, res) => {
  try {
    let {userId, email} = req.body;
    //let {email} = req.params;
    const cliente= await Cliente.findOne({
      where:{[Op.or]:{
        userId,
        email
      }},
      include: [
        { model: TipodeUsuario },
        { model: Autorizacion },
      ]
    });
    
    cliente? res.json(cliente) : res.json({mensaje:"El Cliente No Existe"});
  } catch (error) {
    res.send(error);
  }
}); */

server.get("/buscarOrg/:nombreOrg", async (req, res) => {
  try {
    let {nombreOrg} = req.params;
    const org = await Organizacion.findOne({
      where:{organizacion:nombreOrg}
    });
    console.log(org)

    org? res.json(org) : res.json({mensaje:"Confirmado: No existe esta organizacion"});
  } catch (error) {
    res.send(error);
  }
});

const gmailClientId = process.env.GMAIL_CLIENT_ID;
const gmailClientSecret = process.env.GMAIL_CLIENT_SECRET;
const gmailRedirectUrl = process.env.GMAIL_REDIRECT_URL;
const gmailRefreshToken = process.env.GMAIL_REFRESH_TOKEN;
const gmailPassword = process.env.GMAIL_PASSWORD;

server.get("/gmailCheck", async(req,res) => {
  try {
    console.log("En Revisar Gmail")
    console.log(gmailClientId)
    console.log(gmailClientSecret)
    res.json("Revision OK")
    
  } catch (error) {
    res.send(error)
  }
})

server.post("/agregarAgenteAdicional", checkManejodeUsuarios, async (req, res) => { 
  try {
    const agentes = req.body;
    const organizacionId = req.orgId;
    const agentePrincipal = req.agentePrincipal;

    const userTipo = await TipodeUsuario.findOne({
      where: { tipo: "AgentedeDesarrollo" }   
    });

    const resultados = await Promise.all(agentes.map(async agente => {   
      const cliente = await Cliente.findOrCreate({
        where: { email: agente.email },
        defaults: {          
          OrganizacionId: organizacionId,
          TipodeUsuarioId: userTipo.id,
          autorizaciondePublicar: agente.autorizaciondePublicar
        }      
      });

      const correoEnviado = await enviarCorreo(agente.email, agentePrincipal);
      return { email: agente.email, correoEnviado };
    }));

    // Todos los correos se enviaron
    res.json({ 
      codigo:1,
      mensaje: "Proceso completado",
      agentes: resultados 
    });
    
  } catch (error) {
    console.error("Error en agregarAgenteAdicional:", error);
    res.status(500).json({ error: error.message });
  }
});

const enviarCorreo = async (para, de)  => {
  try {
    const oauth2Client = new OAuth2(
      gmailClientId, // ClientID
      gmailClientSecret, // Client Secret
      gmailRedirectUrl // Redirect URL
    );
    oauth2Client.setCredentials({
      refresh_token: gmailRefreshToken
    });
    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user:'isaacborbon@gmail.com',
        pass:gmailPassword,
        clientId:gmailClientId,
        clientSecret:gmailClientSecret,
        refreshToken:gmailRefreshToken,
        accessToken:accessToken
      }
    });
    
    const mailOptions = {
      from: 'isaacborbon@gmail.com',
      to: para,
      subject: `${de} te invita a unirte a su empresa en Inmozz`,
      text: 'Unete a mi empresa en Inmozz dando click en el siguiente link http://localhost:3000/iniciarsesion. No olvides utilizar este correo electronico para registrarte'
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, function(error, info){
        transporter.close();
        if (error) {
          console.log(error);
          reject(error)
        } else {
          console.log('Email sent: ' + info.response);          
          resolve (info.response);
        }
      });

    })
  } catch (error) {
    console.error("Error en enviarCorreo:", error);
    res.json(error)
  }
}

server.get("/enviarCorreoNuevoAgente", async (req, res) => { 
  try {
    const oauth2Client = new OAuth2(
      gmailClientId, // ClientID
      gmailClientSecret, // Client Secret
      gmailRedirectUrl // Redirect URL
    );
    oauth2Client.setCredentials({
      refresh_token: gmailRefreshToken
    });
    const accessToken = oauth2Client.getAccessToken();

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user:'isaacborbon@gmail.com',
        pass:gmailPassword,
        clientId:gmailClientId,
        clientSecret:gmailClientSecret,
        refreshToken:gmailRefreshToken,
        accessToken:accessToken
      }
    });
    
    var mailOptions = {
      from: 'isaacborbon@gmail.com',
      to: 'borbonisaac@hotmail.com',
      subject: 'Sending Email using Node.js',
      text: 'Refreshtoken That was easy!'
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        transporter.close();
        res.json("Correo Enviado" + info.response)
      }
    });

  } catch (error) {
    res.send(error)
  }
  
})

server.post("/actualizarAgente", async (req, res) => {
  try {
    const { userId, nombre, email, telefono} = req.body;
    const cliente = await Cliente.findOne({
      where:{email}
    });
    await cliente.update({
      userId,
      nombre,
      telefono
    })
  } catch (error) {
    res.send(error)
  }
})

server.get("/agentesPorOrg/:OrganizacionId", async(req,res) => {
  try {
    let {OrganizacionId} = req.params;
    const cliente = await Cliente.findAll({
      where:{OrganizacionId}
    });
    res.json(cliente)
  } catch (error) {
    res.json(error)
  }
})


// Función para obtener fecha local formateada
const getFechaLocal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

server.get("/asignarAgente/:userId/:OrganizacionId", async (req, res) => {
  try {
    const { userId, OrganizacionId } = req.params;
    const agentes = await Cliente.findAll({ where: { OrganizacionId } });
    if (!agentes.length) return res.status(400).json({ error: "No hay agentes disponibles" });

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
      const agenteActual = agentes.find(a => a.id === ultimoContacto.agenteId);
      return res.json(agenteActual.telefono);
    }

    const nuevoIndex = ultimoContacto 
    ? (agentes.findIndex(a => a.id === ultimoContacto.agenteId) + 1) % agentes.length
    : 0;

    await UltimoContacto.create({
      userId,
      agenteId: agentes[nuevoIndex].id,
      dia: hoyFormateado
    });

    res.json(agentes[nuevoIndex].telefono);

    // ... (resto del código igual)
  } catch (error) {
    // ... (manejo de errores)
  }
});

server.get("/borrarCliente", async (req, res) => {
  try {
    
    const cliente = await Cliente.destroy({
      where:{
        id:"f7c32397-f4c7-425b-82f6-d2e5d731bc49"
      }
    });
    /* const orgDest = await Organizacion.destroy({
      where:{id:"64e97a09-8c0f-409a-aca4-3694f93c98df"}
    }) */

    cliente? res.json(cliente) : res.json({mensaje:"El Cliente No Existe"});
  } catch (error) {
    res.send(error);
  }
});

server.get("/clienteIsaac", async (req, res) => { 
  try {
    const cliente = await Cliente.findOne({
        where: {
          id:"b6ac3295-3742-496e-905f-e7a826e42028"
        }
    });

    //cliente.OrganizacionId = "64dfee18-5047-4363-b329-34df1ed8633b";
    cliente.TipodeUsuarioId = "d339471e-ff43-48b5-b930-644767586ce8";
    cliente.OrganizacionId ="b7b986c7-b2e9-45fa-8087-eda07c1b22ae";
    //cliente.autorizaciondePublicar = "Completa"
    await cliente.save();

    const org = await Organizacion.findOne({
      where: {
        id:"edbadc0e-1387-4291-a30e-a7ae3f260eae"
      }
    })
    org.AutorizacionesXTipodeOrgId = "41a8c882-0d85-4c91-a17a-e94c42e2248a"
    await org.save();

    res.json(cliente);
  } catch (error) {
    res.send(error);
  }
});

server.get("/getPropiedadesAsignadas/:userId", async (req,res) => {
  try {
    const { userId } = req.params;
    const cliente = await Cliente.findOne({
      where:{userId}
    });
    if(!cliente){
      console.log("El Cliente No Existe")
      return res.status(404).json({ Mensaje: "El Cliente No Existe" });
    }

    console.log("Buscando propiedades asignadas para "+cliente.id)
    
    const propiedadAsignada = await AsignaciondePropiedad.findAll({
      where:{clienteId:cliente.id},
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

module.exports = server;