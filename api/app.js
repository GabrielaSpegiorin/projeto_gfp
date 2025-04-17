import express from 'express';
import { testarConexao } from './db.js';
import cors from 'cors'
import rotasUsuarios from './routes/rotasUsuarios.js';
import rotasCategorias from './routes/rotasCategorias.js';

const app = express()
testarConexao();

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('API Funcionando!')
})

//Rotas de usuarios
app.post('/usuarios', rotasUsuarios.novoUsuario)
app.get('/usuarios/:id_usuario', rotasUsuarios.listarUsuariosPorID)
app.get('/usuarios', rotasUsuarios.listarUsuarios)
app.delete('/usuarios/:id_usuario', rotasUsuarios.deletar)

app.put('/usuarios/:id_usuario', rotasUsuarios.atualizarTodos) 
app.patch('/usuarios/:id_usuario', rotasUsuarios.atualizar)
app.post('/usuarios/login', rotasUsuarios.login)

//Rotas de categorias
app.post('/categorias', rotasCategorias.novaCategoria)
app.get('/categorias/:id_categoria', rotasCategorias.listarCategoriasPorID)
app.get('/categorias', rotasCategorias.listarCategorias)
app.delete('/categorias/:id_categoria', rotasCategorias.deletarCategoria)

app.put('/categorias/:id_categoria', rotasCategorias.atualizarTodosCategoria)
app.patch('/categorias/:id_categoria', rotasCategorias.atualizar)

//Rotas SubCategorias
app.post('/subcategorias', rotasSubCategorias.novaSubCategoria)
app.get('/subcategorias',  rotasSubCategorias.listarSubCategorias)








const porta = 3000;
app.listen(porta, () => {
    console.log(`Api http://localhost:${porta}`)
})