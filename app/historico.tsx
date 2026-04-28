import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HistoricoScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Histórico</Text>
      <View style={styles.section}>
        <Text style={styles.pageSubtitle}>Nenhum registro encontrado.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2a2a2a', padding: 16 },
  pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 8 },
  pageSubtitle: { fontSize: 13, color: '#aaa', marginBottom: 20 },
  section: { backgroundColor: '#333', borderRadius: 8, padding: 12, marginBottom: 16 },
});