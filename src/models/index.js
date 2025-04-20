const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true,
    },
  }
);

// Importação dos modelos
const Usuario = require('./Usuario');
const Cliente = require('./Cliente');
const Fornecedor = require('./Fornecedor');
const ContaPagar = require('./ContaPagar');
const ContaReceber = require('./ContaReceber');
const ContaBancaria = require('./ContaBancaria');
const CartaoCredito = require('./CartaoCredito');
const Investimento = require('./Investimento');

// Definição das associações
Usuario.hasMany(ContaPagar);
ContaPagar.belongsTo(Usuario);

Usuario.hasMany(ContaReceber);
ContaReceber.belongsTo(Usuario);

Usuario.hasMany(ContaBancaria);
ContaBancaria.belongsTo(Usuario);

Usuario.hasMany(CartaoCredito);
CartaoCredito.belongsTo(Usuario);

Usuario.hasMany(Investimento);
Investimento.belongsTo(Usuario);

Cliente.hasMany(ContaReceber);
ContaReceber.belongsTo(Cliente);

Fornecedor.hasMany(ContaPagar);
ContaPagar.belongsTo(Fornecedor);

module.exports = {
  sequelize,
  Usuario,
  Cliente,
  Fornecedor,
  ContaPagar,
  ContaReceber,
  ContaBancaria,
  CartaoCredito,
  Investimento,
}; 