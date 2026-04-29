import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function RelatorioScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Relatório</Text>
      <Text style={styles.pageSubtitle}>Quarta-feira, 08 de abril de 2026</Text>

      <View style={[styles.card, styles.cardRed, { alignSelf: 'center', width: 160, marginBottom: 24 }]}>
        <Text style={styles.cardLabel}>Ocorrências</Text>
        <Text style={styles.cardNumber}>3</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCell, styles.tableHeaderText]}>Horário</Text>
          <Text style={[styles.tableCell, styles.tableHeaderText]}>Aula</Text>
          <Text style={[styles.tableCell, styles.tableHeaderText]}>Responsável</Text>
        </View>
        {[
          { hora: '8:55', aula: 'Aula 01', resp: 'Professor 01' },
          { hora: '19:42', aula: 'Aula 02', resp: 'Professor 02' },
          { hora: '21:00', aula: 'Aula 04', resp: 'Professor 05' },
        ].map((row, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.tableCell}>{row.hora}</Text>
            <Text style={styles.tableCell}>{row.aula}</Text>
            <Text style={styles.tableCell}>{row.resp}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2a2a2a', padding: 16 },
  pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 8 },
  pageSubtitle: { fontSize: 13, color: '#aaa', marginBottom: 20 },
  card: { flex: 1, borderRadius: 8, padding: 16, alignItems: 'center' },
  cardRed: { backgroundColor: '#8e2d2d' },
  cardLabel: { fontSize: 12, color: '#ddd', textAlign: 'center', marginBottom: 8 },
  cardNumber: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  section: { backgroundColor: '#333', borderRadius: 8, padding: 12, marginBottom: 16 },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#555', paddingBottom: 8, marginBottom: 8 },
  tableHeaderText: { fontWeight: 'bold', color: '#aaa' },
  tableRow: { flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 0.5, borderBottomColor: '#444' },
  tableCell: { flex: 1, color: '#fff', fontSize: 13 },
}); 