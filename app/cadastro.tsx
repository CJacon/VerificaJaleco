import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function CadastroScreen() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [ocupacao, setOcupacao] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setNome('');
      setEmail('');
      setSenha('');
      setConfirmarSenha('');
      setOcupacao('');
      setMostrarSenha(false);
      setMostrarConfirmar(false);
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
      { text: 'OK', onPress: () => router.replace('/login') },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>VJ</Text>
          </View>
          <Text style={styles.logoTitle}>VERIFICA JALECOS</Text>
          <Text style={styles.logoSubtitle}>Crie sua conta para começar</Text>
        </View>

        {/* Formulário */}
        <View style={styles.form}>

          {/* Nome */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor="#888"
              autoCapitalize="words"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Senha */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#888"
              secureTextEntry={!mostrarSenha}
              value={senha}
              onChangeText={setSenha}
            />
            <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)} style={styles.eyeIcon}>
              <Ionicons name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'} size={20} color="#888" />
            </TouchableOpacity>
          </View>

          {/* Confirmar senha */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirmar senha"
              placeholderTextColor="#888"
              secureTextEntry={!mostrarConfirmar}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />
            <TouchableOpacity onPress={() => setMostrarConfirmar(!mostrarConfirmar)} style={styles.eyeIcon}>
              <Ionicons name={mostrarConfirmar ? 'eye-off-outline' : 'eye-outline'} size={20} color="#888" />
            </TouchableOpacity>
          </View>

          {/* Ocupação */}
          <Text style={styles.label}>Selecione sua ocupação:</Text>
          <View style={styles.ocupacaoRow}>
            <TouchableOpacity
              style={[styles.ocupacaoBtn, ocupacao === 'tecnico' && styles.ocupacaoBtnAtivo]}
              onPress={() => setOcupacao('tecnico')}
            >
              <Ionicons
                name="construct-outline"
                size={22}
                color={ocupacao === 'tecnico' ? '#fff' : '#4a90d9'}
              />
              <Text style={[styles.ocupacaoText, ocupacao === 'tecnico' && styles.ocupacaoTextAtivo]}>
                Técnico
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.ocupacaoBtn, ocupacao === 'profissional' && styles.ocupacaoBtnAtivo]}
              onPress={() => setOcupacao('profissional')}
            >
              <Ionicons
                name="medkit-outline"
                size={22}
                color={ocupacao === 'profissional' ? '#fff' : '#4a90d9'}
              />
              <Text style={[styles.ocupacaoText, ocupacao === 'profissional' && styles.ocupacaoTextAtivo]}>
                Profissional de saúde
              </Text>
            </TouchableOpacity>
          </View>

          {/* Botão principal */}
          <TouchableOpacity style={styles.button} onPress={handleCadastro}>
            <Ionicons name="person-add-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}> CADASTRAR</Text>
          </TouchableOpacity>

          {/* Botão voltar */}
          <TouchableOpacity style={styles.buttonSecondary} onPress={() => router.back()}>
            <Ionicons name="arrow-back-outline" size={20} color="#4a90d9" />
            <Text style={styles.buttonSecondaryText}> Voltar para o login</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a3a5c' },
  content: { justifyContent: 'center', padding: 32, flexGrow: 1 },

  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logo: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  logoText: { fontSize: 28, fontWeight: 'bold', color: '#1a3a5c' },
  logoTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', letterSpacing: 2 },
  logoSubtitle: { fontSize: 12, color: '#aac4e0', marginTop: 6, textAlign: 'center' },

  form: { gap: 12 },

  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2a5080', borderRadius: 10, paddingHorizontal: 14 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, padding: 14, color: '#fff', fontSize: 14 },
  eyeIcon: { padding: 8 },

  label: { fontSize: 13, color: '#aaa', marginTop: 4 },
  ocupacaoRow: { flexDirection: 'row', gap: 10 },
  ocupacaoBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#4a90d9', borderRadius: 10, padding: 14 },
  ocupacaoBtnAtivo: { backgroundColor: '#4a90d9' },
  ocupacaoText: { color: '#4a90d9', fontWeight: 'bold', fontSize: 13 },
  ocupacaoTextAtivo: { color: '#fff' },

  button: { backgroundColor: '#4a90d9', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 8, flexDirection: 'row', justifyContent: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  buttonSecondary: { borderWidth: 1, borderColor: '#4a90d9', borderRadius: 10, padding: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  buttonSecondaryText: { color: '#4a90d9', fontWeight: 'bold', fontSize: 15 },
});