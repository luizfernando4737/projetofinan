const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('./index');

class Investimento extends Model {}

Investimento.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM(
        'RENDA_FIXA',
        'RENDA_VARIAVEL',
        'FUNDOS_IMOBILIARIOS',
        'CRIPTOMOEDAS',
        'OUTROS'
      ),
      allowNull: false,
    },
    valorInvestido: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    valorAtual: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    rentabilidade: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    dataInicio: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    dataVencimento: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    instituicao: {
      type: DataTypes.STRING,
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
    modelName: 'investimento',
    hooks: {
      beforeSave: (investimento) => {
        if (investimento.valorInvestido && investimento.valorAtual) {
          const rentabilidade = ((investimento.valorAtual - investimento.valorInvestido) / investimento.valorInvestido) * 100;
          investimento.rentabilidade = rentabilidade;
        }
      },
    },
  }
);

module.exports = Investimento; 