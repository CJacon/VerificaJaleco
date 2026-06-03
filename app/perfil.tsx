import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function PerfilScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [ocupacao, setOcupacao] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [usuarioLogado, setUsuarioLogado] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [])
  );

  const carregar = async () => {
    const dados = await AsyncStorage.getItem('usuarioLogado');
    if (dados) {
      const usuario = JSON.parse(dados);
      setUsuarioLogado(usuario);
      setEmail(usuario.email || '');
      setNome(usuario.nome || '');
      setOcupacao(usuario.ocupacao || '');
    }

    const listaData = await AsyncStorage.getItem('usuarios');
    if (listaData) setUsuarios(JSON.parse(listaData));
  };

  const salvar = async () => {
    const atualizado = { ...usuarioLogado, nome, email, ocupacao };
    await AsyncStorage.setItem('usuarioLogado', JSON.stringify(atualizado));

    const listaData = await AsyncStorage.getItem('usuarios');
    const lista = listaData ? JSON.parse(listaData) : [];
    const novaLista = lista.map((u: any) => u.id === usuarioLogado.id ? atualizado : u);
    await AsyncStorage.setItem('usuarios', JSON.stringify(novaLista));

    setUsuarioLogado(atualizado);
    setUsuarios(novaLista);
    Alert.alert('Sucesso', 'Perfil salvo!');
  };

  const alterarSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirmarNovaSenha) {
      Alert.alert('Erro', 'Preencha todos os campos de senha!');
      return;
    }
    if (usuarioLogado.senha !== senhaAtual) {
      Alert.alert('Erro', 'Senha atual incorreta!');
      return;
    }
    if (novaSenha !== confirmarNovaSenha) {
      Alert.alert('Erro', 'As senhas não coincidem!');
      return;
    }

    const atualizado = { ...usuarioLogado, senha: novaSenha };
    await AsyncStorage.setItem('usuarioLogado', JSON.stringify(atualizado));

    const listaData = await AsyncStorage.getItem('usuarios');
    const lista = listaData ? JSON.parse(listaData) : [];
    const novaLista = lista.map((u: any) => u.id === usuarioLogado.id ? atualizado : u);
    await AsyncStorage.setItem('usuarios', JSON.stringify(novaLista));

    setSenhaAtual('');
    setNovaSenha('');
    setConfirmarNovaSenha('');
    Alert.alert('Sucesso', 'Senha alterada com sucesso!');
  };

  const removerUsuario = async (id: string) => {
    Alert.alert('Confirmar', 'Deseja remover este usuário?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover', style: 'destructive', onPress: async () => {
          const novaLista = usuarios.filter((u: any) => u.id !== id);
          await AsyncStorage.setItem('usuarios', JSON.stringify(novaLista));
          setUsuarios(novaLista);
        }
      }
    ]);
  };

  const sair = async () => {
    await AsyncStorage.removeItem('usuarioLogado');
    router.replace('/login');
  };

  const iniciais = nome
    ? nome.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Meu perfil</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{iniciais}</Text>
        </View>
        <Text style={styles.profileName}>{nome || 'Sem nome'}</Text>
        <Text style={styles.profileEmail}>{email || 'Sem email'}</Text>
        <View style={styles.ocupacaoBadge}>
          <Ionicons
            name={ocupacao === 'tecnico' ? 'construct-outline' : 'medkit-outline'}
            size={14}
            color="#4a90d9"
          />
          <Text style={styles.profileOcupacao}>
            {ocupacao === 'tecnico' ? ' Técnico' : ocupacao === 'profissional' ? ' Profissional de saúde' : ''}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="person-outline" size={16} color="#ccc" />
          <Text style={styles.sectionTitle}> Dados pessoais</Text>
        </View>
        <Text style={styles.inputLabel}>Nome completo</Text>
        <TextInput style={styles.input} placeholder="Nome completo" placeholderTextColor="#888" value={nome} onChangeText={setNome} />
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#888" value={email} onChangeText={setEmail} />

        {ocupacao === 'tecnico' && (
          <>
            <Text style={styles.inputLabel}>Ocupação</Text>
            <View style={styles.ocupacaoRow}>
              <TouchableOpacity style={[styles.ocupacaoBtn, ocupacao === 'tecnico' && styles.ocupacaoBtnAtivo]} onPress={() => setOcupacao('tecnico')}>
                <Ionicons name="construct-outline" size={16} color={ocupacao === 'tecnico' ? '#fff' : '#4a90d9'} />
                <Text style={[styles.ocupacaoText, ocupacao === 'tecnico' && styles.ocupacaoTextAtivo]}> Técnico</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.ocupacaoBtn, ocupacao === 'profissional' && styles.ocupacaoBtnAtivo]} onPress={() => setOcupacao('profissional')}>
                <Ionicons name="medkit-outline" size={16} color={ocupacao === 'profissional' ? '#fff' : '#4a90d9'} />
                <Text style={[styles.ocupacaoText, ocupacao === 'profissional' && styles.ocupacaoTextAtivo]}> Profissional</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={salvar}>
          <Ionicons name="save-outline" size={16} color="#fff" />
          <Text style={styles.saveText}> SALVAR</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="lock-closed-outline" size={16} color="#ccc" />
          <Text style={styles.sectionTitle}> Alterar senha</Text>
        </View>
        <Text style={styles.inputLabel}>Senha atual</Text>
        <TextInput style={styles.input} placeholder="Senha atual" placeholderTextColor="#888" secureTextEntry value={senhaAtual} onChangeText={setSenhaAtual} />
        <Text style={styles.inputLabel}>Nova senha</Text>
        <TextInput style={styles.input} placeholder="Nova senha" placeholderTextColor="#888" secureTextEntry value={novaSenha} onChangeText={setNovaSenha} />
        <Text style={styles.inputLabel}>Confirmar nova senha</Text>
        <TextInput style={styles.input} placeholder="Confirmar nova senha" placeholderTextColor="#888" secureTextEntry value={confirmarNovaSenha} onChangeText={setConfirmarNovaSenha} />
        <TouchableOpacity style={styles.senhaButton} onPress={alterarSenha}>
          <Ionicons name="key-outline" size={16} color="#fff" />
          <Text style={styles.saveText}> ALTERAR SENHA</Text>
        </TouchableOpacity>
      </View>

      {ocupacao === 'tecnico' && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people-outline" size={16} color="#ccc" />
            <Text style={styles.sectionTitle}> Usuários cadastrados</Text>
          </View>
          {usuarios.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={32} color="#555" />
              <Text style={styles.empty}>Nenhum usuário cadastrado.</Text>
            </View>
          ) : (
            usuarios.map((u: any) => {
              const iniciaisU = u.nome
                ? u.nome.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
                : '?';
              return (
                <View key={u.id} style={styles.userCard}>
                  <View style={styles.userAvatar}>
                    <Text style={styles.userAvatarText}>{iniciaisU}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.userName}>{u.nome || 'Sem nome'}</Text>
                    <Text style={styles.userEmail}>{u.email}</Text>
                    <Text style={styles.userOcupacao}>
                      {u.ocupacao === 'tecnico' ? '🔧 Técnico' : '🩺 Profissional de saúde'}
                    </Text>
                  </View>
                  {u.id !== usuarioLogado?.id && (
                    <TouchableOpacity style={styles.removeBtn} onPress={() => removerUsuario(u.id)}>
                      <Ionicons name="trash-outline" size={16} color="#fff" />
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          )}
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={sair}>
        <Ionicons name="log-out-outline" size={18} color="#fff" />
        <Text style={styles.logoutText}> SAIR</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2a2a2a', padding: 16 },
  pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 8, marginBottom: 16 },
  profileCard: { backgroundColor: '#333', borderRadius: 12, padding: 20, alignItems: 'center', marginBottom: 20 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#2d5a8e', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 24 },
  profileName: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  profileEmail: { fontSize: 13, color: '#aaa', marginTop: 4 },
  ocupacaoBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 8, backgroundColor: '#1e3a5c', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  profileOcupacao: { fontSize: 13, color: '#4a90d9' },
  section: { backgroundColor: '#333', borderRadius: 12, padding: 14, marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#ccc' },
  inputLabel: { fontSize: 13, color: '#aaa', marginBottom: 4, marginTop: 12 },
  input: { backgroundColor: '#444', borderRadius: 8, padding: 12, color: '#fff', fontSize: 14 },
  ocupacaoRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  ocupacaoBtn: { flex: 1, borderWidth: 1, borderColor: '#4a90d9', borderRadius: 8, padding: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  ocupacaoBtnAtivo: { backgroundColor: '#4a90d9' },
  ocupacaoText: { color: '#4a90d9', fontWeight: 'bold', fontSize: 13 },
  ocupacaoTextAtivo: { color: '#fff' },
  saveButton: { backgroundColor: '#2d5a8e', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 16, flexDirection: 'row', justifyContent: 'center' },
  senhaButton: { backgroundColor: '#5a4a8e', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 16, flexDirection: 'row', justifyContent: 'center' },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#444', borderRadius: 8, padding: 12, marginBottom: 8 },
  userAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#2d5a8e', justifyContent: 'center', alignItems: 'center' },
  userAvatarText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  userName: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  userEmail: { color: '#aaa', fontSize: 12, marginTop: 2 },
  userOcupacao: { color: '#4a90d9', fontSize: 12, marginTop: 2 },
  removeBtn: { backgroundColor: '#8e2d2d', borderRadius: 8, padding: 8 },
  emptyContainer: { alignItems: 'center', paddingVertical: 16, gap: 8 },
  empty: { color: '#aaa', fontSize: 13 },
  logoutButton: { backgroundColor: '#8e2d2d', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 4, marginBottom: 40, flexDirection: 'row', justifyContent: 'center' },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});