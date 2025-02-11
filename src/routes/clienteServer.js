const server = require("express").Router();
var nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const { Cliente, TipodeUsuario, Organizacion } = require("../db");
const { Op } = require("sequelize");

const { checkManejodeUsuarios } = require("../middleware/checkAutorizacion");

server.post("/nuevoCliente", async (req, res) => { 
  try {
    const { userId, nombre, email, telefono, sexo, dia_de_nacimiento, mes_de_nacimiento,
      año_de_nacimiento, planeacion_compra, tipoUsuario, giro, organizacion} = req.body;

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

    if(tipoUsuario === "Desarrollador"){
      const userTipo = await TipodeUsuario.findOne({
        where: {
          tipo:"Desarrollador",
          giro
        }   
      });
      cliente[0].TipodeUsuarioId= userTipo.id;
      cliente[0].autorizaciondePublicar = "Completa";
    }
    
    
    if(tipoUsuario === "DueñodePropiedad") {
      const org = await Organizacion.create({organizacion:email});
      cliente[0].OrganizacionId = org.id;
      const userTipo = await TipodeUsuario.findOne({
        where: {
          tipo:"DueñodePropiedad",
          giro
        }   
      });
      cliente[0].TipodeUsuarioId= userTipo.id;
      cliente[0].autorizaciondePublicar = "Completa";
    }

    if(organizacion){      
      const org = await Organizacion.create({organizacion:organizacion});
      cliente[0].OrganizacionId = org.id;
    }

    /* const clienteAut = await Autorizacion.create({ 
      niveldeAutorizacion: "Completa",
      ClienteId:cliente[0].id,
    }) */
    
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
          autorizaciondePublicar:agentes[i].niveldeAutorizacion
        }      
      });

      /* const clienteAut = await Autorizacion.create({ 
        niveldeAutorizacion:agentes[i].niveldeAutorizacion,
        ClienteId:cliente[0].id
      }) */

      //Enviar correo de invitacion

      var mailOptions = {
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
      });

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

server.get("/borrarCliente", async (req, res) => {
  try {
    const cliente = await Cliente.destroy({
      where:{
        id:11
      }
    });

    cliente? res.json(cliente) : res.json({mensaje:"El Cliente No Existe"});
  } catch (error) {
    res.send(error);
  }
});

server.get("/clienteIsaac", async (req, res) => { 
  try {
    const cliente = await Cliente.findOne({
        where: {
          id:1
        }
    });

    cliente.OrganizacionId = "64dfee18-5047-4363-b329-34df1ed8633b";
    cliente.TipodeUsuarioId = "0fafbf3f-9505-4e92-b831-7bffe3b4b109";
    cliente.autorizaciondePublicar = "Completa"
    await cliente.save();

    res.json(cliente);
  } catch (error) {
    res.send(error);
  }
});

module.exports = server;