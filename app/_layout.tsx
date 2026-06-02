import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs
      initialRouteName="login"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#1e1e1e', borderTopColor: '#333' },
        tabBarActiveTintColor: '#4a90d9',
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tabs.Screen name="login" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="cadastro" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="index" options={{ title: 'Dashboard', tabBarIcon: ({ color }) => <Ionicons name="grid-outline" size={22} color={color} /> }} />
      <Tabs.Screen name="relatorio" options={{ title: 'Relatório', tabBarIcon: ({ color }) => <Ionicons name="document-text-outline" size={22} color={color} /> }} />
      <Tabs.Screen name="historico" options={{ title: 'Histórico', tabBarIcon: ({ color }) => <Ionicons name="time-outline" size={22} color={color} /> }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={22} color={color} /> }} />
    </Tabs>
  );
}