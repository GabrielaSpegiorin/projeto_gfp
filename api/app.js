import express from 'express';
import { testarConexao } from './db.js';
import cors from 'cors'
import rotasUsuarios, { autenticarToken } from './routes/rotasUsuarios.js';
import rotasCategorias from './routes/rotasCategorias.js';
import rotasSubCategorias from './routes/rotasSubCategorias.js';
import rotasContas from './routes/RotasContas.js';
import rotasTransacoes from './routes/RotasTransacoes.js';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';

const app = express()
testarConexao();

app.use(cors())
app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.get('/', (req, res) => {
    res.redirect('/api-docs')
})
//     res.send('API Funcionando!')
// })

//Rotas de usuarios  // CERTO✅
app.post('/usuarios', rotasUsuarios.novoUsuario)
app.get('/usuarios/:id_usuario', autenticarToken, rotasUsuarios.listarUsuariosPorID)
app.get('/usuarios', autenticarToken, rotasUsuarios.listarUsuarios)
app.delete('/usuarios/:id_usuario', autenticarToken,rotasUsuarios.deletar)
app.put('/usuarios/:id_usuario', autenticarToken,rotasUsuarios.atualizarTodos) //
app.patch('/usuarios/:id_usuario', autenticarToken, rotasUsuarios.atualizar) // 
app.post('/usuarios/login', rotasUsuarios.login)

//Rotas de categorias // CERTO
app.post('/categorias', rotasCategorias.novaCategoria)
app.get('/categorias/filtrarCategoria', autenticarToken, rotasCategorias.filtrarCategoria)
app.get('/categorias/:id_categoria', autenticarToken, rotasCategorias.listarCategoriasPorID)
app.get('/categorias', autenticarToken, rotasCategorias.listarCategorias)
app.delete('/categorias/:id_categoria', rotasCategorias.deletarCategoria)
app.put('/categorias/:id_categoria', rotasCategorias.atualizarTodosCategoria)
app.patch('/categorias/:id_categoria', rotasCategorias.atualizar)

//Rotas SubCategorias //CERTO
app.post('/subcategorias', rotasSubCategorias.novaSubCategoria)
app.get('/subcategorias',  rotasSubCategorias.listarSubCategorias)
app.get('/subcategorias/:id_subcategoria', rotasSubCategorias.listarSubCategoriasPorID)
app.put('/subcategorias/:id_subcategoria', rotasSubCategorias.atualizarTodosSubCategoria)
app.patch('/subcategorias/:id_subcategoria', rotasSubCategorias.atualizarSubCategoria)
app.delete('/subcategorias/:id_subcategoria', rotasSubCategorias.deletarSubCategoria)

//Rotas Contas //
app.post('/contas', rotasContas.novaContas)
app.get('/contas/filtrarCategoria', rotasContas.filtrarContas)
app.get('/contas', rotasContas.listarContas)
app.get('/contas/:id_usuario', rotasContas.listarContasPorID)  
app.patch('/contas/:id_conta', rotasContas.atualizarContas)
app.put('/contas/:id_conta', rotasContas.atualizarTodasContas)
app.delete('/contas/:id_conta', rotasContas.deletarContas)

//Rotas Transações //CERTO
app.get('/transacoes/filtroData', rotasTransacoes.filtrarPorData)
app.get('/transacoes/transacoesVencidas/id:usuario', rotasTransacoes.transacoesVencidas)
app.get('/transacoes/somarTransacoes', rotasTransacoes.somarTransacoes)
app.post('/transacoes', rotasTransacoes.novaTransacoes)
app.get('/transacoes', rotasTransacoes.listarTransacoes)
app.get('/transacoes/:id_transacao', rotasTransacoes.listarTransacoesPorID)  
app.patch('/transacoes/:id_transacao', rotasTransacoes.atualizarTransacoes)                
app.put('/transacoes/:id_transacao', rotasTransacoes.atualizarTodosTransacoes)
app.delete('/transacoes/:id_transacao', rotasTransacoes.deletarTransacoes)


//AGORA SÓ TESTAR TUDO NO POSTMAN E IR ARRUMANDO


const porta = 3000;
app.listen(porta, () => {
    console.log(`Api http://localhost:${porta}`)
})