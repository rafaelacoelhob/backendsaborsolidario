const express = require('express');
const router = express.Router();
const ongController = require('../controllers/ongController'); // Certifique-se de que o caminho está correto

// Rota para listar todas as ONGs
router.get('/', ongController.getAllOngs);

// Rota para criar uma ONG
router.post('/', ongController.createOng);

// Rota para consultar uma ONG pelo CNPJ
router.get('/:cnpj', ongController.getOngByCnpj);

// Rota para remover uma ONG pelo CNPJ
router.delete('/:cnpj', ongController.deleteOng);

// Rota para atualizar uma ONG pelo CNPJ
router.put('/:cnpj', ongController.updateOng);

module.exports = router;
