// routes/produtos.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Listar todos os produtos
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT p.*, f.nome_fantasia 
            FROM cad_prod p 
            LEFT JOIN cad_fornecedores f ON p.id_fornecedor = f.id_fornecedor
        `;
        const [produtos] = await db.query(query);
        res.json(produtos);
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao buscar produtos" });
    }
});

// Cadastrar um novo produto
router.post('/', async (req, res) => {
    try {
        const { nome_produto, preco_venda, estoque, id_fornecedor } = req.body;
        const query = "INSERT INTO cad_prod (nome_produto, preco_venda, estoque, id_fornecedor) VALUES (?, ?, ?, ?)";
        await db.query(query, [nome_produto, preco_venda, estoque, id_fornecedor || null]);
        res.status(201).json({ sucesso: true, mensagem: "Produto cadastrado!" });
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: "Erro ao cadastrar." });
    }
});

// Atualizar um produto
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome_produto, preco_venda, estoque, id_fornecedor } = req.body;
        const query = "UPDATE cad_prod SET nome_produto = ?, preco_venda = ?, estoque = ?, id_fornecedor = ? WHERE id_produto = ?";
        await db.query(query, [nome_produto, preco_venda, estoque, id_fornecedor || null, id]);
        res.json({ sucesso: true, mensagem: "Produto atualizado!" });
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: "Erro ao atualizar." });
    }
});

// Excluir um produto
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = "DELETE FROM cad_prod WHERE id_produto = ?";
        await db.query(query, [id]);
        res.json({ sucesso: true, mensagem: "Produto excluído!" });
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: "Erro ao excluir." });
    }
});

module.exports = router;