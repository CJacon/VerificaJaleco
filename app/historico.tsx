import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Ocorrencia = {
  id: string;
  profissional: string;
  laboratorio: string;
  data: string;
  hora: string;
  status: string;
};

export default function HistoricoScreen() {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [usuario, setUsuario] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      const carregar = async () => {
        const dadosUsuario = await AsyncStorage.getItem('usuarioLogado');
        if (dadosUsuario) setUsuario(JSON.parse(dadosUsuario));

        const dados = await AsyncStorage.getItem('ocorrencias');
        if (dados) setOcorrencias(JSON.parse(dados));
        else setOcorrencias([]);
      };
      carregar();
    }, [])
  );

  const limpar = async () => {
    await AsyncStorage.removeItem('ocorrencias');
    setOcorrencias([]);
  };

  const adicionarTeste = async () => {
    const statusOpcoes = ['Sem jaleco', 'Com jaleco', 'Não identificado'];
    const statusAleatorio = statusOpcoes[Math.floor(Math.random() * statusOpcoes.length)];

    const nova: Ocorrencia = {
      id: Date.now().toString(),
      profissional: usuario?.nome || 'Dr. Teste',
      laboratorio: 'Lab 01',
      data: new Date().toLocaleDateString('pt-BR'),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: statusAleatorio,
    };
    const novas = [nova, ...ocorrencias];
    await AsyncStorage.setItem('ocorrencias', JSON.stringify(novas));
    setOcorrencias(novas);
  };

  const lista = usuario?.ocupacao === 'profissional'
    ? ocorrencias.filter(o => o.profissional === usuario?.nome)
    : ocorrencias;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Histórico</Text>
      <Text style={styles.pageSubtitle}>
        {usuario?.ocupacao === 'profissional' ? 'Suas ocorrências registradas' : 'Todas as ocorrências registradas'}
      </Text>

      {usuario?.ocupacao === 'tecnico' && (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.btnTeste} onPress={adicionarTeste}>
            <Text style={styles.btnText}>+ Simular ocorrência</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnLimpar} onPress={limpar}>
            <Text style={styles.btnText}>🗑️ Limpar</Text>
          </TouchableOpacity>
        </View>
      )}

      {lista.length === 0 ? (
        <View style={styles.section}>
          <Text style={styles.empty}>Nenhum registro encontrado.</Text>
        </View>
      ) : (
        lista.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardNome}>{item.profissional}</Text>
              <Text style={[
                styles.cardStatus,
                item.status === 'Com jaleco' && { color: '#4a9e6a' },
                item.status === 'Não identificado' && { color: '#e0a93a' },
              ]}>{item.status}</Text>
            </View>
            <Text style={styles.cardInfo}>📍 {item.laboratorio}</Text>
            <Text style={styles.cardInfo}>🕐 {item.data} às {item.hora}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2a2a2a', padding: 16 },
  pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 8 },
  pageSubtitle: { fontSize: 13, color: '#aaa', marginBottom: 16 },
  buttonRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  btnTeste: { flex: 1, backgroundColor: '#2d5a8e', borderRadius: 6, padding: 12, alignItems: 'center' },
  btnLimpar: { backgroundColor: '#8e2d2d', borderRadius: 6, padding: 12, paddingHorizontal: 20, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  section: { backgroundColor: '#333', borderRadius: 8, padding: 12 },
  empty: { color: '#aaa', fontSize: 13 },
  card: { backgroundColor: '#333', borderRadius: 8, padding: 14, marginBottom: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  cardNome: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  cardStatus: { color: '#e05c3a', fontSize: 12, fontWeight: 'bold' },
  cardInfo: { color: '#aaa', fontSize: 13, marginTop: 2 },
});