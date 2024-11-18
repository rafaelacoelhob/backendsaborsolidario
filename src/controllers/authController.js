const db = require('../database/dbConfig');
const bcrypt = require('bcrypt'); // Para hash de senhas
const jwt = require('jsonwebtoken');

// Configuração de segredo para JWT
const JWT_SECRET = process.env.JWT_SECRET || 'secretKey'; // Certifique-se de definir `JWT_SECRET` no Render

// Create - Registrar um usuário
exports.register = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        // Verificar se o email já está cadastrado
        const checkUserSql = `SELECT * FROM usuarios WHERE email = ?`;
        db.get(checkUserSql, [email], async (err, row) => {
            if (err) {
                console.error('Erro ao verificar email:', err.message);
                return res.status(500).json({ error: 'Erro no servidor.' });
            }

            if (row) {
                return res.status(400).json({ error: 'Email já está cadastrado.' });
            }

            // Gerar hash da senha
            const hashedPassword = await bcrypt.hash(senha, 10);

            // Inserir novo usuário
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

// Read - Listar todos os usuários
exports.getAllUsers = (req, res) => {
    const sql = `SELECT id, nome, email FROM usuarios`; // Não exibimos a senha por segurança
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar usuários.' });
        res.json(rows);
    });
};

// Update - Atualizar informações de um usuário
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha } = req.body;

    try {
        const hashedPassword = senha ? await bcrypt.hash(senha, 10) : null;

        const sql = hashedPassword
            ? `UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id = ?`
            : `UPDATE usuarios SET nome = ?, email = ? WHERE id = ?`;

        const params = hashedPassword ? [nome, email, hashedPassword, id] : [nome, email, id];

        db.run(sql, params, function (err) {
            if (err) return res.status(500).json({ error: 'Erro ao atualizar usuário.' });
            if (this.changes === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });
            res.json({ message: 'Usuário atualizado com sucesso!' });
        });
    } catch (err) {
        console.error('Erro ao atualizar usuário:', err.message);
        res.status(500).json({ error: 'Erro ao atualizar usuário.' });
    }
};

// Delete - Remover um usuário
exports.deleteUser = (req, res) => {
    const { id } = req.params;

    const sql = `DELETE FROM usuarios WHERE id = ?`;
    db.run(sql, [id], function (err) {
        if (err) return res.status(500).json({ error: 'Erro ao excluir usuário.' });
        if (this.changes === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });
        res.json({ message: 'Usuário removido com sucesso!' });
    });
};

// Login - Autenticar um usuário
exports.login = (req, res) => {
    const { email, senha } = req.body;

    const sql = `SELECT * FROM usuarios WHERE email = ?`;
    db.get(sql, [email], async (err, row) => {
        if (err) {
            console.error('Erro ao autenticar usuário:', err.message);
            return res.status(500).json({ error: 'Erro ao autenticar usuário.' });
        }

        if (!row) {
            return res.status(401).json({ error: 'Email ou senha inválidos.' });
        }

        const match = await bcrypt.compare(senha, row.senha);
        if (!match) {
            return res.status(401).json({ error: 'Email ou senha inválidos.' });
        }

        // Gerar token JWT
        const token = jwt.sign({ id: row.id, email: row.email }, JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: 'Login realizado com sucesso!',
            token,
            user: { id: row.id, nome: row.nome, email: row.email },
        });
    });
};

// Resetar a senha
exports.resetPassword = async (req, res) => {
    const { email, novaSenha } = req.body;

    try {
        const sqlCheck = `SELECT * FROM usuarios WHERE email = ?`;
        db.get(sqlCheck, [email], async (err, row) => {
            if (err) {
                console.error('Erro ao verificar email:', err.message);
                return res.status(500).json({ error: 'Erro no servidor.' });
            }

            if (!row) {
                return res.status(404).json({ error: 'Email não encontrado.' });
            }

            const hashedPassword = await bcrypt.hash(novaSenha, 10);

            const sqlUpdate = `UPDATE usuarios SET senha = ? WHERE email = ?`;
            db.run(sqlUpdate, [hashedPassword, email], function (err) {
                if (err) {
                    console.error('Erro ao atualizar senha:', err.message);
                    return res.status(500).json({ error: 'Erro ao redefinir senha.' });
                }

                res.json({ message: 'Senha redefinida com sucesso!' });
            });
        });
    } catch (err) {
        console.error('Erro ao redefinir senha:', err.message);
        res.status(500).json({ error: 'Erro ao redefinir senha.' });
    }
};
