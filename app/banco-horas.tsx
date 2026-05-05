import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppData } from "../context/AppContext";
import { theme } from "../theme/appTheme";

type CampoHorario =
  | "horasPrevistas"
  | "horasTrabalhadas"
  | "horasExtras"
  | "atrasos"
  | "faltas"
  | "plantoesExtras"
  | "saldoAnterior";

type FormularioBancoHoras = {
  funcionarioId: string;
  dataInicial: string;
  dataFinal: string;
  cargaHoraria: string;
  horasPrevistas: string;
  horasTrabalhadas: string;
  horasExtras: string;
  atrasos: string;
  faltas: string;
  plantoesExtras: string;
  saldoAnterior: string;
};

const estadoInicial: FormularioBancoHoras = {
  funcionarioId: "",
  dataInicial: "",
  dataFinal: "",
  cargaHoraria: "",
  horasPrevistas: "",
  horasTrabalhadas: "",
  horasExtras: "",
  atrasos: "",
  faltas: "",
  plantoesExtras: "",
  saldoAnterior: "",
};

function formatarData(valor: string) {
  const digitos = valor.replace(/\D/g, "").slice(0, 8);

  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 4) return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
  return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
}

function formatarHoras(valor: string) {
  const digitos = valor.replace(/\D/g, "").slice(0, 7);

  if (digitos.length === 0) return "";
  if (digitos.length <= 2) return digitos;

  const horas = digitos.slice(0, -2);
  const minutos = digitos.slice(-2);
  return `${horas}:${minutos}`;
}

function horarioParaMinutos(valor: string) {
  if (!valor.includes(":")) return 0;

  const [horasTexto, minutosTexto] = valor.split(":");
  const horas = Number(horasTexto);
  const minutos = Number(minutosTexto);

  if (
    Number.isNaN(horas) ||
    Number.isNaN(minutos) ||
    horas < 0 ||
    minutos < 0 ||
    minutos >= 60
  ) {
    return 0;
  }

  return horas * 60 + minutos;
}

