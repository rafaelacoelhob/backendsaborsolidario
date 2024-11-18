const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const ongRoutes = require('./routes/ongRoutes');

const app = express();

// Configuração de CORS
const corsOptions = {
    origin: [
        'http://localhost:3001', // Para desenvolvimento local
        'https://frontsaborsolidario-5ot5kxz3k-rafaelas-projects-c9672c56.vercel.app', // URL do frontend hospedado
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
    credentials: true, // Permite cookies e autenticação no frontend
};
app.use(cors(corsOptions)); // Ativa o CORS com as opções configuradas

// Middleware para parse do JSON no body das requisições
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para log de requisições no servidor
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Rotas
app.use('/api', contactRoutes); // Rotas de contato
app.use('/api/auth', authRoutes); // Rotas de autenticação
app.use('/api/ongs', ongRoutes); // Rotas de ONG

// Rota para a raiz
app.get('/', (req, res) => {
    res.status(200).send('Backend do Sabor Solidário está rodando!');
});

// Middleware para rotas não encontradas
app.use((req, res, next) => {
    console.error(`Rota não encontrada: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: 'Rota não encontrada.' });
});

// Middleware para tratamento de erros genéricos
app.use((err, req, res, next) => {
    console.error('Erro interno do servidor:', err.stack);
    res.status(500).json({ error: 'Erro interno do servidor.' });
});

module.exports = app;
