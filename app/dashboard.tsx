import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppData } from "../context/AppContext";
import { theme } from "../theme/appTheme";

type QuickAction = {
  rota:
    | "/funcionarios"
    | "/escalas"
    | "/trocas"
    | "/nova-escala"
    | "/banco-horas";
  titulo: string;
  descricao: string;
  icone: "people" | "calendar" | "swap-horizontal" | "add-circle" | "time";
};

const quickActions: QuickAction[] = [
  {
    rota: "/funcionarios",
    titulo: "Funcion\u00e1rios",
    descricao: "Cadastre e acompanhe a equipe",
    icone: "people",
  },
  {
    rota: "/escalas",
    titulo: "Escalas",
    descricao: "Visualize turnos e filtros",
    icone: "calendar",
  },
  {
    rota: "/trocas",
    titulo: "Trocas",
    descricao: "Gerencie solicita\u00e7\u00f5es pendentes",
    icone: "swap-horizontal",
  },
  {
    rota: "/nova-escala",
    titulo: "Nova escala",
    descricao: "Monte um plant\u00e3o rapidamente",
    icone: "add-circle",
  },
  {
    rota: "/banco-horas",
    titulo: "Banco de horas",
    descricao: "Calcule saldos e ocorr\u00eancias",
    icone: "time",
  },
];

const formatarData = (data: Date) =>
  data.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

export default function Dashboard() {
  const router = useRouter();
  const { escalas, funcionarios, trocas } = useAppData();

  const hoje = new Date();
  const hojeCurto = hoje.toLocaleDateString("pt-BR");

  const escalasHoje = escalas.filter((item) => item.data === hojeCurto).length;
  const equipeAtiva = funcionarios.filter((item) => item.status === "Ativo").length;
  const trocasPendentes = trocas.filter(
    (item) =>
      item.status === "Aguardando aceite" || item.status === "Aceita pelo colega"
  ).length;
  const trocasAprovadas = trocas.filter(
    (item) => item.status === "Aprovada pela coordena\u00e7\u00e3o"
  ).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.heroLabel}>Painel de coordena\u00e7\u00e3o</Text>
              <Text style={styles.heroTitle}>Bem-vindo, Administrador</Text>
            </View>

            <View style={styles.heroIconWrap}>
              <Ionicons name="pulse-outline" size={24} color="#ffffff" />
            </View>
          </View>

          <Text style={styles.heroDate}>{formatarData(hoje)}</Text>

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{escalasHoje}</Text>
              <Text style={styles.heroStatLabel}>Escalas hoje</Text>
            </View>

            <View style={styles.heroDivider} />

            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{equipeAtiva}</Text>
              <Text style={styles.heroStatLabel}>Equipe ativa</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>A\u00e7\u00f5es r\u00e1pidas</Text>
          <Text style={styles.sectionSubtitle}>Atalhos para a rotina do plant\u00e3o</Text>
        </View>

        <View style={styles.actionsGrid}>
          {quickActions.map((item) => (
            <TouchableOpacity
              key={item.rota}
              style={styles.actionCard}
              onPress={() => router.push(item.rota)}
              activeOpacity={0.92}
            >
              <View style={styles.actionIconWrap}>
                <Ionicons name={item.icone} size={24} color={theme.colors.primary} />
              </View>
              <Text style={styles.actionTitle}>{item.titulo}</Text>
              <Text style={styles.actionDescription}>{item.descricao}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Resumo operacional</Text>
          <Text style={styles.sectionSubtitle}>O que precisa de aten\u00e7\u00e3o hoje</Text>
        </View>

        <TouchableOpacity
          style={styles.summaryCard}
          activeOpacity={0.92}
          onPress={() => router.push("/escalas")}
        >
          <View style={styles.summaryTop}>
            <Text style={styles.summaryTitle}>Escalas do dia</Text>
            <Ionicons name="arrow-forward" size={18} color={theme.colors.primary} />
          </View>

          <Text style={styles.summaryLead}>
            {escalasHoje === 0
              ? "Nenhuma escala cadastrada para hoje."
              : `${escalasHoje} escala(s) cadastrada(s) para ${hojeCurto}.`}
          </Text>

          <View style={styles.metricRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{escalasHoje}</Text>
              <Text style={styles.metricLabel}>Ativas hoje</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{equipeAtiva}</Text>
              <Text style={styles.metricLabel}>Profissionais ativos</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.summaryCard}
          activeOpacity={0.92}
          onPress={() => router.push("/trocas")}
        >
          <View style={styles.summaryTop}>
            <Text style={styles.summaryTitle}>Solicita\u00e7\u00f5es de troca</Text>
            <Ionicons name="arrow-forward" size={18} color={theme.colors.primary} />
          </View>

          <Text style={styles.summaryLead}>
            {trocasPendentes === 0
              ? "Nenhuma solicita\u00e7\u00e3o aguardando retorno."
              : `${trocasPendentes} solicita\u00e7\u00e3o(\u00f5es) precisam de acompanhamento.`}
          </Text>

          <View style={styles.metricRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{trocasPendentes}</Text>
              <Text style={styles.metricLabel}>Pendentes</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{trocasAprovadas}</Text>
              <Text style={styles.metricLabel}>Aprovadas</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.summaryCard}
          activeOpacity={0.92}
          onPress={() => router.push("/banco-horas")}
        >
          <View style={styles.summaryTop}>
            <Text style={styles.summaryTitle}>Banco de horas</Text>
            <Ionicons name="arrow-forward" size={18} color={theme.colors.primary} />
          </View>

          <Text style={styles.summaryLead}>
            Abra a calculadora inicial para consolidar horas previstas, extras,
            faltas e saldo final do per\u00edodo.
          </Text>

          <View style={styles.metricRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>MVP</Text>
              <Text style={styles.metricLabel}>Primeira vers\u00e3o</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>4</Text>
              <Text style={styles.metricLabel}>Blocos principais</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  heroCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    ...theme.shadowCard,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  heroLabel: {
    color: "#dce9ff",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  heroTitle: {
    marginTop: 8,
    color: "#ffffff",
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    maxWidth: 240,
  },
  heroIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroDate: {
    marginTop: theme.spacing.sm,
    color: "#dce9ff",
    fontSize: 14,
    textTransform: "capitalize",
  },
  heroStatsRow: {
    marginTop: theme.spacing.xl,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
  },
  heroStat: {
    flex: 1,
    alignItems: "center",
  },
  heroStatValue: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
  },
  heroStatLabel: {
    marginTop: 4,
    color: "#dce9ff",
    fontSize: 13,
    fontWeight: "600",
  },
  heroDivider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  sectionHeader: {
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.colors.text,
  },
  sectionSubtitle: {
    marginTop: 4,
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xl,
  },
  actionCard: {
    width: "48%",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadowCard,
  },
  actionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: theme.colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: theme.colors.textSecondary,
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadowCard,
  },
  summaryTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.text,
  },
  summaryLead: {
    marginTop: theme.spacing.sm,
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.textSecondary,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.lg,
  },
  metricCard: {
    width: "48%",
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    alignItems: "center",
  },
  metricValue: {
    fontSize: 26,
    fontWeight: "800",
    color: theme.colors.primary,
  },
  metricLabel: {
    marginTop: 4,
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});
