const db = require('../database/dbConfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Configuração de segredo para JWT
const JWT_SECRET = process.env.JWT_SECRET || 'secretKey';

// Create - Registrar um usuário
exports.register = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const checkUserSql = `SELECT * FROM usuarios WHERE email = ?`;
        db.get(checkUserSql, [email], async (err, row) => {
            if (err) {
                console.error('Erro ao verificar email:', err.message);
                return res.status(500).json({ error: 'Erro no servidor.' });
            }

            if (row) {
                return res.status(400).json({ error: 'Email já está cadastrado.' });
            }

            const hashedPassword = await bcrypt.hash(senha, 10);

            const sql = `INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`;
            db.run(sql, [nome, email, hashedPassword], function (err) {
                if (err) {
                    console.error('Erro ao criar usuário:', err.message);
                    return res.status(500).json({ error: 'Erro ao criar conta.' });
                }

                res.status(201).json({ message: 'Usuário cadastrado com sucesso!', id: this.lastID });
            });
        });
    } catch (err) {
        console.error('Erro no registro:', err.message);
        res.status(500).json({ error: 'Erro ao registrar usuário.' });
    }
};

// Login - Autenticar um usuário
exports.login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const sql = `SELECT * FROM usuarios WHERE email = ?`;
        db.get(sql, [email], async (err, row) => {
            if (err) {
                console.error('Erro ao autenticar usuário:', err.message);
                return res.status(500).json({ error: 'Erro no servidor.' });
            }

            if (!row) {
                return res.status(401).json({ error: 'Email ou senha inválidos.' });
            }

            const match = await bcrypt.compare(senha, row.senha);
            if (!match) {
                return res.status(401).json({ error: 'Email ou senha inválidos.' });
            }

            const token = jwt.sign({ id: row.id, email: row.email }, JWT_SECRET, { expiresIn: '1h' });

            res.json({
                message: 'Login realizado com sucesso!',
                token,
                user: { id: row.id, nome: row.nome, email: row.email },
            });
        });
    } catch (err) {
        console.error('Erro no login:', err.message);
        res.status(500).json({ error: 'Erro ao tentar login.' });
    }
};
