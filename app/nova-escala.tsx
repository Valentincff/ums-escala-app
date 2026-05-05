import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppData } from "../context/AppContext";
import { theme } from "../theme/appTheme";

const setoresFixos = ["Emergência/Ambulância", "Raio-X", "Serviços Gerais"];

const turnosFixos = [
  "Diurno (07h às 19h)",
  "Noturno (19h às 07h)",
  "Plantão Extra",
];

const formatarDataBR = (data: Date) => data.toLocaleDateString("pt-BR");

const parseDataBR = (texto?: string) => {
  if (!texto) return new Date();

  const partes = texto.split("/");
  if (partes.length !== 3) return new Date();

  const dia = Number(partes[0]);
  const mes = Number(partes[1]);
  const ano = Number(partes[2]);
  const data = new Date(ano, mes - 1, dia);

  if (
    data.getDate() !== dia ||
    data.getMonth() !== mes - 1 ||
    data.getFullYear() !== ano
  ) {
    return new Date();
  }

  return data;
};

const dataValida = (texto: string) => {
  const partes = texto.split("/");
  if (partes.length !== 3) return false;

  const dia = Number(partes[0]);
  const mes = Number(partes[1]);
  const ano = Number(partes[2]);

  if (!dia || !mes || !ano) return false;
  if (mes < 1 || mes > 12) return false;
  if (dia < 1 || dia > 31) return false;

  const data = new Date(ano, mes - 1, dia);

  return (
    data.getDate() === dia &&
    data.getMonth() === mes - 1 &&
    data.getFullYear() === ano
  );
};

type SectionProps = {
  titulo: string;
  descricao: string;
  children: React.ReactNode;
};

function SectionCard({ titulo, descricao, children }: SectionProps) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{titulo}</Text>
      <Text style={styles.sectionDescription}>{descricao}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

