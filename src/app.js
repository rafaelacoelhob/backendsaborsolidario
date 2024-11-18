const express = require('express'); 
const cors = require('cors'); // Importa o middleware CORS
const bodyParser = require('body-parser');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const ongRoutes = require('./routes/ongRoutes');

const app = express(); // Inicializa o Express

// Configuração de CORS
const corsOptions = {
    origin: ['http://localhost:3001', 'https://frontsaborsolidario-5ot5kxz3k-rafaelas-projects-c9672c56.vercel.app/'], // Adicione as origens permitidas
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
    credentials: true, // Permite cookies e autenticação no frontend
};
app.use(cors(corsOptions)); // Ativa o CORS com as opções configuradas

app.use(bodyParser.json()); // Middleware para processar JSON no body das requisições

// Define as rotas
app.use('/api', contactRoutes); // Rotas de contato
app.use('/api/auth', authRoutes); // Rotas de autenticação
app.use('/api/ongs', ongRoutes); // Rotas de ONG

// Rota para a raiz
app.get('/', (req, res) => {
    res.send('Backend do Sabor Solidário está rodando!');
});

// Middleware para rotas não encontradas
app.use((req, res, next) => {
    res.status(404).json({ error: 'Rota não encontrada.' });
});

// Middleware para tratamento de erros genéricos
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Erro interno do servidor.' });
});

module.exports = app;
