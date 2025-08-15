const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const { checkIfSignedIn } = require('../middleware/auth');

// Ruta para obtener la URL de autenticación
router.get('/auth/url', calendarController.getAuthUrl);

// Ruta de callback para la autenticación
router.get('/auth/callback', calendarController.handleCallback);

// Verificar estado de autenticación
router.get('/auth/status', checkIfSignedIn, calendarController.checkAuth);

// Obtener eventos del calendario
router.get('/events', checkIfSignedIn, calendarController.getEvents);

// Crear un nuevo evento
router.post('/events', checkIfSignedIn, calendarController.createEvent);

// Crear una invitación de calendario
router.post('/invites', checkIfSignedIn, calendarController.createInvite);

// --- Rutas para Horarios de Citas ---

// Obtener horarios disponibles
router.post('/appointment-slots', checkIfSignedIn, calendarController.getAppointmentSlots);

// Reservar una cita
router.post('/book-appointment', checkIfSignedIn, calendarController.bookAppointment);

module.exports = router;
