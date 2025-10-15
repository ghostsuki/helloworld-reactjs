const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/', async (req, res) => {
    const connection = await db.getConnection();
    
    try {
        const { id_cliente, valor_total, itens } = req.body;

        if (!itens || itens.length === 0) {
            return res.status(400).json({ sucesso: false, mensagem: "A venda deve conter pelo menos um item." });
        }

        await connection.beginTransaction();

        for (const item of itens) {
            const [rows] = await connection.query("SELECT estoque FROM cad_prod WHERE id_produto = ?", [item.id_produto]);
            
            if (rows.length === 0 || rows[0].estoque < item.quantidade) {
                throw new Error(`Estoque insuficiente para o produto ID ${item.id_produto}. Em estoque: ${rows[0]?.estoque || 0}, Tentando vender: ${item.quantidade}`);
            }
        }

        const vendaQuery = "INSERT INTO cad_vendas (id_cliente, id_usuario, valor_total) VALUES (?, ?, ?)";
        
        await connection.query(vendaQuery, [id_cliente || null, null, valor_total]);

        for (const item of itens) {
            const estoqueQuery = "UPDATE cad_prod SET estoque = estoque - ? WHERE id_produto = ?";
            await connection.query(estoqueQuery, [item.quantidade, item.id_produto]);
        }

        await connection.commit();
        res.status(201).json({ sucesso: true, mensagem: "Venda registrada e estoque atualizado com sucesso!" });

    } catch (error) {
        await connection.rollback();
        console.error("Erro na transação de venda:", error);
        res.status(500).json({ sucesso: false, mensagem: "Erro ao registrar a venda: " + error.message });

    } finally {
        connection.release();
    }
});

module.exports = router;