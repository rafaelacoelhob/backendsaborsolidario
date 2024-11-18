const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rotas de autenticação
router.post('/register', authController.register); // Rota para registrar usuário
router.post('/login', authController.login); // Rota para login de usuário
router.get('/', authController.getAllUsers); // Rota para listar todos os usuários
router.put('/:id', authController.updateUser); // Rota para atualizar um usuário
router.delete('/:id', authController.deleteUser); // Rota para deletar um usuário
router.post('/reset-password', authController.resetPassword); // Rota para redefinir senha

module.exports = router;
