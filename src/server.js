require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { sequelize } = require('./models');

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Rotas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/clientes', require('./routes/clientes.routes'));
app.use('/api/fornecedores', require('./routes/fornecedores.routes'));
app.use('/api/contas-pagar', require('./routes/contasPagar.routes'));
app.use('/api/contas-receber', require('./routes/contasReceber.routes'));
app.use('/api/contas-bancarias', require('./routes/contasBancarias.routes'));
app.use('/api/cartoes-credito', require('./routes/cartoesCredito.routes'));
app.use('/api/investimentos', require('./routes/investimentos.routes'));

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3001;

// Inicialização do servidor
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
  }
}

startServer(); 