function minutosParaHorario(totalMinutos: number) {
  const negativo = totalMinutos < 0;
  const absoluto = Math.abs(totalMinutos);
  const horas = Math.floor(absoluto / 60);
  const minutos = absoluto % 60;
  const prefixo = negativo ? "-" : "";

  return `${prefixo}${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
}

export default function BancoHoras() {
  const router = useRouter();
  const { funcionarios } = useAppData();
  const [formulario, setFormulario] = useState<FormularioBancoHoras>(estadoInicial);

  const funcionarioSelecionado = funcionarios.find(
    (item) => item.id === formulario.funcionarioId
  );

  const resumo = useMemo(() => {
    const horasPrevistas = horarioParaMinutos(formulario.horasPrevistas);
    const horasTrabalhadas = horarioParaMinutos(formulario.horasTrabalhadas);
    const horasExtras = horarioParaMinutos(formulario.horasExtras);
    const atrasos = horarioParaMinutos(formulario.atrasos);
    const faltas = horarioParaMinutos(formulario.faltas);
    const plantoesExtras = horarioParaMinutos(formulario.plantoesExtras);
    const saldoAnterior = horarioParaMinutos(formulario.saldoAnterior);

    const saldoPeriodo = horasExtras + plantoesExtras - atrasos - faltas;
    const saldoFinal = saldoAnterior + saldoPeriodo;
    const diferencaJornada = horasTrabalhadas - horasPrevistas;

    return {
      horasPrevistas,
      horasTrabalhadas,
      saldoPeriodo,
      saldoFinal,
      diferencaJornada,
    };
  }, [formulario]);

  const atualizarCampo = (campo: keyof FormularioBancoHoras, valor: string) => {
    setFormulario((anterior) => ({ ...anterior, [campo]: valor }));
  };

  const atualizarHorario = (campo: CampoHorario, valor: string) => {
    atualizarCampo(campo, formatarHoras(valor));
  };

  const selecionarFuncionario = (funcionarioId: string) => {
    const funcionario = funcionarios.find((item) => item.id === funcionarioId);

    setFormulario((anterior) => ({
      ...anterior,
      funcionarioId,
      cargaHoraria: funcionario?.cargaHoraria || anterior.cargaHoraria,
    }));
  };

  const limparFormulario = () => {
    setFormulario(estadoInicial);
  };

  const cardDestaque =
    resumo.saldoFinal > 0
      ? {
          titulo: "Saldo positivo",
          descricao: "O per\u00edodo fechou com cr\u00e9dito no banco de horas.",
          cor: theme.colors.success,
          fundo: "#e9f7f0",
          icone: "trending-up-outline" as const,
        }
      : resumo.saldoFinal < 0
        ? {
            titulo: "Saldo negativo",
            descricao: "H\u00e1 d\u00e9bito acumulado para compensar.",
            cor: theme.colors.danger,
            fundo: "#fdeced",
            icone: "trending-down-outline" as const,
          }
        : {
            titulo: "Saldo zerado",
            descricao: "O per\u00edodo est\u00e1 equilibrado at\u00e9 aqui.",
            cor: theme.colors.primary,
            fundo: theme.colors.accentSoft,
            icone: "remove-outline" as const,
          };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={theme.colors.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Banco de horas</Text>

        <TouchableOpacity
          style={styles.headerAction}
          onPress={limparFormulario}
          activeOpacity={0.92}
        >
          <Ionicons name="refresh-outline" size={18} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <Ionicons name="time-outline" size={16} color={theme.colors.primary} />
            <Text style={styles.heroBadgeText}>Calculadora inicial</Text>
          </View>

          <Text style={styles.heroTitle}>Fechamento simples do banco de horas</Text>
          <Text style={styles.heroText}>
            Preencha o per\u00edodo, registre as ocorr\u00eancias e acompanhe o saldo do
            per\u00edodo em formato `hh:mm`.
          </Text>

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatCard}>
              <Text style={styles.heroStatValue}>{minutosParaHorario(resumo.saldoPeriodo)}</Text>
              <Text style={styles.heroStatLabel}>Saldo do per\u00edodo</Text>
            </View>

            <View style={styles.heroStatCard}>
              <Text style={styles.heroStatValue}>{minutosParaHorario(resumo.saldoFinal)}</Text>
              <Text style={styles.heroStatLabel}>Saldo final</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Identifica\u00e7\u00e3o</Text>
          <Text style={styles.sectionSubtitle}>
            Escolha o profissional e o recorte do per\u00edodo analisado.
          </Text>

          <Text style={styles.label}>Funcion\u00e1rio</Text>
          <View style={styles.chipsWrap}>
            {funcionarios.map((item) => {
              const ativo = formulario.funcionarioId === item.id;

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.chip, ativo && styles.chipActive]}
                  onPress={() => selecionarFuncionario(item.id)}
                  activeOpacity={0.92}
                >
                  <Text style={[styles.chipText, ativo && styles.chipTextActive]}>
                    {item.nome}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>Data inicial</Text>
              <TextInput
                style={styles.input}
                placeholder="01/04/2026"
                placeholderTextColor={theme.colors.textMuted}
                value={formulario.dataInicial}
                onChangeText={(valor) => atualizarCampo("dataInicial", formatarData(valor))}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.halfField}>
              <Text style={styles.label}>Data final</Text>
              <TextInput
                style={styles.input}
                placeholder="30/04/2026"
                placeholderTextColor={theme.colors.textMuted}
                value={formulario.dataFinal}
                onChangeText={(valor) => atualizarCampo("dataFinal", formatarData(valor))}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View style={styles.infoStrip}>
            <Ionicons name="briefcase-outline" size={18} color={theme.colors.primary} />
            <Text style={styles.infoStripText}>
              {funcionarioSelecionado
                ? `${funcionarioSelecionado.cargo} • ${funcionarioSelecionado.setor}`
                : "Selecione um funcion\u00e1rio para carregar o contexto da jornada."}
            </Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Jornada</Text>
          <Text style={styles.sectionSubtitle}>
            Informe o previsto para o per\u00edodo e o total realmente trabalhado.
          </Text>

          <Text style={styles.label}>Carga hor\u00e1ria contratual</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 36h semanais ou 12x36"
            placeholderTextColor={theme.colors.textMuted}
            value={formulario.cargaHoraria}
            onChangeText={(valor) => atualizarCampo("cargaHoraria", valor)}
          />

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>Horas previstas</Text>
              <TextInput
                style={styles.input}
                placeholder="144:00"
                placeholderTextColor={theme.colors.textMuted}
                value={formulario.horasPrevistas}
                onChangeText={(valor) => atualizarHorario("horasPrevistas", valor)}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.halfField}>
              <Text style={styles.label}>Horas trabalhadas</Text>
              <TextInput
                style={styles.input}
                placeholder="152:30"
                placeholderTextColor={theme.colors.textMuted}
                value={formulario.horasTrabalhadas}
                onChangeText={(valor) => atualizarHorario("horasTrabalhadas", valor)}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View style={styles.metricRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{minutosParaHorario(resumo.horasPrevistas)}</Text>
              <Text style={styles.metricLabel}>Previstas</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{minutosParaHorario(resumo.horasTrabalhadas)}</Text>
              <Text style={styles.metricLabel}>Realizadas</Text>
            </View>
          </View>

          <View style={styles.insightCard}>
            <Ionicons
              name={
                resumo.diferencaJornada >= 0 ? "checkmark-circle-outline" : "alert-circle-outline"
              }
              size={18}
              color={
                resumo.diferencaJornada >= 0 ? theme.colors.success : theme.colors.warning
              }
            />
            <Text style={styles.insightText}>
              Diferen\u00e7a entre realizadas e previstas:{" "}
              {minutosParaHorario(resumo.diferencaJornada)}
            </Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Ocorr\u00eancias</Text>
          <Text style={styles.sectionSubtitle}>
            Use o formato `hh:mm` para compor cr\u00e9ditos e d\u00e9bitos do per\u00edodo.
          </Text>

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>Horas extras</Text>
              <TextInput
                style={styles.input}
                placeholder="08:00"
                placeholderTextColor={theme.colors.textMuted}
                value={formulario.horasExtras}
                onChangeText={(valor) => atualizarHorario("horasExtras", valor)}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.halfField}>
              <Text style={styles.label}>Plant\u00f5es extras</Text>
              <TextInput
                style={styles.input}
                placeholder="12:00"
                placeholderTextColor={theme.colors.textMuted}
                value={formulario.plantoesExtras}
                onChangeText={(valor) => atualizarHorario("plantoesExtras", valor)}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>Atrasos</Text>
              <TextInput
                style={styles.input}
                placeholder="01:30"
                placeholderTextColor={theme.colors.textMuted}
                value={formulario.atrasos}
                onChangeText={(valor) => atualizarHorario("atrasos", valor)}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.halfField}>
              <Text style={styles.label}>Faltas</Text>
              <TextInput
                style={styles.input}
                placeholder="12:00"
                placeholderTextColor={theme.colors.textMuted}
                value={formulario.faltas}
                onChangeText={(valor) => atualizarHorario("faltas", valor)}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View style={styles.ruleCard}>
            <Ionicons name="calculator-outline" size={18} color={theme.colors.primary} />
            <Text style={styles.ruleText}>
              Saldo do per\u00edodo = horas extras + plant\u00f5es extras - atrasos -
              faltas
            </Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Resultado</Text>
          <Text style={styles.sectionSubtitle}>
            Consolida o saldo anterior com o total calculado no per\u00edodo.
          </Text>

          <Text style={styles.label}>Saldo anterior</Text>
          <TextInput
            style={styles.input}
            placeholder="04:00"
            placeholderTextColor={theme.colors.textMuted}
            value={formulario.saldoAnterior}
            onChangeText={(valor) => atualizarHorario("saldoAnterior", valor)}
            keyboardType="number-pad"
          />

          <View
            style={[
              styles.statusCard,
              { backgroundColor: cardDestaque.fundo, borderColor: cardDestaque.cor },
            ]}
          >
            <View style={[styles.statusIconWrap, { backgroundColor: cardDestaque.cor }]}>
              <Ionicons name={cardDestaque.icone} size={18} color="#ffffff" />
            </View>

            <View style={styles.statusContent}>
              <Text style={[styles.statusTitle, { color: cardDestaque.cor }]}>
                {cardDestaque.titulo}
              </Text>
              <Text style={styles.statusDescription}>{cardDestaque.descricao}</Text>
            </View>
          </View>

          <View style={styles.metricRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{minutosParaHorario(resumo.saldoPeriodo)}</Text>
              <Text style={styles.metricLabel}>Saldo do per\u00edodo</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{minutosParaHorario(resumo.saldoFinal)}</Text>
              <Text style={styles.metricLabel}>Saldo final</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingBottom: 28,
  },
  heroCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
    ...theme.shadowCard,
  },
  heroBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.accentSoft,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 7,
  },
  heroBadgeText: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  heroTitle: {
    marginTop: theme.spacing.md,
    fontSize: 25,
    lineHeight: 31,
    fontWeight: "800",
    color: theme.colors.text,
  },
  heroText: {
    marginTop: theme.spacing.sm,
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.textSecondary,
  },
  heroStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.lg,
  },
  heroStatCard: {
    width: "48%",
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    alignItems: "center",
  },
  heroStatValue: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.primary,
  },
  heroStatLabel: {
    marginTop: 4,
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  sectionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
    ...theme.shadowCard,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: theme.colors.text,
  },
  sectionSubtitle: {
    marginTop: 6,
    marginBottom: theme.spacing.sm,
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.textSecondary,
  },
  label: {
    marginTop: theme.spacing.sm,
    marginBottom: 8,
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  chipText: {
    color: theme.colors.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  chipTextActive: {
    color: "#ffffff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfField: {
    width: "48%",
  },
  input: {
    minHeight: 52,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceMuted,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 14,
    fontSize: 15,
    color: theme.colors.text,
  },
  infoStrip: {
    marginTop: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.accentSoft,
    padding: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
  },
  infoStripText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    lineHeight: 19,
    color: theme.colors.primaryStrong,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.md,
  },
  metricCard: {
    width: "48%",
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceMuted,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    alignItems: "center",
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.primary,
  },
  metricLabel: {
    marginTop: 4,
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  insightCard: {
    marginTop: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: "#fbfdff",
    padding: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
  },
  insightText: {
    marginLeft: 10,
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: theme.colors.textSecondary,
  },
  ruleCard: {
    marginTop: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.accentSoft,
    padding: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
  },
  ruleText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    lineHeight: 19,
    color: theme.colors.primaryStrong,
  },
  statusCard: {
    marginTop: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    padding: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
  },
  statusIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  statusContent: {
    flex: 1,
    marginLeft: 12,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: "800",
  },
  statusDescription: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: theme.colors.textSecondary,
  },
});
