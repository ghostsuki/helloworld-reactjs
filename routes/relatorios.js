// routes/relatorios.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ROTA GET: Buscar vendas por período
router.get('/', async (req, res) => {
    try {
        const periodo = req.query.periodo || 'dia'; 
        let query = "";

        const baseQuery = `
            SELECT 
                v.id_venda,
                v.data_venda,
                v.valor_total,
                c.nome_cliente 
            FROM cad_vendas v
            LEFT JOIN cad_clientes c ON v.id_cliente = c.id_cliente
        `;

        switch (periodo) {
            case 'semana':
                // Busca vendas da semana atual (considerando Domingo como início da semana)
                query = `${baseQuery} WHERE YEARWEEK(v.data_venda, 0) = YEARWEEK(CURDATE(), 0)`;
                break;
            case 'mes':
                // Busca vendas do mês atual
                query = `${baseQuery} WHERE MONTH(v.data_venda) = MONTH(CURDATE()) AND YEAR(v.data_venda) = YEAR(CURDATE())`;
                break;
            case 'dia':
            default:
                // Busca vendas do dia atual
                query = `${baseQuery} WHERE DATE(v.data_venda) = CURDATE()`;
                break;
        }

        query += " ORDER BY v.data_venda DESC"; // Ordena as vendas da mais recente para a mais antiga

        const [vendas] = await db.query(query);
        res.json(vendas);

    } catch (error) {
        console.error("Erro ao buscar relatório de vendas:", error);
        res.status(500).json({ sucesso: false, mensagem: "Erro ao buscar relatório." });
    }
});

module.exports = router;