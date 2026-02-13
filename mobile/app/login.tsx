import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { colors, fontSize, spacing } from "@/constants/theme";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log(email, password);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>
            Pizzaria <Text style={styles.logoTextBrand}>Millennium</Text>
          </Text>
          <Text style={styles.logoSubtitle}>Garçom APP</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Email"
            placeholder="Informe seu e-mail..."
            placeholderTextColor={colors.gray}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Input
            label="Senha"
            placeholder="Digite sua senha..."
            placeholderTextColor={colors.gray}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          <Button title="Acessar" loading={loading} onPress={handleLogin} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  scrollContent: {
    justifyContent: "center",
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  logoText: {
    fontSize: 34,
    fontWeight: "bold",
    color: colors.primary,
  },
  logoTextBrand: {
    color: colors.brand,
  },
  logoSubtitle: {
    fontSize: fontSize.lg,
    color: colors.primary,
  },
  formContainer: {
    gap: spacing.md,
  },
});
