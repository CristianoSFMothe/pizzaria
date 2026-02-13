import { useAuth } from "@/context/AuthContext";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

export default function AuthenticatedLayout() {
  const { loading, signed } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !signed) {
      router.replace("/login");
    }
  }, [loading, signed]);

  if (loading || !signed) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
    </Stack>
  );
}
