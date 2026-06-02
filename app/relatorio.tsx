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

  if (usuario?.ocupacao === 'profissional') {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.pageTitle}>Meu Relatório</Text>
        <Text style={styles.pageSubtitle}>{dataHoje}</Text>

        <View style={[styles.card, styles.cardBlue, { alignSelf: 'center', width: 160, marginBottom: 24 }]}>
          <Text style={styles.cardLabel}>Minhas ocorrências</Text>
          <Text style={styles.cardNumber}>{lista.length}</Text>
        </View>

        <View style={styles.section}>
          {lista.length === 0 ? (
            <Text style={styles.empty}>Nenhuma ocorrência registrada. ✅</Text>
          ) : (
            <>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, styles.tableHeaderText]}>Data</Text>
                <Text style={[styles.tableCell, styles.tableHeaderText]}>Horário</Text>
                <Text style={[styles.tableCell, styles.tableHeaderText]}>Laboratório</Text>
              </View>
              {lista.map((item) => (
                <View key={item.id} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item.data}</Text>
                  <Text style={styles.tableCell}>{item.hora}</Text>
                  <Text style={styles.tableCell}>{item.laboratorio}</Text>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Relatório Geral</Text>
      <Text style={styles.pageSubtitle}>{dataHoje}</Text>

      <View style={[styles.card, styles.cardRed, { alignSelf: 'center', width: 160, marginBottom: 24 }]}>
        <Text style={styles.cardLabel}>Total de ocorrências</Text>
        <Text style={styles.cardNumber}>{lista.length}</Text>
      </View>

      <View style={styles.section}>
        {lista.length === 0 ? (
          <Text style={styles.empty}>Nenhuma ocorrência registrada.</Text>
        ) : (
          <>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.tableHeaderText]}>Horário</Text>
              <Text style={[styles.tableCell, styles.tableHeaderText]}>Laboratório</Text>
              <Text style={[styles.tableCell, styles.tableHeaderText]}>Profissional</Text>
            </View>
            {lista.map((item) => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.hora}</Text>
                <Text style={styles.tableCell}>{item.laboratorio}</Text>
                <Text style={styles.tableCell}>{item.profissional}</Text>
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2a2a2a', padding: 16 },
  pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 8 },
  pageSubtitle: { fontSize: 13, color: '#aaa', marginBottom: 20 },
  card: { flex: 1, borderRadius: 8, padding: 16, alignItems: 'center' },
  cardBlue: { backgroundColor: '#2d5a8e' },
  cardRed: { backgroundColor: '#8e2d2d' },
  cardLabel: { fontSize: 12, color: '#ddd', textAlign: 'center', marginBottom: 8 },
  cardNumber: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  section: { backgroundColor: '#333', borderRadius: 8, padding: 12, marginBottom: 16 },
  empty: { color: '#aaa', fontSize: 13 },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#555', paddingBottom: 8, marginBottom: 8 },
  tableHeaderText: { fontWeight: 'bold', color: '#aaa' },
  tableRow: { flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 0.5, borderBottomColor: '#444' },
  tableCell: { flex: 1, color: '#fff', fontSize: 13 },
});