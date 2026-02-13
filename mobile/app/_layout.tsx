import { colors } from "@/constants/theme";
import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" backgroundColor={colors.background} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(authenticated)" />
      </Stack>
    </AuthProvider>
  );
}
