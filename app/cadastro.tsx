import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CadastroScreen() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [ocupacao, setOcupacao] = useState('');

  useFocusEffect(
    useCallback(() => {
      setNome('');
      setEmail('');
      setSenha('');
      setConfirmarSenha('');
      setOcupacao('');
    }, [])
  );

  const handleCadastro = async () => {
    if (!nome || !email || !senha || !confirmarSenha || !ocupacao) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem!');
      return;
    }

    const dados = await AsyncStorage.getItem('usuarios');
    const usuarios = dados ? JSON.parse(dados) : [];

    const jaExiste = usuarios.find((u: any) => u.email === email);
    if (jaExiste) {
      Alert.alert('Erro', 'Este email já está cadastrado!');
      return;
    }

    const novoUsuario = { id: Date.now().toString(), nome, email, senha, ocupacao };
    usuarios.push(novoUsuario);
    await AsyncStorage.setItem('usuarios', JSON.stringify(usuarios));

    Alert.alert('Sucesso', 'Conta criada com sucesso!', [
      { text: 'OK', onPress: () => router.replace('/login') }
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Criar conta</Text>

      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Nome completo" placeholderTextColor="#888" value={nome} onChangeText={setNome} />
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#888" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#888" secureTextEntry value={senha} onChangeText={setSenha} />
        <TextInput style={styles.input} placeholder="Confirmar senha" placeholderTextColor="#888" secureTextEntry value={confirmarSenha} onChangeText={setConfirmarSenha} />

        <Text style={styles.label}>Selecione sua ocupação:</Text>
        <View style={styles.ocupacaoRow}>
          <TouchableOpacity
            style={[styles.ocupacaoBtn, ocupacao === 'tecnico' && styles.ocupacaoBtnAtivo]}
            onPress={() => setOcupacao('tecnico')}
          >
            <Text style={[styles.ocupacaoText, ocupacao === 'tecnico' && styles.ocupacaoTextAtivo]}>🔧 Técnico</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.ocupacaoBtn, ocupacao === 'profissional' && styles.ocupacaoBtnAtivo]}
            onPress={() => setOcupacao('profissional')}
          >
            <Text style={[styles.ocupacaoText, ocupacao === 'profissional' && styles.ocupacaoTextAtivo]}>🩺 Profissional de saúde</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleCadastro}>
          <Text style={styles.buttonText}>CADASTRAR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSecondary} onPress={() => router.back()}>
          <Text style={styles.buttonSecondaryText}>Voltar para o login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a3a5c' },
  content: { justifyContent: 'center', padding: 32, flexGrow: 1 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 32 },
  form: { gap: 12 },
  input: { backgroundColor: '#2a5080', borderRadius: 8, padding: 14, color: '#fff', fontSize: 14 },
  label: { fontSize: 13, color: '#aaa', marginTop: 4 },
  ocupacaoRow: { flexDirection: 'row', gap: 10 },
  ocupacaoBtn: { flex: 1, borderWidth: 1, borderColor: '#4a90d9', borderRadius: 8, padding: 14, alignItems: 'center' },
  ocupacaoBtnAtivo: { backgroundColor: '#4a90d9' },
  ocupacaoText: { color: '#4a90d9', fontWeight: 'bold', fontSize: 13 },
  ocupacaoTextAtivo: { color: '#fff' },
  button: { backgroundColor: '#4a90d9', borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  buttonSecondary: { borderWidth: 1, borderColor: '#4a90d9', borderRadius: 8, padding: 16, alignItems: 'center' },
  buttonSecondaryText: { color: '#4a90d9', fontWeight: 'bold', fontSize: 15 },
});