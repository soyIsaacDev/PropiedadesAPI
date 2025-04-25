const server = require("express").Router();
var nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const { Cliente, TipodeUsuario, Organizacion, AutorizacionesXTipodeOrg, UltimoContacto } = require("../db");
const { Op } = require("sequelize");

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
    
    if(tipoUsuario === "DueñodePropiedad") {
      
      const tipodeOrganizacion = await AutorizacionesXTipodeOrg.findOne({
        where:{ nombreTipoOrg:"TratoDirecto" }
      });
      const org = await Organizacion.create({
        organizacion:email,
        AutorizacionesXTipodeOrgId:tipodeOrganizacion.id
      });
      const userTipo = await TipodeUsuario.findOne({
        where: {
          tipo:"DueñodePropiedad"
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

server.get("/buscarCliente/:userId", async (req, res) => {
  try {
    let {userId} = req.params;
    const cliente= await Cliente.findOne({
      where:{userId}
    });

    cliente? res.json(cliente) : res.json({mensaje:"El Cliente No Existe"});
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

server.post("/agregarAgenteAdicional", checkManejodeUsuarios, async (req, res) => { 
  try {
    const agentes = req.body; // se reciben los datos en un Array
    const organizacionId = req.orgId; // se recibe de checkManejodeUsuarios
    const agentePrincipal = req.agentePrincipal; // se recibe de checkManejodeUsuarios

    // Prep para enviar correo
    /* const oauth2Client = new OAuth2(
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
    }); */

    const userTipo = await TipodeUsuario.findOne({
      where: {
        tipo:"AgentedeDesarrollo"
      }   
    });

    for (let i = 0; i < agentes.length; i++) {   
      const cliente = await Cliente.findOrCreate({
        where: {
          email:agentes[i].email,
        },
        defaults: {          
          OrganizacionId:organizacionId,
          TipodeUsuarioId: userTipo.id,
          autorizaciondePublicar:agentes[i].autorizaciondePublicar
        }      
      });
      

      /* const clienteAut = await Autorizacion.create({ 
        niveldeAutorizacion:agentes[i].niveldeAutorizacion,
        ClienteId:cliente[0].id
      }) */

      //Enviar correo de invitacion

      /* var mailOptions = {
        from: 'isaacborbon@gmail.com',
        to: agentes[i].email,
        subject: `${agentePrincipal} te invita a unirte a su empresa`,
        text: 'Unete a mi empresa a Inmozz dando click en el siguiente link'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          transporter.close();
        }
      }); */

    }
    
    res.send(agentes);

     //}
  } catch (error) {
    res.send(error);
  }
});

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

server.get("/ultimoAgenteContactado/:userId", async(req,res) => {
  try {
    let {userId} = req.params;
    const agente = await UltimoContacto.findAll({
      where:{userId}
    });
    const hoy = new Date();
    const fechaUltimoContacto = new Date(agente.dia);
    if(fechaUltimoContacto !== hoy && agente.userId !== userId){
      res.json(agente)
    }
    else res.json("Mismo Agente")
    
  } catch (error) {
    res.json(error)
  }
})

server.get("/agregarUltimoAgenteContactado/:userId/:agenteId", async(req,res) => {
  try {
    let {userId} = req.params;
    const hoy = new Date();
    const agente = await UltimoContacto.create({
      userId,
      agenteId:"",
      dia:""
    });
    if(""){
      res.json(agente)
    }
    else res.json("Mismo Agente")
    
  } catch (error) {
    res.json(error)
  }
})

server.get("/asignarAgente/:userId/:OrganizacionId", async(req,res) =>{
  try {
    let {userId, OrganizacionId } = req.params;
    // buscando todos los agentes que pertenecen a una organizacion
    const todosLosAgentes = await Cliente.findAll({
      where:{OrganizacionId}
    });

    const agentesContactados = await UltimoContacto.findAll({
      where:{userId},
      order: [
        ['dia','DESC']
      ],
    });
    const hoy = new Date();
    let fechaUltimoContacto = null;
    const hoyString = hoy.toISOString().split('T')[0]; // "YYYY-MM-DD"
    agentesContactados.length===0? fechaUltimoContacto = hoy : fechaUltimoContacto = new Date(agentesContactados[0].dia);

    const fechaUltimoContactoString = fechaUltimoContacto.toISOString().split('T')[0];
    
    let telAgenteAsignado = undefined;
    telAgenteAsignado = todosLosAgentes[0].telefono;

    if(fechaUltimoContactoString !== hoyString && todosLosAgentes.length>1){     
      console.log("Las fechas son diferentes")
      const indiceEnArrayDeAgenteContactado = todosLosAgentes.findIndex(elemento => elemento.id === agentesContactados[0].agenteId);
      console.log(indiceEnArrayDeAgenteContactado)
      if(indiceEnArrayDeAgenteContactado < todosLosAgentes.length){
        telAgenteAsignado = todosLosAgentes[indiceEnArrayDeAgenteContactado+1].telefono;
        const agenteContactado = await UltimoContacto.create({
          userId,
          agenteId:todosLosAgentes[indiceEnArrayDeAgenteContactado+1].id,
          dia:hoy
        });
      }
    }
    else if(agentesContactados.length === 0 && fechaUltimoContactoString === hoyString && userId ) {
      const agenteContactado = await UltimoContacto.create({
        userId,
        agenteId:todosLosAgentes[0].id,
        dia:hoy
      });
    }
    res.json(telAgenteAsignado);
  } catch (error) {
    res.json(error);
  }
})

server.get("/borrarCliente", async (req, res) => {
  try {
    const cliente = await Cliente.destroy({
      where:{
        id:"7b0cb44a-c7af-4b1c-a7e4-f7b4943f1f68"
      }
    });
    const orgDest = await Organizacion.destroy({
      where:{id:"64e97a09-8c0f-409a-aca4-3694f93c98df"}
    })

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

module.exports = server;