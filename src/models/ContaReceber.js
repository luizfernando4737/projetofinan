const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('./index');

class ContaReceber extends Model {}

ContaReceber.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    dataVencimento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    dataRecebimento: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('PENDENTE', 'RECEBIDO', 'ATRASADO', 'CANCELADO'),
      defaultValue: 'PENDENTE',
    },
    formaRecebimento: {
      type: DataTypes.ENUM('DINHEIRO', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'PIX', 'BOLETO', 'TRANSFERENCIA'),
      allowNull: false,
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    clienteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cliente',
        key: 'id',
      },
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuario',
        key: 'id',
      },
    },
    contaBancariaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'conta_bancaria',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'conta_receber',
    indexes: [
      {
        fields: ['dataVencimento'],
      },
      {
        fields: ['status'],
      },
    ],
  }
);

module.exports = ContaReceber; 