export default function NovaEscala() {
  const router = useRouter();
  const {
    funcionarios,
    adicionarEscala,
    editarEscala,
    escalaEmEdicao,
    setEscalaEmEdicao,
  } = useAppData();

  const [funcionarioId, setFuncionarioId] = useState(
    escalaEmEdicao?.funcionarioId || ""
  );
  const [setor, setSetor] = useState(escalaEmEdicao?.setor || "");
  const [turnosSelecionados, setTurnosSelecionados] = useState<string[]>(
    escalaEmEdicao?.turno?.split(" / ") || []
  );
  const [data, setData] = useState(escalaEmEdicao?.data || "");
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [dataTemp, setDataTemp] = useState(parseDataBR(escalaEmEdicao?.data));

  const funcionarioSelecionado = funcionarios.find((f) => f.id === funcionarioId);
  const titulo = escalaEmEdicao ? "Editar escala" : "Nova escala";
  const resumoTurnos =
    turnosSelecionados.length === 0 ? "Nenhum turno selecionado" : turnosSelecionados.join(" • ");

  useEffect(() => {
    if (funcionarioSelecionado?.setor && !escalaEmEdicao) {
      setSetor(funcionarioSelecionado.setor);
    }
  }, [escalaEmEdicao, funcionarioSelecionado]);

  const toggleTurno = (turno: string) => {
    setTurnosSelecionados((prev) =>
      prev.includes(turno) ? prev.filter((t) => t !== turno) : [...prev, turno]
    );
  };

  const onChangeData = (_event: unknown, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setMostrarCalendario(false);
    }

    if (selectedDate) {
      setDataTemp(selectedDate);
      setData(formatarDataBR(selectedDate));
    }
  };

  const voltar = () => {
    setEscalaEmEdicao(null);
    router.back();
  };

  const salvarEscala = () => {
    if (!funcionarioSelecionado || !setor || turnosSelecionados.length === 0 || !data) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    if (!dataValida(data)) {
      Alert.alert("Erro", "Data inválida.");
      return;
    }

    const turnoFinal = turnosSelecionados.join(" / ");

    const novaEscala = {
      id: escalaEmEdicao?.id || Date.now().toString(),
      funcionario: funcionarioSelecionado.nome,
      funcionarioId,
      setor,
      turno: turnoFinal,
      data,
    };

    const resultado = escalaEmEdicao
      ? editarEscala(novaEscala)
      : adicionarEscala(novaEscala);

    if (!resultado.ok) {
      Alert.alert("Erro", resultado.mensagem || "Não foi possível salvar a escala.");
      return;
    }

    setEscalaEmEdicao(null);
    Alert.alert("Sucesso", escalaEmEdicao ? "Escala atualizada." : "Escala criada.");
    router.back();
  };

  if (funcionarios.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerAction} onPress={voltar}>
            <Ionicons name="chevron-back" size={28} color={theme.colors.primary} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.title}>{titulo}</Text>
          </View>

          <View style={styles.headerAction} />
        </View>

        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="people-outline" size={32} color={theme.colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Cadastre funcionários antes de montar a escala</Text>
          <Text style={styles.emptyText}>
            A nova escala precisa de pelo menos um profissional disponível na equipe.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/funcionarios")}
          >
            <Text style={styles.primaryButtonText}>Ir para funcionários</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerAction} onPress={voltar}>
          <Ionicons name="chevron-back" size={28} color={theme.colors.primary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.title}>{titulo}</Text>
          <Text style={styles.headerSubtitle}>Selecione profissional, setor, turnos e data</Text>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={salvarEscala}>
          <Text style={styles.save}>Salvar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View>
              <Text style={styles.summaryLabel}>Resumo da escala</Text>
              <Text style={styles.summaryName}>
                {funcionarioSelecionado?.nome || "Selecione um funcionário"}
              </Text>
            </View>
            <View style={styles.summaryIconWrap}>
              <Ionicons name="calendar-outline" size={22} color={theme.colors.primary} />
            </View>
          </View>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryItemLabel}>Setor</Text>
              <Text style={styles.summaryItemValue}>{setor || "Não definido"}</Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryItemLabel}>Data</Text>
              <Text style={styles.summaryItemValue}>{data || "Não definida"}</Text>
            </View>
          </View>

          <View style={styles.turnoPreview}>
            <Text style={styles.summaryItemLabel}>Turnos escolhidos</Text>
            <Text style={styles.turnoPreviewText}>{resumoTurnos}</Text>
          </View>
        </View>

        <SectionCard
          titulo="Funcionário"
          descricao="Escolha quem ficará vinculado à escala."
        >
          <View style={styles.optionsWrap}>
            {funcionarios.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.optionButton,
                  funcionarioId === item.id && styles.optionButtonActive,
                ]}
                onPress={() => setFuncionarioId(item.id)}
                activeOpacity={0.92}
              >
                <Text
                  style={[
                    styles.optionText,
                    funcionarioId === item.id && styles.optionTextActive,
                  ]}
                >
                  {item.nome || "Sem nome"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </SectionCard>

        <SectionCard
          titulo="Setor"
          descricao="Defina o local principal de atuação do plantão."
        >
          <View style={styles.optionsWrap}>
            {setoresFixos.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.optionButton, setor === item && styles.optionButtonActive]}
                onPress={() => setSetor(item)}
                activeOpacity={0.92}
              >
                <Text
                  style={[styles.optionText, setor === item && styles.optionTextActive]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </SectionCard>

        <SectionCard
          titulo="Turnos"
          descricao="Você pode selecionar um ou mais turnos para a mesma data."
        >
          <View style={styles.optionsWrap}>
            {turnosFixos.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.optionButton,
                  turnosSelecionados.includes(item) && styles.optionButtonActive,
                ]}
                onPress={() => toggleTurno(item)}
                activeOpacity={0.92}
              >
                <Text
                  style={[
                    styles.optionText,
                    turnosSelecionados.includes(item) && styles.optionTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </SectionCard>

        <SectionCard
          titulo="Data"
          descricao="Selecione o dia em que essa escala será aplicada."
        >
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setMostrarCalendario((prev) => !prev)}
            activeOpacity={0.92}
          >
            <View style={styles.dateIconWrap}>
              <Ionicons name="calendar-clear-outline" size={20} color={theme.colors.primary} />
            </View>

            <View style={styles.dateTextWrap}>
              <Text style={styles.dateLabel}>Data escolhida</Text>
              <Text style={styles.dateText}>{data || "Selecionar data"}</Text>
            </View>

            <Ionicons
              name={mostrarCalendario ? "chevron-up" : "chevron-down"}
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>

          {mostrarCalendario && (
            <View style={styles.calendarWrap}>
              <DateTimePicker
                value={dataTemp}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onChangeData}
                locale="pt-BR"
                themeVariant="light"
              />
            </View>
          )}
        </SectionCard>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={salvarEscala}
          activeOpacity={0.92}
        >
          <Text style={styles.primaryButtonText}>
            {escalaEmEdicao ? "Atualizar escala" : "Salvar escala"}
          </Text>
          <Ionicons name="checkmark-circle-outline" size={18} color="#ffffff" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 10 : theme.spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.lg,
  },
  headerAction: {
    width: 56,
  },
  headerCenter: {
    flex: 1,
    paddingHorizontal: theme.spacing.sm,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.text,
    textAlign: "center",
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  saveButton: {
    minWidth: 56,
    alignItems: "flex-end",
  },
  save: {
    color: theme.colors.primary,
    fontWeight: "800",
    fontSize: 15,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxl,
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
  summaryLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  summaryName: {
    marginTop: 6,
    fontSize: 21,
    lineHeight: 27,
    fontWeight: "800",
    color: theme.colors.text,
    maxWidth: 230,
  },
  summaryIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: theme.colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.lg,
  },
  summaryItem: {
    width: "48%",
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },
  summaryItemLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  summaryItemValue: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 21,
    color: theme.colors.text,
    fontWeight: "700",
  },
  turnoPreview: {
    marginTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
  turnoPreviewText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.text,
  },
  sectionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadowCard,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: theme.colors.text,
  },
  sectionDescription: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.textSecondary,
  },
  sectionBody: {
    marginTop: theme.spacing.md,
  },
  optionsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  optionButton: {
    width: "100%",
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 14,
    marginBottom: theme.spacing.sm,
  },
  optionButtonActive: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  optionText: {
    color: theme.colors.text,
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 20,
  },
  optionTextActive: {
    color: "#ffffff",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
  },
  dateIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: theme.colors.accentSoft,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  dateTextWrap: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  dateText: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.text,
  },
  calendarWrap: {
    marginTop: theme.spacing.md,
    borderRadius: theme.radius.md,
    overflow: "hidden",
    alignItems: Platform.OS === "ios" ? "center" : "stretch",
    backgroundColor: theme.colors.surfaceMuted,
  },
  primaryButton: {
    marginTop: theme.spacing.sm,
    height: 54,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.accent,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    marginRight: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: theme.colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: "800",
    color: theme.colors.text,
    textAlign: "center",
  },
  emptyText: {
    marginTop: theme.spacing.sm,
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
  },
});
