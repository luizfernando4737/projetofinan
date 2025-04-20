const express = require('express');
const router = express.Router();
const ContaPagarController = require('../controllers/ContaPagarController');
const authMiddleware = require('../middlewares/auth');

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Listar todas as contas a pagar
router.get('/', ContaPagarController.index);

// Obter resumo das contas a pagar
router.get('/resumo', ContaPagarController.resumo);

// Obter uma conta a pagar específica
router.get('/:id', ContaPagarController.show);

// Criar uma nova conta a pagar
router.post('/', ContaPagarController.store);

// Atualizar uma conta a pagar
router.put('/:id', ContaPagarController.update);

// Marcar uma conta como paga
router.patch('/:id/pagar', ContaPagarController.marcarComoPaga);

// Cancelar uma conta a pagar
router.patch('/:id/cancelar', ContaPagarController.cancelar);

// Deletar uma conta a pagar
router.delete('/:id', ContaPagarController.destroy);

module.exports = router; 