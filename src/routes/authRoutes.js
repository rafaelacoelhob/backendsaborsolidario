const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rotas de CRUD para usuários
router.post('/register', authController.register); // Create
router.post('/login', authController.login); // Login
router.get('/', authController.getAllUsers); // Read
router.put('/:id', authController.updateUser); // Update
router.delete('/:id', authController.deleteUser); // Delete
router.post('/reset-password', authController.resetPassword);



module.exports = router;
