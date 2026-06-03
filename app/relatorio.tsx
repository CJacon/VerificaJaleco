import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

type Ocorrencia = {
  id: string;
  profissional: string;
  laboratorio: string;
  data: string;
  hora: string;
  status: string;
};

export default function RelatorioScreen() {
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

  const dataHoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  });

  const lista = usuario?.ocupacao === 'profissional'
    ? ocorrencias.filter(o => o.profissional === usuario?.nome)
    : ocorrencias;

  const semJaleco = lista.filter(o => o.status === 'Sem jaleco').length;
  const comJaleco = lista.filter(o => o.status === 'Com jaleco').length;
  const naoIdentificado = lista.filter(o => o.status === 'Não identificado').length;

  const getStatusIcon = (status: string) => {
    if (status === 'Com jaleco') return { icon: 'checkmark-circle' as const, color: '#4a9e6a' };
    if (status === 'Não identificado') return { icon: 'help-circle' as const, color: '#e0a93a' };
    return { icon: 'close-circle' as const, color: '#e05c3a' };
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>{usuario?.ocupacao === 'profissional' ? 'Meu Relatório' : 'Relatório Geral'}</Text>
          <Text style={styles.pageSubtitle}>{dataHoje}</Text>
        </View>
        <Ionicons name="document-text-outline" size={28} color="#4a90d9" />
      </View>

      <View style={styles.cardRow}>
        <View style={[styles.statCard, { backgroundColor: '#8e2d2d' }]}>
          <Ionicons name="close-circle-outline" size={22} color="#fff" />
          <Text style={styles.statNumber}>{semJaleco}</Text>
          <Text style={styles.statLabel}>Sem jaleco</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#2d8e4a' }]}>
          <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
          <Text style={styles.statNumber}>{comJaleco}</Text>
          <Text style={styles.statLabel}>Com jaleco</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#8e6e2d' }]}>
          <Ionicons name="help-circle-outline" size={22} color="#fff" />
          <Text style={styles.statNumber}>{naoIdentificado}</Text>
          <Text style={styles.statLabel}>Não identificado</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="list-outline" size={16} color="#ccc" />
          <Text style={styles.sectionTitle}> Registros</Text>
        </View>

        {lista.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle-outline" size={48} color="#4a9e6a" />
            <Text style={styles.empty}>Nenhuma ocorrência registrada.</Text>
          </View>
        ) : (
          <>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.tableHeaderText]}>Horário</Text>
              {usuario?.ocupacao === 'tecnico' && (
                <Text style={[styles.tableCell, styles.tableHeaderText]}>Profissional</Text>
              )}
              <Text style={[styles.tableCell, styles.tableHeaderText]}>Lab</Text>
              <Text style={[styles.tableCell, styles.tableHeaderText]}>Status</Text>
            </View>
            {lista.map((item) => {
              const { icon, color } = getStatusIcon(item.status);
              return (
                <View key={item.id} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item.hora}</Text>
                  {usuario?.ocupacao === 'tecnico' && (
                    <Text style={styles.tableCell}>{item.profissional}</Text>
                  )}
                  <Text style={styles.tableCell}>{item.laboratorio}</Text>
                  <View style={styles.tableCell}>
                    <Ionicons name={icon} size={18} color={color} />
                  </View>
                </View>
              );
            })}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2a2a2a', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 16 },
  pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  pageSubtitle: { fontSize: 13, color: '#aaa' },
  cardRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: { flex: 1, borderRadius: 12, padding: 12, alignItems: 'center', gap: 4 },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  statLabel: { fontSize: 11, color: '#ddd', textAlign: 'center' },
  section: { backgroundColor: '#333', borderRadius: 12, padding: 14, marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#ccc' },
  emptyContainer: { alignItems: 'center', paddingVertical: 32, gap: 12 },
  empty: { color: '#aaa', fontSize: 14 },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#555', paddingBottom: 8, marginBottom: 8 },
  tableHeaderText: { fontWeight: 'bold', color: '#aaa', fontSize: 12 },
  tableRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: '#444', alignItems: 'center' },
  tableCell: { flex: 1, color: '#fff', fontSize: 13 },
});