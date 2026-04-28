import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function PerfilScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Meu perfil</Text>
      <View style={styles.profileCard}>
        <View style={styles.avatar} />
        <Text style={styles.profileName}>Técnico responsável</Text>
        <Text style={styles.profileEmail}>seu@email.com</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados pessoais</Text>
        <Text style={styles.inputLabel}>Nome completo</Text>
        <TextInput style={styles.input} placeholder="Nome completo" placeholderTextColor="#888" />
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#888" />
        <Text style={styles.inputLabel}>Ocupação</Text>
        <TextInput style={styles.input} placeholder="Ocupação" placeholderTextColor="#888" />
      </View>
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>SAIR</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2a2a2a', padding: 16 },
  pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 8 },
  profileCard: { backgroundColor: '#333', borderRadius: 8, padding: 20, alignItems: 'center', marginBottom: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#2d5a8e', marginBottom: 12 },
  profileName: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  profileEmail: { fontSize: 13, color: '#aaa', marginTop: 4 },
  section: { backgroundColor: '#333', borderRadius: 8, padding: 12, marginBottom: 16 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#ccc', marginBottom: 10 },
  inputLabel: { fontSize: 13, color: '#aaa', marginBottom: 4, marginTop: 12 },
  input: { backgroundColor: '#444', borderRadius: 6, padding: 10, color: '#fff', fontSize: 14 },
  logoutButton: { backgroundColor: '#8e2d2d', borderRadius: 6, padding: 14, alignItems: 'center', marginTop: 20, marginBottom: 40 },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});