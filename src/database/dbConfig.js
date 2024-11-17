const sqlite3 = require('sqlite3').verbose();

// Configuração do banco de dados com busyTimeout para evitar bloqueios
const db = new sqlite3.Database('sabor_solidario.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Erro ao conectar no banco:', err.message);
    } else {
        console.log('Conectado ao banco SQLite.');
    }
});

// Configura timeout para evitar erros de bloqueio
db.configure('busyTimeout', 5000);

db.serialize(() => {
    // Criação das tabelas
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL
        )
    `, (err) => {
        if (err) console.error('Erro ao criar tabela usuarios:', err.message);
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS ongs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            endereco TEXT NOT NULL,
            estado TEXT NOT NULL,
            horario TEXT NOT NULL,
            cnpj TEXT UNIQUE NOT NULL,
            email TEXT NOT NULL,
            telefone TEXT NOT NULL
        )
    `, (err) => {
        if (err) console.error('Erro ao criar tabela ongs:', err.message);
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS mensagens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL,
            mensagem TEXT NOT NULL
        )
    `, (err) => {
        if (err) console.error('Erro ao criar tabela mensagens:', err.message);
    });
});

// Fechar o banco ao encerrar a aplicação para liberar recursos
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Erro ao fechar o banco de dados:', err.message);
        } else {
            console.log('Conexão com o banco de dados encerrada.');
        }
        process.exit(0);
    });
});

module.exports = db;
