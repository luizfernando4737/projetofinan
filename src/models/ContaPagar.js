const { Model, DataTypes } = require('sequelize');

class ContaPagar extends Model {
  static init(sequelize) {
    super.init(
      {
        descricao: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        valor: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        dataVencimento: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        dataPagamento: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM('PENDENTE', 'PAGO', 'CANCELADO'),
          defaultValue: 'PENDENTE',
        },
        formaPagamento: {
          type: DataTypes.ENUM('DINHEIRO', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'PIX', 'BOLETO', 'TRANSFERENCIA'),
          allowNull: false,
        },
        categoria: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        observacao: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        comprovante: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        usuarioId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        fornecedorId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        contaBancariaId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        cartaoCreditoId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'contas_pagar',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
    this.belongsTo(models.Fornecedor, { foreignKey: 'fornecedorId', as: 'fornecedor' });
    this.belongsTo(models.ContaBancaria, { foreignKey: 'contaBancariaId', as: 'contaBancaria' });
    this.belongsTo(models.CartaoCredito, { foreignKey: 'cartaoCreditoId', as: 'cartaoCredito' });
  }
}

module.exports = ContaPagar; 