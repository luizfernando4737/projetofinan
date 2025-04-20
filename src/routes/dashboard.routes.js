const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const {
  ContaPagar,
  ContaReceber,
  ContaBancaria,
  CartaoCredito,
  Investimento,
} = require('../models');

// Middleware de autenticação
const authMiddleware = require('../middlewares/auth');

// Rota para obter dados do dashboard
router.get('/', authMiddleware, async (req, res) => {
  try {
    const usuarioId = req.user.id;

    // Obtém o saldo total das contas bancárias
    const contasBancarias = await ContaBancaria.findAll({
      where: { usuarioId, ativo: true },
    });
    const saldoTotal = contasBancarias.reduce(
      (total, conta) => total + Number(conta.saldo),
      0
    );

    // Obtém o total de contas a pagar
    const contasPagar = await ContaPagar.sum('valor', {
      where: {
        usuarioId,
        status: 'PENDENTE',
      },
    });

    // Obtém o total de contas a receber
    const contasReceber = await ContaReceber.sum('valor', {
      where: {
        usuarioId,
        status: 'PENDENTE',
      },
    });

    // Obtém o total da fatura do cartão de crédito
    const cartoesCredito = await CartaoCredito.findAll({
      where: { usuarioId, ativo: true },
    });
    const faturaCartao = cartoesCredito.reduce(
      (total, cartao) => total + Number(cartao.faturaAtual),
      0
    );

    // Obtém o total de investimentos
    const investimentos = await Investimento.sum('valorAtual', {
      where: {
        usuarioId,
        ativo: true,
      },
    });

    // Obtém o fluxo de caixa dos últimos 6 meses
    const hoje = new Date();
    const seisMesesAtras = new Date();
    seisMesesAtras.setMonth(hoje.getMonth() - 6);

    const fluxoCaixa = await Promise.all(
      Array.from({ length: 6 }, (_, i) => {
        const data = new Date();
        data.setMonth(hoje.getMonth() - i);
        const mes = data.toLocaleString('pt-BR', { month: 'short' });
        const ano = data.getFullYear();

        return Promise.all([
          ContaReceber.sum('valor', {
            where: {
              usuarioId,
              status: 'RECEBIDO',
              dataRecebimento: {
                [Op.between]: [
                  new Date(data.getFullYear(), data.getMonth(), 1),
                  new Date(data.getFullYear(), data.getMonth() + 1, 0),
                ],
              },
            },
          }),
          ContaPagar.sum('valor', {
            where: {
              usuarioId,
              status: 'PAGO',
              dataPagamento: {
                [Op.between]: [
                  new Date(data.getFullYear(), data.getMonth(), 1),
                  new Date(data.getFullYear(), data.getMonth() + 1, 0),
                ],
              },
            },
          }),
        ]).then(([receitas, despesas]) => ({
          mes: `${mes}/${ano}`,
          receitas: receitas || 0,
          despesas: despesas || 0,
        }));
      })
    );

    // Obtém a distribuição de despesas por categoria
    const distribuicaoDespesas = await ContaPagar.findAll({
      where: {
        usuarioId,
        status: 'PAGO',
        dataPagamento: {
          [Op.between]: [seisMesesAtras, hoje],
        },
      },
      attributes: [
        'categoria',
        [sequelize.fn('SUM', sequelize.col('valor')), 'valor'],
      ],
      group: ['categoria'],
    });

    res.json({
      saldoTotal,
      contasPagar: contasPagar || 0,
      contasReceber: contasReceber || 0,
      faturaCartao,
      investimentos: investimentos || 0,
      fluxoCaixa: fluxoCaixa.reverse(),
      distribuicaoDespesas: distribuicaoDespesas.map((item) => ({
        name: item.categoria,
        valor: Number(item.get('valor')),
      })),
    });
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router; 