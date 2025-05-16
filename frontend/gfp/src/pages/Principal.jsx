import React,  { useState, useEffect, use } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Principal() {
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const buscarUsuario = () => {
            const usuarioLogado = localStorage.getItem('UsuarioLogado');
            if (usuarioLogado) {
                setUsuario(JSON.parse(usuarioLogado));
            } else {
                navigate('/');
            }
        };
        buscarUsuario();
    }, []);
    const botaoLogout = () => {
        try {
            localStorage.removeItem('UsuarioLogado');
            setUsuario(null);
            navigate('/');
        } catch (error) {
           console.error('Erro ao deslogar:', error);
        }
    };
    
    return (
        <h1> Tela Principal</h1>
    );
}