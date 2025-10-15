// server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rotas da API
const produtosRouter = require('./routes/produtos');
const clientesRouter = require('./routes/clientes');
const fornecedoresRouter = require('./routes/fornecedores');
const vendasRouter = require('./routes/vendas');
const relatoriosRouter = require('./routes/relatorios');

app.use('/api/produtos', produtosRouter);
app.use('/api/clientes', clientesRouter);
app.use('/api/fornecedores', fornecedoresRouter); 
app.use('/api/vendas', vendasRouter);
app.use('/api/relatorios', relatoriosRouter);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});

// comentário para primeiro teste do pipeline de CI