const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { ensureAuth } = require('../middlewares/auth');

// Только авторизованным пользователям доступна регистрация на событие
router.get('/register/:eventId', ensureAuth, registrationController.registrationForm);
router.post('/register/:eventId', ensureAuth, registrationController.registerForEvent);

module.exports = router;
