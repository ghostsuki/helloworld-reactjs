// routes/fornecedores.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ROTA GET: Listar todos os fornecedores
router.get('/', async (req, res) => {
    try {
        const [fornecedores] = await db.query("SELECT * FROM cad_fornecedores");
        res.json(fornecedores);
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao buscar fornecedores", erro: error });
    }
});

// ROTA POST: Cadastrar um novo fornecedor
router.post('/', async (req, res) => {
    try {
        const { nome_fantasia, razao_social, cnpj, telefone, email } = req.body;
        const query = "INSERT INTO cad_fornecedores (nome_fantasia, razao_social, cnpj, telefone, email) VALUES (?, ?, ?, ?, ?)";
        await db.query(query, [nome_fantasia, razao_social, cnpj, telefone, email]);
        res.status(201).json({ sucesso: true, mensagem: "Fornecedor cadastrado com sucesso!" });
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: "Erro ao cadastrar fornecedor: " + error.message });
    }
});

// ROTA PUT: Atualizar um fornecedor
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome_fantasia, razao_social, cnpj, telefone, email } = req.body;
        const query = "UPDATE cad_fornecedores SET nome_fantasia = ?, razao_social = ?, cnpj = ?, telefone = ?, email = ? WHERE id_fornecedor = ?";
        await db.query(query, [nome_fantasia, razao_social, cnpj, telefone, email, id]);
        res.json({ sucesso: true, mensagem: "Fornecedor atualizado com sucesso!" });
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: "Erro ao atualizar fornecedor." });
    }
});

// ROTA DELETE: Excluir um fornecedor
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = "DELETE FROM cad_fornecedores WHERE id_fornecedor = ?";
        await db.query(query, [id]);
        res.json({ sucesso: true, mensagem: "Fornecedor excluído com sucesso!" });
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: "Erro ao excluir fornecedor." });
    }
});

module.exports = router;