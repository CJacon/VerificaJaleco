import { useRouter } from 'expo-router';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>VJ</Text>
        </View>
        <Text style={styles.logoTitle}>VERIFICA JALECOS</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#888"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Perfil do usuário"
          placeholderTextColor="#888"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.buttonText}>ENTRAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a3a5c', justifyContent: 'center', padding: 32 },
  logoContainer: { alignItems: 'center', marginBottom: 48 },
  logo: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  logoText: { fontSize: 28, fontWeight: 'bold', color: '#1a3a5c' },
  logoTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', letterSpacing: 2 },
  form: { gap: 12 },
  input: { backgroundColor: '#2a5080', borderRadius: 8, padding: 14, color: '#fff', fontSize: 14 },
  button: { backgroundColor: '#4a90d9', borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});