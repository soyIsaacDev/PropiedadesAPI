var nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;


const gmailClientId = process.env.GMAIL_CLIENT_ID;
const gmailClientSecret = process.env.GMAIL_CLIENT_SECRET;
const gmailRedirectUrl = process.env.GMAIL_REDIRECT_URL;
const gmailRefreshToken = process.env.GMAIL_REFRESH_TOKEN;
//const gmailPassword = process.env.GMAIL_PASSWORD;


const gmailCheck = async(req,res) => {
  try {
    console.log("En Revisar Gmail")
    console.log(gmailClientId)
    console.log(gmailClientSecret)
    if(gmailClientId & gmailClientSecret){
      res.json("Revision OK")
    }
    else {
      res.json("El correo esta mal configurado")
    }    
  } catch (error) {
    res.send(error)
  }
}
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
        //pass:gmailPassword,
        clientId:gmailClientId,
        clientSecret:gmailClientSecret,
        refreshToken:gmailRefreshToken,
        accessToken:accessToken
      }
    });
    
    const mailOptions = {
      from: 'isaacborbon@gmail.com',
      to: para,
      subject: `${de} te invita a unirte a su empresa en Levinchi`,
      text: 'Unete a mi empresa en Levinchi dando click en el siguiente link http://localhost:3000/iniciarsesion. No olvides utilizar este correo electronico para registrarte'
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



module.exports = { gmailCheck, enviarCorreo };