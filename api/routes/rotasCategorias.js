import {BD} from '../db.js';

class rotasCategorias{
    //nova categoria
    static async novaCategoria(req,res){
        const{ nome, tipo_transacao, gasto_fixo, ativo, id_usuario} = req.body;

        try{
        //chama o metodo na classe produto para criar um novo produto
            //const produtos = await Produto.listar();
            const categoria = await BD.query(`INSERT INTO categorias (nome, tipo_transacao, gasto_fixo, ativo, id_usuario)
                    VALUES($1, $2, $3, $4, $5)`,
                    [nome, tipo_transacao, gasto_fixo, ativo, id_usuario])
            res.status(201).json(categoria);// retorna o usuario criado com status 201
        }catch(error){
            console.error('Erro ao criar a categoria', error);
            res.status(500).json({message: 'Erros ao criar categoria', error: error.message});
        }
    }

    //listar categoria
    static async listarCategorias(req,res){
        try{
            const categorias = await BD.query('SELECT * FROM categorias WHERE ativo = true');
            res.status(200).json(categorias.rows); //retorna os produtos com status 200
        }catch(error){
            res.status(500).json({message: 'Erro ao listar categorias', error: error.message});
        }
    }

    //listar categoria por id
    static async listarCategoriasPorID(req, res) {  
        const { id_categoria } = req.params;
       
        try{
            const categoria = await BD.query('SELECT * FROM categorias WHERE id_categoria = $1', [id_categoria]);
            res.status(200).json(categoria.rows);   
        }catch(error){
            res.status(500).json({message: "Erro ao consultar a categoria", error: error.message});
        }

}

    //atualizar categoria
    static async atualizar(req,res){ 
        const {id_categoria} = req.params;      
        const {nome, tipo_transacao, gasto_fixo, ativo} = req.body;
        try{
            const categoria = await BD.query ('UPDATE categorias SET nome = $1, tipo_transacao = $2, gasto_fixo = $3, ativo = $4 WHERE id_categoria = $5 RETURNING *',
                [nome, tipo_transacao, gasto_fixo, ativo, id_categoria] 
            )
            res.status(200).json(categoria.rows)
        }catch(error){
            res.status(500).json({message: "Erro ao atualizar a categoria", error: error.menssage})
        }
    }

    //deletar categoria
    static async deletarCategoria(req, res) { 
        const { id_categoria } =req.params;
        try{
            const categoria = await BD.query('UPDATE categorias set ativo = false WHERE id_categoria = $1', [id_categoria])
            return res.status(200).json({message: "Categoria desativada com sucesso"})
        }catch(error){
            res.status(500).json({message: "Erro ao desativar categoria", error: error.mensage})    
        }
    }


    //atualizar todos os dados da categoria
    static async atualizarTodosCategoria(req,res){ 
        const {id_categoria} = req.params;                                                                          
        const {nome, tipo_transacao, gasto_fixo, ativo} = req.body;
        try{
            const categoria = await BD.query ('UPDATE categorias SET nome = $1, tipo_transacao = $2, gasto_fixo = $3, ativo = $4 WHERE id_categoria = $5 RETURNING *',
                [nome, tipo_transacao, gasto_fixo, ativo, id_categoria] 
            )
            res.status(200).json(categoria.rows)
        }catch(error){
            res.status(500).json({message: "Erro ao atualizar a categoria", error: error.menssage})
        }
    }

    //Filtrar por tipo de categoria
    static async filtrarCategoria(req, res) {
        const {tipo_transacao} = req.query;

    try {
        const query = `
        SELECT * FROM categorias 
        WHERE tipo_transacao = $1 AND ativo = true
        ORDER BY nome DESC`

        const valores = [tipo_transacao]

        const resposta = await BD.query(query, valores)
        return res.status(200).json(resposta.rows)
    
    }catch (error) {
        console.error('Erro ao filtrar as categorias', error);
        res.status(500).json({ message: 'Erro ao filtrar categorias', error: error.message });

    }
}
}
export default rotasCategorias;