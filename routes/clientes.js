// routes/clientes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ROTA GET: Listar todos os clientes
router.get('/', async (req, res) => {
    try {
        const [clientes] = await db.query("SELECT * FROM cad_clientes");
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao buscar clientes", erro: error });
    }
});

// ROTA POST: Cadastrar um novo cliente
router.post('/', async (req, res) => {
    try {
        const { nome_cliente, cpf, telefone, email } = req.body;
        const query = "INSERT INTO cad_clientes (nome_cliente, cpf, telefone, email) VALUES (?, ?, ?, ?)";
        await db.query(query, [nome_cliente, cpf, telefone, email]);
        res.status(201).json({ sucesso: true, mensagem: "Cliente cadastrado com sucesso!" });
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: "Erro ao cadastrar cliente: " + error.message });
    }
});

// ROTA PUT: Atualizar um cliente existente
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome_cliente, cpf, telefone, email } = req.body;
        const query = "UPDATE cad_clientes SET nome_cliente = ?, cpf = ?, telefone = ?, email = ? WHERE id_cliente = ?";
        await db.query(query, [nome_cliente, cpf, telefone, email, id]);
        res.json({ sucesso: true, mensagem: "Cliente atualizado com sucesso!" });
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: "Erro ao atualizar cliente." });
    }
});

// ROTA DELETE: Excluir um cliente
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = "DELETE FROM cad_clientes WHERE id_cliente = ?";
        await db.query(query, [id]);
        res.json({ sucesso: true, mensagem: "Cliente excluído com sucesso!" });
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: "Erro ao excluir cliente." });
    }
});

module.exports = router;