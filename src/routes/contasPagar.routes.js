const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { ContaPagar, Fornecedor, ContaBancaria, CartaoCredito } = require('../models');
const authMiddleware = require('../middlewares/auth');

// Middleware de validação
const validateContaPagar = [
  body('descricao').notEmpty().withMessage('Descrição é obrigatória'),
  body('valor').isNumeric().withMessage('Valor deve ser numérico'),
  body('dataVencimento').isDate().withMessage('Data de vencimento inválida'),
  body('formaPagamento').isIn(['DINHEIRO', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'PIX', 'BOLETO', 'TRANSFERENCIA']).withMessage('Forma de pagamento inválida'),
  body('categoria').notEmpty().withMessage('Categoria é obrigatória'),
  body('fornecedorId').isNumeric().withMessage('Fornecedor é obrigatório'),
];

// Listar todas as contas a pagar
router.get('/', authMiddleware, async (req, res) => {
  try {
    const contas = await ContaPagar.findAll({
      where: { usuarioId: req.user.id },
      include: [
        { model: Fornecedor, attributes: ['nome'] },
        { model: ContaBancaria, attributes: ['banco', 'agencia', 'conta'] },
        { model: CartaoCredito, attributes: ['nome', 'bandeira'] },
      ],
      order: [['dataVencimento', 'ASC']],
    });
    res.json(contas);
  } catch (error) {
    console.error('Erro ao buscar contas a pagar:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Buscar conta a pagar por ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const conta = await ContaPagar.findOne({
      where: { id: req.params.id, usuarioId: req.user.id },
      include: [
        { model: Fornecedor, attributes: ['nome'] },
        { model: ContaBancaria, attributes: ['banco', 'agencia', 'conta'] },
        { model: CartaoCredito, attributes: ['nome', 'bandeira'] },
      ],
    });

    if (!conta) {
      return res.status(404).json({ message: 'Conta a pagar não encontrada' });
    }

    res.json(conta);
  } catch (error) {
    console.error('Erro ao buscar conta a pagar:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Criar nova conta a pagar
router.post('/', authMiddleware, validateContaPagar, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const conta = await ContaPagar.create({
      ...req.body,
      usuarioId: req.user.id,
    });

    res.status(201).json(conta);
  } catch (error) {
    console.error('Erro ao criar conta a pagar:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Atualizar conta a pagar
router.put('/:id', authMiddleware, validateContaPagar, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const conta = await ContaPagar.findOne({
      where: { id: req.params.id, usuarioId: req.user.id },
    });

    if (!conta) {
      return res.status(404).json({ message: 'Conta a pagar não encontrada' });
    }

    await conta.update(req.body);
    res.json(conta);
  } catch (error) {
    console.error('Erro ao atualizar conta a pagar:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Marcar conta como paga
router.post('/:id/pagar', authMiddleware, async (req, res) => {
  try {
    const conta = await ContaPagar.findOne({
      where: { id: req.params.id, usuarioId: req.user.id },
    });

    if (!conta) {
      return res.status(404).json({ message: 'Conta a pagar não encontrada' });
    }

    await conta.update({
      status: 'PAGO',
      dataPagamento: new Date(),
    });

    res.json(conta);
  } catch (error) {
    console.error('Erro ao marcar conta como paga:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Cancelar conta a pagar
router.post('/:id/cancelar', authMiddleware, async (req, res) => {
  try {
    const conta = await ContaPagar.findOne({
      where: { id: req.params.id, usuarioId: req.user.id },
    });

    if (!conta) {
      return res.status(404).json({ message: 'Conta a pagar não encontrada' });
    }

    await conta.update({
      status: 'CANCELADO',
    });

    res.json(conta);
  } catch (error) {
    console.error('Erro ao cancelar conta a pagar:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Excluir conta a pagar
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const conta = await ContaPagar.findOne({
      where: { id: req.params.id, usuarioId: req.user.id },
    });

    if (!conta) {
      return res.status(404).json({ message: 'Conta a pagar não encontrada' });
    }

    await conta.destroy();
    res.json({ message: 'Conta a pagar excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir conta a pagar:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router; 