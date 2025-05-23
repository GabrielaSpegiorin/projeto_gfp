import React, { useState, useEffect, useLayoutEffect, use } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, RefreshControl} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Estilos, { corPrincipal } from '../style/Estilos';
import { enderecoServidor } from "../utils";


export default function Categorias({navigation}) {
    const [dadosLista, setDadosLista] = useState([]);
    const [usuario, setUsuario] = useState({});
    const [atualizando, setAtualizando] = useState(false);


    const buscarDadosAPI = async () => {
        try{
            console.log('Entrou no buscarDadosAPI');
            console.log('usuario', usuario);
            const resposta = await fetch (`${enderecoServidor}/categorias`,{
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${usuario.token}`,
                },
            });
            console.log('resposta', resposta);
            const dados = await resposta.json();
            console.log('dados', dados);
            setDadosLista(dados);
        }catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    }

    useEffect(() => {
        buscarUsuarioLogado();
    },[])

    useEffect(() => {
        buscarDadosAPI();
    }, [usuario]);

    
      const buscarUsuarioLogado = async () => {
        console.log('Entrou no buscarUsuarioLogado');
        const usuarioLogado = await AsyncStorage.getItem('UsuarioLogado');
        if (usuarioLogado) {
                setUsuario(JSON.parse(usuarioLogado));
            } else {
                navigation.navigate('Login');
            }
      }
    
    const botaoExcluir = async (id) => {
        try{
             const resposta = await fetch (`${enderecoServidor}/categorias/${id}`,{
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${usuario.token}`,
                },
            });

            if (resposta.ok) {
                buscarDadosAPI();
            }


        }catch (error) {
            console.error('Erro ao excluir:', error);
        }
    }

    const exibirItemlista = ({item}) => {
        return (
            <TouchableOpacity style={Estilos.ItemLista}>
                <View style = {{
                    backgroundColor: 'black',
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',

                }}>
                    <MaterialIcons name = {item.icone} size={23} color={'#fff'} />
                </View>
                <View style = {Estilos.textContainer}>
                    <Text style = {Estilos.nomeLista}>{item.nome}</Text>
                    <Text>0,00</Text>
                </View>
            <MaterialIcons name = 'edit' size={24} color={Estilos.corPrincipal} 
            onPress={() => navigation.navigate('Categorias', {Categoria: item})}/>
            <MaterialIcons name = 'delete' size={24} color={Estilos.corPrincipal} 
            onPress={() => botaoExcluir (item.id_categoria)} 
            />           
            </TouchableOpacity>
        )
    }

    useLayoutEffect(() => {
        navigation.setOptions ({
            headerRight: () => ( 
                <TouchableOpacity onPress={() => navigation.navigate('Categorias')}>
        <MaterialIcons name='add' size={28} color = "#fff" style = {{marginRight: 15}} />
                </TouchableOpacity>
            )
    })
    }, [navigation])

    return (
        <View style={Estilos.conteudoHeader}>
            <View style={Estilos.conteudoCorpo}>
            <FlatList
                data={dadosLista}
                renderItem={exibirItemlista}
                keyExtractor={(item) => item.id_categoria}
                refreshControl={
                    <RefreshControl
                        refreshing={atualizando}
                        onRefresh={buscarDadosAPI} colors={[corPrincipal]}/> 
                }
            />
            </View>
        </View>
    )



}