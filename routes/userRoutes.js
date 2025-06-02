// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { ensureAuth } = require('../middlewares/auth');
const { validateRegister, validateLogin, validateProfile } = require('../middlewares/validate');

router.get('/register', userController.registerForm);
router.post('/register', validateRegister, userController.registerUser);

router.get('/login', userController.loginForm);
router.post('/login', validateLogin, userController.loginUser);

// Эндпоинты для управления профилем (приватные)
router.get('/profile', ensureAuth, userController.getProfile);
router.put('/profile', ensureAuth, validateProfile, userController.updateProfile);

module.exports = router;
