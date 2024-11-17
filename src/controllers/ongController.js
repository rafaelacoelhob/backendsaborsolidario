const db = require('../database/dbConfig');

// Criar uma nova ONG
exports.createOng = (req, res) => {
    const { nome, endereco, estado, horario, cnpj, email, telefone } = req.body;

    // Validação básica
    if (!nome || !endereco || !estado || !horario || !cnpj || !email || !telefone) {
        console.error('Erro: Todos os campos são obrigatórios.');
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    // Validação do formato do CNPJ
    const cnpjRegex = /^\d{14}$/;
    if (!cnpjRegex.test(cnpj)) {
        console.error('Erro: CNPJ inválido.');
        return res.status(400).json({ error: 'CNPJ inválido. Deve conter 14 dígitos numéricos.' });
    }

    const sql = `
        INSERT INTO ongs (nome, endereco, estado, horario, cnpj, email, telefone) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(sql, [nome, endereco, estado, horario, cnpj, email, telefone], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint')) {
                console.error('Erro: CNPJ ou Email já cadastrado.');
                return res.status(400).json({ error: 'CNPJ ou Email já cadastrado.' });
            }
            console.error('Erro ao cadastrar ONG:', err.message);
            return res.status(500).json({ error: 'Erro interno ao cadastrar ONG.' });
        }
        console.log('ONG cadastrada com sucesso.');
        res.status(201).json({
            message: 'ONG cadastrada com sucesso!',
            ong: { id: this.lastID, nome, endereco, estado, horario, cnpj, email, telefone }
        });
    });
};

// Listar todas as ONGs
exports.getAllOngs = (req, res) => {
    const sql = 'SELECT * FROM ongs';
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar ONGs:', err.message);
            return res.status(500).json({ error: 'Erro interno ao buscar ONGs.' });
        }
        console.log('Lista de ONGs carregada com sucesso.');
        res.json({ message: 'Lista de ONGs carregada com sucesso!', ongs: rows });
    });
};

// Consultar uma ONG pelo CNPJ
exports.getOngByCnpj = (req, res) => {
    const { cnpj } = req.params;

    if (!cnpj) {
        console.error('Erro: CNPJ não fornecido.');
        return res.status(400).json({ error: 'CNPJ é obrigatório.' });
    }

    const cnpjRegex = /^\d{14}$/;
    if (!cnpjRegex.test(cnpj)) {
        console.error('Erro: CNPJ inválido.');
        return res.status(400).json({ error: 'CNPJ inválido. Deve conter 14 dígitos numéricos.' });
    }

    const sql = 'SELECT * FROM ongs WHERE cnpj = ?';
    db.get(sql, [cnpj], (err, row) => {
        if (err) {
            console.error('Erro ao buscar ONG:', err.message);
            return res.status(500).json({ error: 'Erro interno ao buscar ONG.' });
        }
        if (!row) {
            console.warn('Nenhuma ONG encontrada com este CNPJ.');
            return res.status(404).json({ error: 'ONG não encontrada.' });
        }
        console.log('ONG encontrada com sucesso.');
        res.json({ message: 'ONG encontrada com sucesso!', ong: row });
    });
};

// Remover uma ONG pelo CNPJ
exports.deleteOng = (req, res) => {
    const { cnpj } = req.params;

    if (!cnpj) {
        console.error('Erro: CNPJ não fornecido.');
        return res.status(400).json({ error: 'CNPJ é obrigatório.' });
    }

    const sql = 'DELETE FROM ongs WHERE cnpj = ?';
    db.run(sql, [cnpj], function (err) {
        if (err) {
            console.error('Erro ao remover ONG:', err.message);
            return res.status(500).json({ error: 'Erro interno ao remover ONG.' });
        }
        if (this.changes === 0) {
            console.warn('Nenhuma ONG encontrada com este CNPJ para remoção.');
            return res.status(404).json({ error: 'ONG não encontrada.' });
        }
        console.log('ONG removida com sucesso.');
        res.json({ message: 'ONG removida com sucesso!' });
    });
};

// Atualizar informações de uma ONG
exports.updateOng = (req, res) => {
    const { cnpj } = req.params;
    const { nome, endereco, estado, horario, email, telefone } = req.body;

    if (!cnpj || !nome || !endereco || !estado || !horario || !email || !telefone) {
        console.error('Erro: Todos os campos são obrigatórios.');
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const sql = `
        UPDATE ongs 
        SET nome = ?, endereco = ?, estado = ?, horario = ?, email = ?, telefone = ? 
        WHERE cnpj = ?
    `;
    db.run(sql, [nome, endereco, estado, horario, email, telefone, cnpj], function (err) {
        if (err) {
            console.error('Erro ao atualizar ONG:', err.message);
            return res.status(500).json({ error: 'Erro interno ao atualizar ONG.' });
        }
        if (this.changes === 0) {
            console.warn('Nenhuma ONG encontrada para atualização.');
            return res.status(404).json({ error: 'ONG não encontrada.' });
        }
        console.log('ONG atualizada com sucesso.');
        res.json({ message: 'ONG atualizada com sucesso!' });
    });
};
