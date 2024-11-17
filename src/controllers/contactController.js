const db = require('../database/dbConfig');

exports.sendMessage = (req, res) => {
    const { nome, email, mensagem } = req.body;

    const sql = `INSERT INTO mensagens (nome, email, mensagem) VALUES (?, ?, ?)`;

    db.run(sql, [nome, email, mensagem], function (err) {
        if (err) {
            console.error('Erro ao salvar a mensagem:', err.message);
            return res.status(500).json({ error: 'Erro ao salvar a mensagem.' });
        }
        res.status(201).json({ message: 'Mensagem enviada com sucesso!' });
    });
};
