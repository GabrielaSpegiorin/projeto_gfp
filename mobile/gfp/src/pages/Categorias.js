import React, { useState, useEffect, useLayoutEffect, use } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, RefreshControl, Modal, TextInput, Button } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Estilos, { corPrincipal } from '../style/Estilos';
import { enderecoServidor, listaCores, listaIcones } from "../utils";


export default function Categorias({ navigation }) {
    const [dadosLista, setDadosLista] = useState([]);
    const [usuario, setUsuario] = useState({});
    const [atualizando, setAtualizando] = useState(false);

    const [modalVisivel, setModalVisivel] = useState(false);
    const [nomeCategoria, setNomeCategoria] = useState('');
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);

    const [corModalVisible, setCorModalVisible] = useState(false);
    const [iconeModalVisible, setIconeModalVisible] = useState(false);
    const [cor, setCor] = useState('#ff80aa');
    const [icone, setIcone] = useState('wallet');
    const buscarDadosAPI = async () => {
        try {
            console.log('Entrou no buscarDadosAPI');
            console.log('usuario', usuario);
            const resposta = await fetch(`${enderecoServidor}/categorias`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${usuario.token}`,
                },
            });
            console.log('resposta', resposta);
            const dados = await resposta.json();
            console.log('dados', dados);
            setDadosLista(dados);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    }

    useEffect(() => {
        buscarUsuarioLogado();
    }, [])

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
        try {
            const resposta = await fetch(`${enderecoServidor}/categorias/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${usuario.token}`,
                },
            });

            if (resposta.ok) {
                buscarDadosAPI();
            }


        } catch (error) {
            console.error('Erro ao excluir:', error);
        }
    }


    const botaoEditar = async (item) => {
        setCategoriaSelecionada(item);
        setNomeCategoria(item.nome);
        setCor(item.cor);
        setIcone(item.icone);
        setModalVisivel(true);
    }

    const exibirItemlista = ({ item }) => {
        return (
            <TouchableOpacity style={Estilos.ItemLista}>
                <View style={{
                    backgroundColor: item.cor,
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    marginRight: 5,
                    alignItems: 'center',
                    justifyContent: 'center',

                }}>
                    <MaterialIcons name={item.icone} size={23} color={'#fff'} />
                </View>
                <View style={Estilos.textContainer}>
                    <Text style={Estilos.nomeLista}>{item.nome}</Text>
                    <Text>0,00</Text>
                </View>
                <MaterialIcons name='edit' size={24} color={Estilos.corPrincipal}
                    onPress={() => botaoEditar(item)}
                />
                <MaterialIcons name='delete' size={24} color={Estilos.corPrincipal}
                    onPress={() => botaoExcluir(item.id_categoria)}
                />
            </TouchableOpacity>
        )
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => setModalVisivel(true)}>
                    <MaterialIcons name='add' size={28} color="#fff"
                        style={{ marginRight: 15 }}
                    />
                </TouchableOpacity>
            )
        })
    }, [navigation])

    const botaoSalvar = async () => {
        try {
            const dados = {
                nome: nomeCategoria,
                tipo_transacao: 'SAIDA',
                id_usuario: usuario.id_usuario,
                icone: icone,
                cor: cor,
                ativo: true,
            }

            let endpoint = `${enderecoServidor}/categorias`;
            let metodo = 'POST';

            if (categoriaSelecionada) {
                endpoint = `${enderecoServidor}/categorias/${categoriaSelecionada.id_categoria}`;
                metodo = 'PUT';
            }

            const resposta = await fetch(endpoint, {
                method: metodo,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usuario.token}`
                },
                body: JSON.stringify(dados)
            })

            if (resposta.ok) {
                alert('Categoria salva com sucesso!');
                setModalVisivel(false);
                setNomeCategoria('');
                buscarDadosAPI();
                setCategoriaSelecionada(null);
            }

        } catch (error) {
            alert('Erro ao salvar categoria', error.message);
            console.error('Erro ao salvar categoria:', error);
        }
    }

    const botaoCancelar = () => {
        setModalVisivel(false);
        setCategoriaSelecionada(null);
        setNomeCategoria('');
    }

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
                            onRefresh={buscarDadosAPI} colors={[corPrincipal]} />
                    }
                />
            </View>
            <Modal visible={modalVisivel} transparent={true} animationType="slide"
                onRequestClose={() => setModalVisivel(false)}>
                <View style={Estilos.modalFundo}>
                    <View style={Estilos.modalConteudo}>
                        <Text style={Estilos.modalTitulo}> Categoria</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput style={Estilos.inputModal}
                                placeholder="Nome da Categoria"
                                placeholderTextColor={'#aaa'}
                                value={nomeCategoria}
                                onChangeText={setNomeCategoria}
                            />
                            <TouchableOpacity style={[Estilos.corBotao, { backgroundColor: cor }]} onPress={() => setCorModalVisible(true)} />
                            <TouchableOpacity style={Estilos.iconeBotao} onPress={() => setIconeModalVisible(true)}>
                                <MaterialIcons name={icone} size={24} color={'#fff'} />
                            </TouchableOpacity>


                        </View>
                        <View style={Estilos.modalBotoes}>
                            <Button title="Cancelar" onPress={botaoCancelar} />
                            <Button title="Salvar" onPress={botaoSalvar} />

                        </View>


                    </View>

                </View>

            </Modal>
            {/* Modal de seleção de cor */}
            <Modal
                visible={corModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setCorModalVisible(false)}>
                <View style={Estilos.modalFundo}>
                    <View style={Estilos.SeletorContainer}>
                        <Text style={Estilos.modalTitulo}>Escolha uma cor</Text>
                        <View style={Estilos.listaModal}>
                            {listaCores.map((corItem) => (
                                <TouchableOpacity
                                    key={corItem}
                                    style={[Estilos.corBotao, { backgroundColor: corItem }]}
                                    onPress={() => {
                                        setCor(corItem);
                                        setCorModalVisible(false);
                                    }}
                                />
                            ))}
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal de seleção de ícone */}
            <Modal
                visible={iconeModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIconeModalVisible(false)}>

                <View style={Estilos.modalFundo}>
                    <View style={Estilos.SeletorContainer}>
                        <Text style={Estilos.modalTitulo}>Escolha um ícone</Text>
                        <View style={Estilos.listaModal}>
                            {listaIcones.map((iconeItem) => (
                                <TouchableOpacity
                                    key={iconeItem}
                                    style={Estilos.iconeBotao}
                                    onPress={() => {
                                        setIcone(iconeItem);
                                        setIconeModalVisible(false);
                                    }}>
                                    <MaterialIcons name={iconeItem} size={24} color="#FFF" />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )



}