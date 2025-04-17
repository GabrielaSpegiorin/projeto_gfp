import {BD} from '../db.js';

class rotasSubCategorias{
    //nova Subcategoria
    static async novaSubCategoria(req,res){
        const{ nome, id_categoria} = req.body;
        try{
            const subcategoria = await BD.query(`INSERT INTO subcategorias (nome, id_categoria)
                    VALUES ($1, $2)`,
                    [nome, id_categoria])
            res.status(201).json(subcategoria);// retorna o usuario criado com status 201
        }catch(error){
            console.error('Erro ao criar a subcategoria', error);
            res.status(500).json({message: 'Erros ao criar subcategoria', error: error.message});
        }
    }
}

export default rotasSubCategorias;