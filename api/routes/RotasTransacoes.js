import { BD } from '../db.js';

class rotasTransacoes {
    //nova Transação
    static async novaTransacoes(req, res) {
        const { id_usuario, id_categoria, id_subcategoria, valor } = req.body;
        try {
            const transacao = await BD.query(`INSERT INTO transacoes (id_usuario, id_categoria, id_subcategoria, valor)
                    VALUES ($1, $2, $3, $4)`,
                [id_usuario, id_categoria, id_subcategoria, valor]);
            res.status(201).json(transacao); //retorna o usuario criado com status 201
        }
        catch (error) {
            console.error('Erro ao criar a transação', error);
            res.status(500).json({ message: 'Erro ao criar transação', error: error.message });
        }
    }

    //listar transações
    static async listarTransacoes(req, res) {
        try {
            const transacoes = await BD.query('SELECT * FROM transacoes');
            res.status(200).json(transacoes.rows); //retorna os produtos com status 200
        }
        catch (error) {
            res.status(500).json({ message: 'Erro ao listar transações', error: error.message });
        }
    }

    //listar transações por id
    static async listarTransacoesPorID(req, res) {
        const { id_transacao } = req.params;
        try {
            const transacao = await BD.query('SELECT * FROM transacoes WHERE id_transacao = $1', [id_transacao]);
            res.status(200).json(transacao.rows);
        }
        catch (error) {
            res.status(500).json({ message: "Erro ao consultar a transação", error: error.message });
        }
    }

    //atualizar transações
    static async atualizarTransacoes(req, res) {
        const { id_transacao } = req.params;
        const { id_usuario, id_categoria, id_subcategoria, valor } = req.body;
        try {
            const transacao = await BD.query(`UPDATE transacoes SET id_usuario = $1, id_categoria 
    = $2, id_subcategoria = $3, valor = $4 WHERE id_transacao = $5`,
                [id_usuario, id_categoria, id_subcategoria, valor, id_transacao]);
            res.status(200).json(transacao.rows); //retorna o usuario criado com status 201
        }
        catch (error) {
            console.error('Erro ao atualizar a transação', error);
            res.status(500).json({ message: 'Erro ao atualizar transação', error: error.message });
        }
    }

    //atualizar todos os campos da transação
    static async atualizarTodosTransacoes(req, res) {
        const { id_transacao } = req.params;
        const { id_usuario, id_categoria, id_subcategoria, valor } = req.body;
        try {
            const transacao = await BD.query(`UPDATE transacoes SET id_usuario = $1, id_categoria 
    = $2, id_subcategoria = $3, valor = $4 WHERE id_transacao = $5`,
                [id_usuario, id_categoria, id_subcategoria, valor, id_transacao]);
            res.status(200).json(transacao.rows); //retorna o usuario criado com status 201
        }
        catch (error) {
            console.error('Erro ao atualizar a transação', error);
            res.status(500).json({ message: 'Erro ao atualizar transação', error: error.message });
        }
    }

    //deletar transações
    static async deletarTransacoes(req, res) {
        const { id_transacao } = req.params;
        try {
            const transacao = await BD.query('DELETE FROM transacoes WHERE id_transacao = $1', [id_transacao]);
            if (transacao.rowCount === 0) {
                return res.status(404).json({ message: 'Transação não encontrada' });
            }
            res.status(200).json({ message: 'Transação deletada com sucesso' });
        }
        catch (error) {
            console.error('Erro ao deletar a transação', error);
            res.status(500).json({ message: 'Erro ao deletar transação', error: error.message });
        }
    }

    // Criar uma rota que permite filtrar transações por data de vencimento ou data de pagamento 
    //dentro de um intervalo específico

    static async filtrarPorData(req, res) {
        const { data_inicio, data_fim, tipo_data } = req.query;

        let colunaData;
        if (tipo_data == 'vencimento') {
            colunaData = 'data_vencimento';
        }
        else if (tipo_data == 'pagamento') {
            colunaData = 'data_pagamento';
        } else {
            return res.status(400).json({
                message: 'Tipo_data inválido, use vencimento ou pagamento'
            });
        }
        try {
            const query = `
            SELECT t.*, u.nome AS nome_usuario, ct.nome
         FROM transacoes AS t 
         LEFT JOIN usuarios AS u ON t.id_usuario = u.id_usuario
         JOIN contas ct ON t.id_conta = ct.id_conta
         WHERE ${colunaData} BETWEEN $1 AND $2
         ORDER BY ${colunaData} ASC
         `

            const transacoes = await BD.query(query, [data_inicio, data_fim]);

            res.status(200).json(transacoes.rows);
        } catch (error) {
            console.error('Erro ao filtrar transação', error);
            res.status(500).json({ message: 'Erro ao filtrar transação', error: error.message });
        }
    }

    //somandotransacoes entrada ou saida

    static async somarTransacoes(req, res) {
        const { tipo, id_usuario } = req.query;
        try {
            const tipoTransacao = tipo.toUpperCase();

            const query = `
        SELECT SUM(valor) AS total
        FROM transacoes
        WHERE tipo_transacao = $1 AND id_usuario = $2 
        `

            const resultado = await BD.query(query, [tipoTransacao, id_usuario])

            let total = resultado.rows[0].total;
            if (total === null) 
            {
                total = 0;
            }
            res.status(200).json({ total: parseFloat(total)});
        } catch (error) {
            console.error('Erro ao somar transacoes', error);
            res.status(500).json({ message: 'Erro ao somar transacoes', error: error.message });


        }
    }

    static async transacoesVencidas(req, res) {
        const { data_atual } = req.params;
        try{
            const query = `
            SELECT t.valor, t.data_transação, t.data_vencimento, t.data_pagamento, 
            u.nome AS nome_usuario,
            c. nome AS nome_conta,
            ct.nome AS nome_categoria,
            sct.nome AS nome_subcategoria
            FROM transacoes AS t
            LEFT JOIN usuarios u ON t.id_usuario = u.id_usuario
            LEFT JOIN contas c ON t.id_conta = c.id_conta
            LEFT JOIN categorias ct ON t.id_categoria = ct.id_categoria
            LEFT JOIN subcategorias sct ON t.id_subcategoria = sct.id_subcategoria
            WHERE t.data_vencimento < CURRENT_DATE    --filtra transações vencidas
            AND t.id_usuario = $1
            ORDER BY t.data_vencimento ASC

            `

            const resultados = await BD.query(query, [id_usuario]);
    //Função para formatar data
            const formatarDataBr = (data) => {
                if (!data) return null
                return new Date (data).toLocaleDateString('pt-BR') //converte a data no padrao BR
        }

            const dadosFormatados = resultados.rows.map(t => ({
                ...t,
                data_transação: formatarDataBr(t.data_transação),
                data_pagamento: formatarDataBr(t.data_pagamento),
                data_vencimento: formatarDataBr(t.data_vencimento),
            }))
res.status(200).json(dadosFormatados);

        }catch (error) {
            console.error('Erro ao buscar transações vencidas:', error);
            res.status(500).json({ message: 'Erro ao buscar transações vencidas', error: error.message });
        }
      
    }

}

export default rotasTransacoes;