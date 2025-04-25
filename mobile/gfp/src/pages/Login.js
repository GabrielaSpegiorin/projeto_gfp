import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import { enderecoServidor } from '../utils'; // Importando o endereço do servidor
import * as Animar from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importando AsyncStorage

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function botaoEntrar() {
    try {
      if (email === '' || senha === '') {
        throw new Error('Preencha todos os campos!');
      }
      
      // Autenticando utilizando a API de backend com o fetch
      const resposta = await fetch(`${enderecoServidor}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          senha: senha,
        }),
      });

      if (resposta.ok) {
        const dados = await resposta.json();
        
        // Salvando o usuário logado no AsyncStorage
        await AsyncStorage.setItem('UsuarioLogado', JSON.stringify(dados));

        // Navegando para a tela principal
        navigation.navigate('Principal');
      } else {
        throw new Error('Email ou senha incorretos! ❌');
      }
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      alert(error.message); // Exibe a mensagem de erro para o usuário
    }
  }

  return (
    <View style={styles.conteudoHeader}>
      <Animar.View animation="fadeInLeft" delay={500} style={styles.header}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerText}>Bem-vindo(a)</Text>
      </Animar.View>
      
      <Animar.View animation="fadeInUp" style={styles.conteudoCorpo}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          placeholder="Digite um email..."
          style={styles.inputLogin}
          onChangeText={setEmail}
          value={email}
        />
        
        <Text style={styles.label}>Senha:</Text>
        <TextInput
          placeholder="Digite sua senha"
          style={styles.inputLogin}
          secureTextEntry={true}
          onChangeText={setSenha}
          value={senha}
        />

        <TouchableOpacity style={styles.botao} onPress={botaoEntrar}>
          <Text style={styles.textoBotao}>Acessar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('MenuTopTab')}>
          <Text style={styles.textoBotao}>Top Tabs</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('MenuBottomTab')}>
          <Text style={styles.textoBotao}>Bottom Tabs</Text>
        </TouchableOpacity>
      </Animar.View>
    </View>
  );
};

export default Login


const corPrincipal = '#0055ff'
const corBranco = '#fff'


const styles = StyleSheet.create({
    conteudoHeader: {
        flex: 1,
        backgroundColor: corPrincipal
    },
    header: {
        flex: 1,
        marginTop: '14%',
        marginBottom: '8%',
        paddingStart: '5%',
        flexDirection: 'row'
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: corBranco
    },
    conteudoCorpo: {
        flex: 2,
        backgroundColor: corBranco,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingHorizontal: '5%',
        paddingTop: '2%',
    },
    logo : {
        width: 30,
        height: 30,
        marginRight: 20
    },
    label: {
        fontSize: 20,
        marginTop: 28
    },
    inputLogin: {
        borderBottomWidth: 1,
        height: 40,
        fontSize: 16
    },
    botao: {
        backgroundColor: corPrincipal,
        borderRadius: 4,
        paddingVertical: 8,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        borderColor: corBranco,
        borderWidth: 2
    },
    textoBotao: {
        fontSize: 18,
        color: corBranco,
        fontWeight: 'bold'
    },
})




















// export default function Login({ navigation }) {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Login</Text>
//       <View style={styles.buttonContainer}>
//         <Button
//           title="Entrar"
//           onPress={() => navigation.navigate('MenuDrawer')}
//           color="green"
//         />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   buttonContainer: {
//     width: '60%',
//   },
// });









