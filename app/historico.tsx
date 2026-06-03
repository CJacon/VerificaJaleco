import { Ionicons } from '@expo/vector-icons';
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

  const getStatusStyle = (status: string) => {
    if (status === 'Com jaleco') return { bg: '#1a3d2b', color: '#4a9e6a', icon: 'checkmark-circle' as const };
    if (status === 'Não identificado') return { bg: '#3d3010', color: '#e0a93a', icon: 'help-circle' as const };
    return { bg: '#3d1a1a', color: '#e05c3a', icon: 'close-circle' as const };
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>Histórico</Text>
          <Text style={styles.pageSubtitle}>
            {usuario?.ocupacao === 'profissional' ? 'Suas ocorrências registradas' : 'Todas as ocorrências registradas'}
          </Text>
        </View>
        <Ionicons name="time-outline" size={28} color="#4a90d9" />
      </View>

      {usuario?.ocupacao === 'tecnico' && (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.btnTeste} onPress={adicionarTeste}>
            <Ionicons name="add-circle-outline" size={16} color="#fff" />
            <Text style={styles.btnText}> Simular ocorrência</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnLimpar} onPress={limpar}>
            <Ionicons name="trash-outline" size={16} color="#fff" />
            <Text style={styles.btnText}> Limpar</Text>
          </TouchableOpacity>
        </View>
      )}

      {lista.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-circle-outline" size={48} color="#4a9e6a" />
          <Text style={styles.empty}>Nenhum registro encontrado.</Text>
        </View>
      ) : (
        lista.map((item) => {
          const statusStyle = getStatusStyle(item.status);
          return (
            <View key={item.id} style={[styles.card, { backgroundColor: statusStyle.bg }]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardNomeRow}>
                  <Ionicons name="person-circle-outline" size={18} color="#aaa" />
                  <Text style={styles.cardNome}> {item.profissional}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Ionicons name={statusStyle.icon} size={14} color={statusStyle.color} />
                  <Text style={[styles.cardStatus, { color: statusStyle.color }]}> {item.status}</Text>
                </View>
              </View>
              <View style={styles.cardInfoRow}>
                <Ionicons name="location-outline" size={14} color="#aaa" />
                <Text style={styles.cardInfo}> {item.laboratorio}</Text>
              </View>
              <View style={styles.cardInfoRow}>
                <Ionicons name="time-outline" size={14} color="#aaa" />
                <Text style={styles.cardInfo}> {item.data} às {item.hora}</Text>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2a2a2a', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 16 },
  pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  pageSubtitle: { fontSize: 13, color: '#aaa' },
  buttonRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  btnTeste: { flex: 1, backgroundColor: '#2d5a8e', borderRadius: 8, padding: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  btnLimpar: { backgroundColor: '#8e2d2d', borderRadius: 8, padding: 12, paddingHorizontal: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  emptyContainer: { alignItems: 'center', paddingVertical: 48, gap: 12 },
  empty: { color: '#aaa', fontSize: 14 },
  card: { borderRadius: 12, padding: 14, marginBottom: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardNomeRow: { flexDirection: 'row', alignItems: 'center' },
  cardNome: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  statusBadge: { flexDirection: 'row', alignItems: 'center' },
  cardStatus: { fontSize: 12, fontWeight: 'bold' },
  cardInfoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  cardInfo: { color: '#aaa', fontSize: 13 },
});