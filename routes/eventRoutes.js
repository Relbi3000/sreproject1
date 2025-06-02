// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { ensureAuth } = require('../middlewares/auth');
const { validateEvent } = require('../middlewares/validate');

// Публичные маршруты
router.get('/', eventController.getAllEvents);
router.get('/stats', eventController.getEventStats);

// Приватные маршруты (только для авторизованных пользователей)
router.get('/add', ensureAuth, eventController.addEventForm);
router.post('/', ensureAuth, validateEvent, eventController.createEvent);
router.get('/edit/:id', ensureAuth, eventController.editEventForm);
router.put('/edit/:id', ensureAuth, validateEvent, eventController.updateEvent);
router.delete('/delete/:id', ensureAuth, eventController.deleteEvent);

// Динамический маршрут для просмотра события (должен идти последним)
router.get('/:id', eventController.getEventById);

module.exports = router;
