const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('./index');

class ContaBancaria extends Model {}

ContaBancaria.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    banco: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    agencia: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    conta: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM('CORRENTE', 'POUPANCA', 'SALARIO', 'INVESTIMENTO'),
      allowNull: false,
    },
    saldo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    saldoConciliado: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    dataUltimaConciliacao: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuario',
        key: 'id',
      },
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'conta_bancaria',
  }
);

module.exports = ContaBancaria; 