const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const { Cliente } = require('../db');

// Scopes específicos para Google Calendar
const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events' // Solo permite manejar eventos, no la configuración del calendario
];

// Función para obtener el cliente OAuth2
const getOAuth2Client = () => {
  if (!process.env.CALENDAR_CLIENT_ID || !process.env.CALENDAR_CLIENT_SECRET) {
    throw new Error('Google OAuth credentials are not properly configured');
  }
  
  return new OAuth2(
    process.env.CALENDAR_CLIENT_ID,
    process.env.CALENDAR_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:8080/calendar/auth/callback'
  );
};

// Generar URL de autenticación
exports.getAuthUrl = (req, res) => {
  try {
    const oauth2Client = getOAuth2Client();
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent',
      include_granted_scopes: true
    });
    
    console.log('Generated auth URL:', authUrl); // Debug log
    res.json({ url: authUrl });
  } catch (error) {
    console.error('Error al generar URL de autenticación:', error);
    res.status(500).json({ 
      error: 'Error al generar URL de autenticación',
      details: error.message 
    });
  }
};

// Manejar el callback de autenticación
exports.handleCallback = async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).json({ error: 'Código de autorización no proporcionado' });
  }

  try {
    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    
    // Guardar los tokens en la sesión
    req.session.tokens = tokens;
    
    // Redirigir al frontend después de la autenticación exitosa
    const redirectUrl = process.env.FRONTEND_URL;
    console.log('Redirecting to:', redirectUrl);
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Error al obtener tokens:', error);
    res.status(500).json({ 
      error: 'Error al autenticar con Google',
      details: error.message 
    });
  }
};

// Obtener eventos del calendario
exports.getEvents = async (req, res) => {
  try {
    const { tokens } = req.session;
    
    if (!tokens) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    
    const oauth2Client = getOAuth2Client();
    oauth2Client.setCredentials(tokens);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
      fields: 'items(start, end, transparency)' // Solo se piden estos campos
    });
    const events = response.data.items || [];
    console.log(`Se encontraron ${events.length} eventos`);
    if (events.length > 0) {
      res.status(200).json(events);
    } else {
      res.status(200).json([]); // Devuelve un array vacío en lugar de un error
    }
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({ 
      error: 'Error al obtener eventos del calendario',
      details: error.message 
    });
  }
};

// Crear un nuevo evento
exports.createEvent = async (req, res) => {
  try {
    const { direccionPropiedad, clienteId, start, end, summary, description } = req.body;
    const { tokens } = req.session;
    
    if (!tokens) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const cliente  = await Cliente.findOne({
      where:{userId :clienteId}
    });
    
    const oauth2Client = getOAuth2Client();
    oauth2Client.setCredentials(tokens);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    const event = {
      summary: summary || 'Cita programada',
      description: description || `Cita con ${cliente.nombre} celular ${cliente.telefono} en ${direccionPropiedad} `,
      start: { 
        dateTime: start, 
        timeZone: 'America/Mexico_City' 
      },
      end: { 
        dateTime: end, 
        timeZone: 'America/Mexico_City' 
      },
      extendedProperties: {
        shared: {
          tipo: 'cita'
        }
      }
    };
    
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error al crear evento:', error);
    res.status(500).json({ 
      error: 'Error al crear el evento en el calendario',
      details: error.message 
    });
  }
};

// Crear una invitación de calendario
// El parametro attendees debe ser un array de objetos con email y opcionalmente name
// Ejemplo: [{email: 'usuario@ejemplo.com', name: 'Nombre Usuario'}]
exports.createInvite = async (req, res) => {
  try {
    const { direccionPropiedad, ubicacion, clienteId, start, end, summary, description, attendees } = req.body;
    const { tokens } = req.session;
    console.log(ubicacion);
    if (!tokens) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (!attendees || !Array.isArray(attendees) || attendees.length === 0) {
      return res.status(400).json({ error: 'Se requiere al menos un asistente' });
    }

    const cliente = await Cliente.findOne({
      where: { userId: clienteId }
    });
    
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    const oauth2Client = getOAuth2Client();
    oauth2Client.setCredentials(tokens);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        
    // Formatear la ubicación con coordenadas
    const formattedLocation = ubicacion && typeof ubicacion === 'object' 
      ? `${ubicacion.lat}, ${ubicacion.lng}`  // Formato para Google Maps
      : ubicacion || direccionPropiedad;      // Usar ubicación o dirección como respaldo

    const event = {
      summary: summary || 'Invitación a cita',
      description: description || `Cita con ${cliente.nombre} celular ${cliente.telefono} en ${direccionPropiedad}`,
      location: formattedLocation,
      start: { 
        dateTime: start, 
        timeZone: 'America/Mexico_City' 
      },
      end: { 
        dateTime: end, 
        timeZone: 'America/Mexico_City' 
      },
      attendees: [
        // El organizador primero (importante para las notificaciones)
        {
          email: tokens.email || process.env.CALENDAR_EMAIL || 'isaacborbon@gmail.com',
          organizer: true,
          responseStatus: 'needsAction' // Para que el organizador también reciba notificación
        },
        // Luego los invitados (filtrando al organizador si viene en la lista)
        ...attendees
          .filter(a => a.email && a.email.toLowerCase() !== (tokens.email || process.env.CALENDAR_EMAIL || 'isaacborbon@gmail.com').toLowerCase())
          .map(attendee => ({
            email: attendee.email,
            displayName: attendee.name || attendee.email.split('@')[0],
            responseStatus: 'needsAction'
        }))
      ],
      // Configuración de notificaciones
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 24 * 60 }, // 1 día antes
          { method: 'popup', minutes: 60 }       // 1 hora antes
        ]
      },
      
      // Configuración de la invitación
      guestsCanInviteOthers: true,
      guestsCanModify: false,
      guestsCanSeeOtherGuests: true,
      // Forzar el envío de notificaciones
      sendUpdates: 'all',
      sendNotifications: true,
      // Metadatos adicionales
      extendedProperties: {
        shared: {
          tipo: 'cita_invitacion',
          creadoPor: 'sistema',
          clienteId: clienteId.toString()
        }
      }
    };
    
    // Primero creamos el evento
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all',
      sendNotifications: true,
      maxAttendees: 20,
      supportsAttachments: false
    });
    
    // Luego actualizamos el evento para forzar el envío de notificaciones
    try {
      await calendar.events.patch({
        calendarId: 'primary',
        eventId: response.data.id,
        sendUpdates: 'all',
        sendNotifications: true,
        resource: {
          status: 'confirmed' // Confirmar el evento para asegurar notificaciones
        }
      });
    } catch (updateError) {
      console.warn('Advertencia al actualizar el evento para forzar notificación:', updateError.message);
      // No es un error crítico, continuamos
    }
    
    res.status(200).json({
      message: 'Invitación creada y notificaciones enviadas exitosamente',
      eventId: response.data.id,
      hangoutLink: response.data.hangoutLink,
      htmlLink: response.data.htmlLink,
      attendees: response.data.attendees
    });
    
  } catch (error) {
    console.error('Error al crear la invitación:', error);
    
    // Proporcionar más detalles del error
    let errorMessage = 'Error al crear la invitación';
    let errorDetails = error.message;
    
    if (error.response && error.response.data) {
      errorDetails = error.response.data.error || JSON.stringify(error.response.data);
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: errorDetails,
      code: error.code
    });
  }
};

// Verificar estado de autenticación
exports.checkAuth = (req, res) => {
  const { tokens } = req.session;
  res.json({ 
    authenticated: !!tokens,
    hasAccessToken: !!(tokens && tokens.access_token)
  });
};
