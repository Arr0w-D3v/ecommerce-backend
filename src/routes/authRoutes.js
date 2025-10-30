const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../middlewares/validator');
const { authenticateToken } = require('../middlewares/auth');

// Routes publiques
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Routes protégées
router.get('/profile', authenticateToken, getProfile);

module.exports = router;
