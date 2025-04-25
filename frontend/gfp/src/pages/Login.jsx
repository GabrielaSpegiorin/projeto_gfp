import React, { useState } from "react";
import {useNavigate} from "react-router-dom"
import '../styles/Login.css'
import { enderecoServidor } from "../utils"


function Login () {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate()
 
  async function botaoEntrar(e) {
    e.preventDefault();

    try {
      if (email == '' || senha == '') {
        throw new Error('Preencha todos os campos')
      }
      //Autenticando utilizando a API de backend com o fetch
      const resposta = await fetch(`${enderecoServidor}/usuarios/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({
            email: email,
            senha: senha,
          })
        }
      )
      if (resposta.ok) {
        const dados = await resposta.json();
        navigate("/principal")
        localStorage.setItem('UsuarioLogado', JSON.stringify(dados))
      }else {
        throw new Error('Email ou senha incorretos ❌');
      }

    }catch (error) {
      console.error('Erro ao realizar login:', error);
      alert(error.message);
      return;
    }
  }
  function botaoLimpar() {
    setEmail('');
    setSenha('');
    setMensagem('');
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/SENAI_S%C3%A3o_Paulo_logo.png/1024px-SENAI_S%C3%A3o_Paulo_logo.png" alt="Logo SENAI" className="logo" />
        <h2>Login</h2>
        <div>
          <div className="input-group">
            <label>Email</label>
            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Digite seu email" required />
          </div>
          <div className="input-group">
            <label>Senha</label>
            <input onChange={(e) => setSenha(e.target.value)} value={senha} type="password" placeholder="Digite sua senha" required />
          </div>
          <button onClick={botaoEntrar} type="submit" className="login-button">Entrar</button>
          <button onClick={botaoLimpar} type="submit" className="login-button">Limpar</button>
        </div>
      </div>
    </div>
  );
}

export default Login;














// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function Login() {
//     const navigate = useNavigate();

//     const containerStyle = {
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: '100vh',
//         backgroundColor: '#f0f0f0',
//         padding: '20px',
//     };

//     const titleStyle = {
//         fontSize: '30px',
//         fontWeight: 'bold',
//         color: '#333',
//         marginBottom: '20px',
//     };

//     const buttonContainerStyle = {
//         display: 'flex',
//         justifyContent: 'center',
//         width: '100%',
//     };

//     const buttonStyle = {
//         padding: '10px 20px',
//         fontSize: '16px',
//         backgroundColor: 'purple',
//         color: 'white',
//         border: 'none',
//         borderRadius: '5px',
//         cursor: 'pointer',
//         transition: 'background-color 0.3s ease',
//     };

//     const buttonHoverStyle = {
//         backgroundColor: 'green',
//     };

//     return (
//         <div style={containerStyle}>
//             <h1 style={titleStyle}>Tela de Login</h1>
//             <div style={buttonContainerStyle}>
//                 <button
//                     style={buttonStyle}
//                     onClick={() => navigate('/principal')}
//                     onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
//                     onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
//                 >
//                     Entrar
//                 </button>
//             </div>
//         </div>
//     );
// }

  