import { Stack } from "expo-router";
import { AppProvider } from "../context/AppContext";

export default function Layout() {
  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="banco-horas" />
        <Stack.Screen name="funcionarios" />
        <Stack.Screen name="nova-escala" />
        <Stack.Screen name="escalas" />
        <Stack.Screen name="trocas" />
      </Stack>
    </AppProvider>
  );
}
