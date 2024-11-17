const express = require('express');
const cors = require('cors'); // Importa o middleware CORS
const bodyParser = require('body-parser');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const ongRoutes = require('./routes/ongRoutes');

const app = express(); // Inicializa o Express

app.use(cors()); // Permite requisições de qualquer origem
app.use(bodyParser.json()); // Middleware para processar JSON no body das requisições

// Define as rotas
app.use('/api', contactRoutes); // Rotas de contato
app.use('/api/auth', authRoutes); // Rotas de autenticação
app.use('/api/ongs', ongRoutes); // Rotas de ONG

module.exports = app;
