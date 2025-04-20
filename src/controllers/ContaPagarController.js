const { ContaPagar, Usuario, Fornecedor, ContaBancaria, CartaoCredito } = require('../models');
const { Op } = require('sequelize');

class ContaPagarController {
  // Listar todas as contas a pagar
  async index(req, res) {
    try {
      const contasPagar = await ContaPagar.findAll({
        where: { userId: req.userId },
        include: [
          { association: 'fornecedor' },
          { association: 'contaBancaria' },
          { association: 'cartaoCredito' }
        ],
        order: [['dataVencimento', 'ASC']]
      });

      return res.json(contasPagar);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar contas a pagar' });
    }
  }

  // Buscar conta a pagar por ID
  async show(req, res) {
    try {
      const { id } = req.params;

      const contaPagar = await ContaPagar.findOne({
        where: { id, userId: req.userId },
        include: [
          { association: 'fornecedor' },
          { association: 'contaBancaria' },
          { association: 'cartaoCredito' }
        ]
      });

      if (!contaPagar) {
        return res.status(404).json({ error: 'Conta a pagar não encontrada' });
      }

      return res.json(contaPagar);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar conta a pagar' });
    }
  }

  // Criar nova conta a pagar
  async store(req, res) {
    try {
      const {
        descricao,
        valor,
        dataVencimento,
        dataPagamento,
        status,
        fornecedorId,
        contaBancariaId,
        cartaoCreditoId,
        observacoes
      } = req.body;

      const contaPagar = await ContaPagar.create({
        descricao,
        valor,
        dataVencimento,
        dataPagamento,
        status,
        fornecedorId,
        contaBancariaId,
        cartaoCreditoId,
        observacoes,
        userId: req.userId
      });

      return res.status(201).json(contaPagar);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao criar conta a pagar' });
    }
  }

  // Atualizar conta a pagar
  async update(req, res) {
    try {
      const { id } = req.params;
      const {
        descricao,
        valor,
        dataVencimento,
        dataPagamento,
        status,
        fornecedorId,
        contaBancariaId,
        cartaoCreditoId,
        observacoes
      } = req.body;

      const contaPagar = await ContaPagar.findOne({
        where: { id, userId: req.userId }
      });

      if (!contaPagar) {
        return res.status(404).json({ error: 'Conta a pagar não encontrada' });
      }

      await contaPagar.update({
        descricao,
        valor,
        dataVencimento,
        dataPagamento,
        status,
        fornecedorId,
        contaBancariaId,
        cartaoCreditoId,
        observacoes
      });

      return res.json(contaPagar);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar conta a pagar' });
    }
  }

  // Marcar conta como paga
  async marcarComoPaga(req, res) {
    try {
      const conta = await ContaPagar.findOne({
        where: { id: req.params.id, userId: req.user.id },
      });

      if (!conta) {
        return res.status(404).json({ message: 'Conta a pagar não encontrada' });
      }

      await conta.update({
        status: 'PAGO',
        dataPagamento: new Date(),
      });

      return res.json(conta);
    } catch (error) {
      console.error('Erro ao marcar conta como paga:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Cancelar conta a pagar
  async cancelar(req, res) {
    try {
      const conta = await ContaPagar.findOne({
        where: { id: req.params.id, userId: req.user.id },
      });

      if (!conta) {
        return res.status(404).json({ message: 'Conta a pagar não encontrada' });
      }

      await conta.update({
        status: 'CANCELADO',
      });

      return res.json(conta);
    } catch (error) {
      console.error('Erro ao cancelar conta a pagar:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Excluir conta a pagar
  async destroy(req, res) {
    try {
      const { id } = req.params;

      const contaPagar = await ContaPagar.findOne({
        where: { id, userId: req.userId }
      });

      if (!contaPagar) {
        return res.status(404).json({ error: 'Conta a pagar não encontrada' });
      }

      await contaPagar.destroy();

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar conta a pagar' });
    }
  }

  // Obter resumo das contas a pagar
  async resumo(req, res) {
    try {
      const { dataInicio, dataFim } = req.query;
      const where = { userId: req.user.id };

      if (dataInicio && dataFim) {
        where.dataVencimento = {
          [Op.between]: [new Date(dataInicio), new Date(dataFim)],
        };
      }

      const total = await ContaPagar.sum('valor', { where });
      const pago = await ContaPagar.sum('valor', {
        where: { ...where, status: 'PAGO' },
      });
      const pendente = await ContaPagar.sum('valor', {
        where: { ...where, status: 'PENDENTE' },
      });
      const atrasado = await ContaPagar.sum('valor', {
        where: {
          ...where,
          status: 'PENDENTE',
          dataVencimento: { [Op.lt]: new Date() },
        },
      });

      return res.json({
        total: total || 0,
        pago: pago || 0,
        pendente: pendente || 0,
        atrasado: atrasado || 0,
      });
    } catch (error) {
      console.error('Erro ao obter resumo das contas a pagar:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
}

module.exports = new ContaPagarController(); 