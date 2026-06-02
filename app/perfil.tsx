import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function PerfilScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [ocupacao, setOcupacao] = useState('');

  useEffect(() => {
    const carregar = async () => {
      const dados = await AsyncStorage.getItem('usuarioLogado');
      if (dados) {
        const usuario = JSON.parse(dados);
        setEmail(usuario.email || '');
        setNome(usuario.nome || '');
        setOcupacao(usuario.ocupacao || '');
      }
    };
    carregar();
  }, []);

  const salvar = async () => {
    const dadosAtuais = await AsyncStorage.getItem('usuarioLogado');
    const usuario = dadosAtuais ? JSON.parse(dadosAtuais) : {};
    const atualizado = { ...usuario, nome, email, ocupacao };

    await AsyncStorage.setItem('usuarioLogado', JSON.stringify(atualizado));

    const listaData = await AsyncStorage.getItem('usuarios');
    const lista = listaData ? JSON.parse(listaData) : [];
    const novaLista = lista.map((u: any) => u.id === usuario.id ? atualizado : u);
    await AsyncStorage.setItem('usuarios', JSON.stringify(novaLista));

    alert('Perfil salvo!');
  };

  const sair = async () => {
    await AsyncStorage.removeItem('usuarioLogado');
    router.replace('/login');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Meu perfil</Text>
      <View style={styles.profileCard}>
        <View style={styles.avatar} />
        <Text style={styles.profileName}>{nome || 'Sem nome'}</Text>
        <Text style={styles.profileEmail}>{email || 'Sem email'}</Text>
        <Text style={styles.profileOcupacao}>
          {ocupacao === 'tecnico' ? '🔧 Técnico' : ocupacao === 'profissional' ? '🩺 Profissional de saúde' : ''}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados pessoais</Text>
        <Text style={styles.inputLabel}>Nome completo</Text>
        <TextInput style={styles.input} placeholder="Nome completo" placeholderTextColor="#888" value={nome} onChangeText={setNome} />
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#888" value={email} onChangeText={setEmail} />

        <Text style={styles.inputLabel}>Ocupação</Text>
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

        <TouchableOpacity style={styles.saveButton} onPress={salvar}>
          <Text style={styles.saveText}>SALVAR</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={sair}>
        <Text style={styles.logoutText}>SAIR</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2a2a2a', padding: 16 },
  pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 8 },
  profileCard: { backgroundColor: '#333', borderRadius: 8, padding: 20, alignItems: 'center', marginBottom: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#2d5a8e', marginBottom: 12 },
  profileName: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  profileEmail: { fontSize: 13, color: '#aaa', marginTop: 4 },
  profileOcupacao: { fontSize: 13, color: '#4a90d9', marginTop: 6 },
  section: { backgroundColor: '#333', borderRadius: 8, padding: 12, marginBottom: 16 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#ccc', marginBottom: 10 },
  inputLabel: { fontSize: 13, color: '#aaa', marginBottom: 4, marginTop: 12 },
  input: { backgroundColor: '#444', borderRadius: 6, padding: 10, color: '#fff', fontSize: 14 },
  ocupacaoRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  ocupacaoBtn: { flex: 1, borderWidth: 1, borderColor: '#4a90d9', borderRadius: 8, padding: 14, alignItems: 'center' },
  ocupacaoBtnAtivo: { backgroundColor: '#4a90d9' },
  ocupacaoText: { color: '#4a90d9', fontWeight: 'bold', fontSize: 13 },
  ocupacaoTextAtivo: { color: '#fff' },
  saveButton: { backgroundColor: '#2d5a8e', borderRadius: 6, padding: 14, alignItems: 'center', marginTop: 16 },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  logoutButton: { backgroundColor: '#8e2d2d', borderRadius: 6, padding: 14, alignItems: 'center', marginTop: 20, marginBottom: 40 },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});