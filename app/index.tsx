import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "../theme/appTheme";

export default function Index() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const validarCredenciais = () => {
    if (!usuario || !senha) {
      Alert.alert("Atenção", "Preencha usuário e senha.");
      return false;
    }

    if (usuario === "admin" && senha === "1234") {
      return true;
    }

    Alert.alert("Erro", "Usuário ou senha inválidos.");
    return false;
  };

  const fazerLogin = () => {
    if (!validarCredenciais()) {
      return;
    }

    router.push("/dashboard");
  };

  const abrirBancoHoras = () => {
    if (!validarCredenciais()) {
      return;
    }

    router.push("/banco-horas");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroCard}>
            <View style={styles.heroBadge}>
              <Ionicons name="medkit-outline" size={16} color={theme.colors.primary} />
              <Text style={styles.heroBadgeText}>Coordenação hospitalar</Text>
            </View>

            <View style={styles.brandRow}>
              <View style={styles.brandMark}>
                <View style={styles.brandCrossVertical} />
                <View style={styles.brandCrossHorizontal} />
              </View>

              <View style={styles.brandTextBlock}>
                <Text style={styles.brandName}>UMS Escalas</Text>
                <Text style={styles.brandUnit}>
                  Unidade Mista de Saúde Antônio da Costa Vidica
                </Text>
              </View>
            </View>

            <Text style={styles.title}>Organize plantões, equipes e trocas em um só lugar</Text>
            <Text style={styles.subtitle}>
              Acompanhe a operação diária da unidade com um painel simples e focado
              na rotina da coordenação.
            </Text>

            <View style={styles.highlights}>
              <View style={styles.highlightChip}>
                <Ionicons name="calendar-clear-outline" size={16} color={theme.colors.primary} />
                <Text style={styles.highlightText}>Escalas centralizadas</Text>
              </View>

              <View style={styles.highlightChip}>
                <Ionicons name="people-outline" size={16} color={theme.colors.primary} />
                <Text style={styles.highlightText}>Equipe organizada</Text>
              </View>
            </View>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Entrar no sistema</Text>
            <Text style={styles.formSubtitle}>
              Use seu acesso para abrir o painel administrativo.
            </Text>

            <Text style={styles.label}>Usuário</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={18} color={theme.colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Digite seu usuário"
                placeholderTextColor={theme.colors.textMuted}
                value={usuario}
                onChangeText={setUsuario}
                autoCapitalize="none"
              />
            </View>

            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={theme.colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor={theme.colors.textMuted}
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={fazerLogin} activeOpacity={0.92}>
              <Text style={styles.buttonText}>Entrar</Text>
              <Ionicons name="arrow-forward" size={18} color="#ffffff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={abrirBancoHoras}
              activeOpacity={0.92}
            >
              <Ionicons name="time-outline" size={18} color={theme.colors.primary} />
              <Text style={styles.secondaryButtonText}>Abrir banco de horas</Text>
            </TouchableOpacity>

            <View style={styles.accessNote}>
              <Text style={styles.accessTitle}>Acesso atual de demonstração</Text>
              <Text style={styles.accessText}>Usuário: admin</Text>
              <Text style={styles.accessText}>Senha: 1234</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  heroCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
    ...theme.shadowCard,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: theme.colors.accentSoft,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    marginBottom: theme.spacing.lg,
  },
  heroBadgeText: {
    marginLeft: 8,
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  brandMark: {
    width: 78,
    height: 78,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
    position: "relative",
  },
  brandCrossVertical: {
    position: "absolute",
    width: 14,
    height: 42,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
  },
  brandCrossHorizontal: {
    position: "absolute",
    width: 42,
    height: 14,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
  },
  brandTextBlock: {
    flex: 1,
  },
  brandName: {
    fontSize: 26,
    fontWeight: "800",
    color: theme.colors.text,
  },
  brandUnit: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: theme.colors.textSecondary,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: theme.colors.textSecondary,
  },
  highlights: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: theme.spacing.lg,
  },
  highlightChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 8,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  highlightText: {
    marginLeft: 8,
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  formCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadowCard,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.text,
  },
  formSubtitle: {
    marginTop: 6,
    marginBottom: theme.spacing.md,
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.textSecondary,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 8,
    marginTop: theme.spacing.sm,
  },
  inputWrap: {
    minHeight: 54,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceMuted,
    paddingHorizontal: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: theme.colors.text,
  },
  button: {
    marginTop: theme.spacing.lg,
    height: 54,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.accent,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    marginRight: 8,
  },
  secondaryButton: {
    marginTop: theme.spacing.sm,
    height: 52,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceMuted,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  secondaryButtonText: {
    marginLeft: 8,
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: "800",
  },
  accessNote: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.accentSoft,
  },
  accessTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: theme.colors.primaryStrong,
    marginBottom: 4,
  },
  accessText: {
    fontSize: 13,
    lineHeight: 20,
    color: theme.colors.text,
  },
});
