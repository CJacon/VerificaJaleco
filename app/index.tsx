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

export default function DashboardScreen() {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [usuario, setUsuario] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      const carregar = async () => {
        const dadosUsuario = await AsyncStorage.getItem('usuarioLogado');
        if (dadosUsuario) setUsuario(JSON.parse(dadosUsuario));

        const dadosOcorrencias = await AsyncStorage.getItem('ocorrencias');
        if (dadosOcorrencias) setOcorrencias(JSON.parse(dadosOcorrencias));
        else setOcorrencias([]);
      };
      carregar();
    }, [])
  );

  const dataHoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  });

  const hojeStr = new Date().toLocaleDateString('pt-BR');
  const ocorrenciasHoje = ocorrencias.filter(o => o.data === hojeStr);
  const minhasOcorrencias = ocorrencias.filter(o => o.profissional === usuario?.nome);
  const minhasHoje = minhasOcorrencias.filter(o => o.data === hojeStr);

  if (usuario?.ocupacao === 'profissional') {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.pageTitle}>Dashboard</Text>
        <Text style={styles.pageSubtitle}>{dataHoje}</Text>
        <Text style={styles.welcome}>Olá, {usuario.nome}! 🩺</Text>

        <View style={styles.cardRow}>
          <View style={[styles.card, styles.cardBlue]}>
            <Text style={styles.cardLabel}>Minhas ocorrências hoje:</Text>
            <Text style={styles.cardNumber}>{minhasHoje.length}</Text>
          </View>
          <View style={[styles.card, styles.cardRed]}>
            <Text style={styles.cardLabel}>Total de ocorrências:</Text>
            <Text style={styles.cardNumber}>{minhasOcorrencias.length}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#e05c3a' }]}>Minhas ocorrências de hoje:</Text>
          {minhasHoje.length === 0 ? (
            <Text style={styles.empty}>Nenhuma ocorrência hoje. ✅</Text>
          ) : (
            minhasHoje.map((item) => (
              <View key={item.id} style={styles.alertItem}>
                <Text style={styles.listItemText}>Sem jaleco - {item.hora}</Text>
                <Text style={styles.listItemSub}>📍 {item.laboratorio}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Últimas ocorrências:</Text>
          {minhasOcorrencias.length === 0 ? (
            <Text style={styles.empty}>Nenhuma ocorrência registrada. ✅</Text>
          ) : (
            minhasOcorrencias.slice(0, 5).map((item) => (
              <View key={item.id} style={styles.listItem}>
                <Text style={styles.listItemText}>{item.data} às {item.hora}</Text>
                <Text style={styles.listItemSub}>📍 {item.laboratorio}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Dashboard</Text>
      <Text style={styles.pageSubtitle}>{dataHoje}</Text>
      <Text style={styles.welcome}>Olá, {usuario?.nome}! 🔧</Text>

      <View style={styles.cardRow}>
        <View style={[styles.card, styles.cardBlue]}>
          <Text style={styles.cardLabel}>Ocorrências hoje:</Text>
          <Text style={styles.cardNumber}>{ocorrenciasHoje.length}</Text>
        </View>
        <View style={[styles.card, styles.cardRed]}>
          <Text style={styles.cardLabel}>Total de alertas:</Text>
          <Text style={styles.cardNumber}>{ocorrencias.length}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: '#e05c3a' }]}>Alertas de hoje:</Text>
        {ocorrenciasHoje.length === 0 ? (
          <Text style={styles.empty}>Nenhum alerta registrado hoje.</Text>
        ) : (
          ocorrenciasHoje.map((item) => (
            <View key={item.id} style={styles.alertItem}>
              <Text style={styles.listItemText}>{item.profissional} - {item.hora}</Text>
              <Text style={styles.listItemSub}>📍 {item.laboratorio}</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Últimas ocorrências:</Text>
        {ocorrencias.length === 0 ? (
          <Text style={styles.empty}>Nenhuma ocorrência registrada.</Text>
        ) : (
          ocorrencias.slice(0, 5).map((item) => (
            <View key={item.id} style={styles.listItem}>
              <Text style={styles.listItemText}>{item.profissional} - {item.data} às {item.hora}</Text>
              <Text style={styles.listItemSub}>📍 {item.laboratorio}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2a2a2a', padding: 16 },
  pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 8 },
  pageSubtitle: { fontSize: 13, color: '#aaa', marginBottom: 4 },
  welcome: { fontSize: 14, color: '#4a90d9', marginBottom: 16 },
  cardRow: { flexDirection: 'row', gap: 12, marginBottom: 20, marginTop: 12 },
  card: { flex: 1, borderRadius: 8, padding: 16, alignItems: 'center' },
  cardBlue: { backgroundColor: '#2d5a8e' },
  cardRed: { backgroundColor: '#8e2d2d' },
  cardLabel: { fontSize: 12, color: '#ddd', textAlign: 'center', marginBottom: 8 },
  cardNumber: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  section: { backgroundColor: '#333', borderRadius: 8, padding: 12, marginBottom: 16 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#ccc', marginBottom: 10 },
  listItem: { backgroundColor: '#444', borderRadius: 6, padding: 10, marginBottom: 6 },
  alertItem: { backgroundColor: '#4a3030', borderRadius: 6, padding: 10, marginBottom: 6 },
  listItemText: { color: '#fff', fontSize: 13 },
  listItemSub: { color: '#aaa', fontSize: 12, marginTop: 2 },
  empty: { color: '#aaa', fontSize: 13 },
});