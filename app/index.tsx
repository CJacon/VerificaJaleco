import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Dashboard</Text>
      <Text style={styles.pageSubtitle}>Quarta-feira, 08 de abril de 2026</Text>

      <View style={styles.cardRow}>
        <View style={[styles.card, styles.cardBlue]}>
          <Text style={styles.cardLabel}>Atividades registradas:</Text>
          <Text style={styles.cardNumber}>4</Text>
        </View>
        <View style={[styles.card, styles.cardRed]}>
          <Text style={styles.cardLabel}>Alertas registrados:</Text>
          <Text style={styles.cardNumber}>3</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Atividades do dia:</Text>
        {['Aula de anatomia : 8:50 - 10:30', 'Aula de microbiologia: 10:40 - 12:20', 'Aula sobre fungos: 19:40 - 20:40', 'Aula de bioquímica : 21:00 - 22:30'].map((item, i) => (
          <View key={i} style={styles.listItem}>
            <Text style={styles.listItemText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: '#e05c3a' }]}>Alertas do dia:</Text>
        {['Professor 01 - 8:53', 'Professor 03 - 19:42', 'Professor 04 - 21:00'].map((item, i) => (
          <View key={i} style={styles.alertItem}>
            <Text style={styles.listItemText}>{item}</Text>
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
  cardRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
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
});