import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    const dados = await AsyncStorage.getItem('usuarios');
    const usuarios = dados ? JSON.parse(dados) : [];

    const usuario = usuarios.find(
      (u: any) => u.email === email && u.senha === senha
    );

    if (!usuario) {
      Alert.alert('Erro', 'Email ou senha incorretos!');
      return;
    }

    await AsyncStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>VJ</Text>
        </View>
        <Text style={styles.logoTitle}>VERIFICA JALECOS</Text>
        <Text style={styles.logoSubtitle}>Sistema de monitoramento de biossegurança</Text>
      </View>

      <View style={styles.form}>
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

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Ionicons name="log-in-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}> ENTRAR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSecondary} onPress={() => router.push('/cadastro')}>
          <Ionicons name="person-add-outline" size={20} color="#4a90d9" />
          <Text style={styles.buttonSecondaryText}> Criar conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a3a5c', justifyContent: 'center', padding: 32 },
  logoContainer: { alignItems: 'center', marginBottom: 48 },
  logo: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  logoText: { fontSize: 28, fontWeight: 'bold', color: '#1a3a5c' },
  logoTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', letterSpacing: 2 },
  logoSubtitle: { fontSize: 12, color: '#aac4e0', marginTop: 6, textAlign: 'center' },
  form: { gap: 12 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2a5080', borderRadius: 10, paddingHorizontal: 14 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, padding: 14, color: '#fff', fontSize: 14 },
  eyeIcon: { padding: 8 },
  button: { backgroundColor: '#4a90d9', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 8, flexDirection: 'row', justifyContent: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  buttonSecondary: { borderWidth: 1, borderColor: '#4a90d9', borderRadius: 10, padding: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  buttonSecondaryText: { color: '#4a90d9', fontWeight: 'bold', fontSize: 15 },
});