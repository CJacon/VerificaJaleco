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

  const iniciais = usuario?.nome
    ? usuario.nome.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  if (usuario?.ocupacao === 'profissional') {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.pageTitle}>Dashboard</Text>
            <Text style={styles.pageSubtitle}>{dataHoje}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{iniciais}</Text>
          </View>
        </View>

        <Text style={styles.welcome}>Olá, {usuario.nome}! 🩺</Text>

        <View style={styles.cardRow}>
          <View style={[styles.card, styles.cardBlue]}>
            <Ionicons name="today-outline" size={24} color="#fff" style={styles.cardIcon} />
            <Text style={styles.cardLabel}>Minhas ocorrências hoje</Text>
            <Text style={styles.cardNumber}>{minhasHoje.length}</Text>
          </View>
          <View style={[styles.card, styles.cardRed]}>
            <Ionicons name="alert-circle-outline" size={24} color="#fff" style={styles.cardIcon} />
            <Text style={styles.cardLabel}>Total de ocorrências</Text>
            <Text style={styles.cardNumber}>{minhasOcorrencias.length}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="warning-outline" size={16} color="#e05c3a" />
            <Text style={[styles.sectionTitle, { color: '#e05c3a', marginLeft: 6 }]}>Minhas ocorrências de hoje</Text>
          </View>
          {minhasHoje.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="checkmark-circle-outline" size={32} color="#4a9e6a" />
              <Text style={styles.empty}>Nenhuma ocorrência hoje!</Text>
            </View>
          ) : (
            minhasHoje.map((item) => (
              <View key={item.id} style={styles.alertItem}>
                <Ionicons name="alert-outline" size={16} color="#e05c3a" />
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.listItemText}>Sem jaleco - {item.hora}</Text>
                  <Text style={styles.listItemSub}>📍 {item.laboratorio}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time-outline" size={16} color="#ccc" />
            <Text style={[styles.sectionTitle, { marginLeft: 6 }]}>Últimas ocorrências</Text>
          </View>
          {minhasOcorrencias.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="checkmark-circle-outline" size={32} color="#4a9e6a" />
              <Text style={styles.empty}>Nenhuma ocorrência registrada!</Text>
            </View>
          ) : (
            minhasOcorrencias.slice(0, 5).map((item) => (
              <View key={item.id} style={styles.listItem}>
                <Ionicons name="time-outline" size={14} color="#aaa" />
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.listItemText}>{item.data} às {item.hora}</Text>
                  <Text style={styles.listItemSub}>📍 {item.laboratorio}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>Dashboard</Text>
          <Text style={styles.pageSubtitle}>{dataHoje}</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{iniciais}</Text>
        </View>
      </View>

      <Text style={styles.welcome}>Olá, {usuario?.nome}! 🔧</Text>

      <View style={styles.cardRow}>
        <View style={[styles.card, styles.cardBlue]}>
          <Ionicons name="today-outline" size={24} color="#fff" style={styles.cardIcon} />
          <Text style={styles.cardLabel}>Ocorrências hoje</Text>
          <Text style={styles.cardNumber}>{ocorrenciasHoje.length}</Text>
        </View>
        <View style={[styles.card, styles.cardRed]}>
          <Ionicons name="alert-circle-outline" size={24} color="#fff" style={styles.cardIcon} />
          <Text style={styles.cardLabel}>Total de alertas</Text>
          <Text style={styles.cardNumber}>{ocorrencias.length}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="warning-outline" size={16} color="#e05c3a" />
          <Text style={[styles.sectionTitle, { color: '#e05c3a', marginLeft: 6 }]}>Alertas de hoje</Text>
        </View>
        {ocorrenciasHoje.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle-outline" size={32} color="#4a9e6a" />
            <Text style={styles.empty}>Nenhum alerta hoje!</Text>
          </View>
        ) : (
          ocorrenciasHoje.map((item) => (
            <View key={item.id} style={styles.alertItem}>
              <Ionicons name="alert-outline" size={16} color="#e05c3a" />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.listItemText}>{item.profissional} - {item.hora}</Text>
                <Text style={styles.listItemSub}>📍 {item.laboratorio}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="time-outline" size={16} color="#ccc" />
          <Text style={[styles.sectionTitle, { marginLeft: 6 }]}>Últimas ocorrências</Text>
        </View>
        {ocorrencias.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle-outline" size={32} color="#4a9e6a" />
            <Text style={styles.empty}>Nenhuma ocorrência registrada!</Text>
          </View>
        ) : (
          ocorrencias.slice(0, 5).map((item) => (
            <View key={item.id} style={styles.listItem}>
              <Ionicons name="person-outline" size={14} color="#aaa" />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.listItemText}>{item.profissional} - {item.data} às {item.hora}</Text>
                <Text style={styles.listItemSub}>📍 {item.laboratorio}</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2a2a2a', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 8 },
  pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  pageSubtitle: { fontSize: 13, color: '#aaa' },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#2d5a8e', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  welcome: { fontSize: 14, color: '#4a90d9', marginBottom: 16 },
  cardRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  card: { flex: 1, borderRadius: 12, padding: 16, alignItems: 'center' },
  cardBlue: { backgroundColor: '#2d5a8e' },
  cardRed: { backgroundColor: '#8e2d2d' },
  cardIcon: { marginBottom: 8 },
  cardLabel: { fontSize: 12, color: '#ddd', textAlign: 'center', marginBottom: 8 },
  cardNumber: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  section: { backgroundColor: '#333', borderRadius: 12, padding: 14, marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#ccc' },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#444', borderRadius: 8, padding: 10, marginBottom: 6 },
  alertItem: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#4a3030', borderRadius: 8, padding: 10, marginBottom: 6 },
  listItemText: { color: '#fff', fontSize: 13 },
  listItemSub: { color: '#aaa', fontSize: 12, marginTop: 2 },
  emptyContainer: { alignItems: 'center', paddingVertical: 16, gap: 8 },
  empty: { color: '#aaa', fontSize: 13 },
});