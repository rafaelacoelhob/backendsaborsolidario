const express = require('express');
const router = express.Router();
const ongController = require('../controllers/ongController');

// Rota para criar uma nova ONG
router.post('/', ongController.createOng); // POST para criar uma ONG

// Rota para listar todas as ONGs
router.get('/', ongController.getAllOngs); // GET para listar todas as ONGs

// Rota para consultar uma ONG pelo CNPJ
router.get('/:cnpj', ongController.getOngByCnpj); // GET para buscar uma ONG específica pelo CNPJ

// Rota para remover uma ONG pelo CNPJ
router.delete('/:cnpj', ongController.deleteOng); // DELETE para remover uma ONG específica

// Rota para atualizar informações de uma ONG
router.put('/:cnpj', ongController.updateOng); // PUT para atualizar dados de uma ONG específica

module.exports = router;
