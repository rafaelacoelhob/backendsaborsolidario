const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Rota para enviar mensagem
router.post('/messages', contactController.sendMessage);

module.exports = router;
