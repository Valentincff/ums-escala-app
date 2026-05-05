import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppData } from "../context/AppContext";

type Aba = "solicitar" | "recebidas" | "admin";

const turnosFixos = [
  "Diurno (07h às 19h)",
  "Noturno (19h às 07h)",
  "Plantão Extra",
];

export default function Trocas() {
  const router = useRouter();
  const {
    funcionarios,
    trocas,
    solicitarTroca,
    aceitarTroca,
    recusarTroca,
    aprovarTroca,
    rejeitarTroca,
  } = useAppData();

  const [aba, setAba] = useState<Aba>("solicitar");
  const [solicitanteId, setSolicitanteId] = useState("");
  const [destinatarioId, setDestinatarioId] = useState("");
  const [funcionarioRecebidasId, setFuncionarioRecebidasId] = useState("");
  const [data, setData] = useState("");
  const [turno, setTurno] = useState("");
  const [motivo, setMotivo] = useState("");

  const solicitanteNome = useMemo(
    () => funcionarios.find((f) => f.id === solicitanteId)?.nome || "",
    [funcionarios, solicitanteId]
  );

  const destinatarioNome = useMemo(
    () => funcionarios.find((f) => f.id === destinatarioId)?.nome || "",
    [funcionarios, destinatarioId]
  );

  const trocasRecebidas = trocas.filter(
    (t) => !funcionarioRecebidasId || t.destinatarioId === funcionarioRecebidasId
  );
  const trocasAdmin = trocas;

  const enviarSolicitacao = () => {
    const resultado = solicitarTroca({
      solicitanteId,
      solicitanteNome,
      destinatarioId,
      destinatarioNome,
      data,
      turno,
      motivo,
    });

    if (!resultado.ok) {
      Alert.alert("Erro", resultado.mensagem || "Não foi possível solicitar a troca.");
      return;
    }

    Alert.alert("Sucesso", "Solicitação de troca enviada com sucesso.");
    setSolicitanteId("");
    setDestinatarioId("");
    setData("");
    setTurno("");
    setMotivo("");
  };

  const aprovarTrocaAdmin = (id: string) => {
    const resultado = aprovarTroca(id);

    if (!resultado.ok) {
      Alert.alert("Erro", resultado.mensagem || "Não foi possível aprovar.");
      return;
    }

    Alert.alert("Sucesso", "Troca aprovada pela coordenação.");
  };

  const renderStatus = (status: string) => {
    if (status === "Aguardando aceite") {
      return <Text style={[styles.statusBadge, styles.statusPendente]}>{status}</Text>;
    }
    if (status === "Aceita pelo colega") {
      return <Text style={[styles.statusBadge, styles.statusAceita]}>{status}</Text>;
    }
    if (status === "Recusada pelo colega") {
      return <Text style={[styles.statusBadge, styles.statusRecusada]}>{status}</Text>;
    }
    if (status === "Aprovada pela coordenação") {
      return <Text style={[styles.statusBadge, styles.statusAprovada]}>{status}</Text>;
    }
    return <Text style={[styles.statusBadge, styles.statusRejeitada]}>{status}</Text>;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#1d5fd0" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Trocas</Text>

        <View style={{ width: 28 }} />
      </View>

      <View style={styles.tabsWrap}>
        <TouchableOpacity
          style={[styles.tabButton, aba === "solicitar" && styles.tabButtonActive]}
          onPress={() => setAba("solicitar")}
        >
          <Text style={[styles.tabText, aba === "solicitar" && styles.tabTextActive]}>
            Solicitar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, aba === "recebidas" && styles.tabButtonActive]}
          onPress={() => setAba("recebidas")}
        >
          <Text style={[styles.tabText, aba === "recebidas" && styles.tabTextActive]}>
            Recebidas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, aba === "admin" && styles.tabButtonActive]}
          onPress={() => setAba("admin")}
        >
          <Text style={[styles.tabText, aba === "admin" && styles.tabTextActive]}>
            Administração
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {aba === "solicitar" && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Formulário de Solicitação</Text>

            <Text style={styles.label}>Solicitante</Text>
            <View style={styles.optionsWrap}>
              {funcionarios.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.optionButton,
                    solicitanteId === item.id && styles.optionButtonActive,
                  ]}
                  onPress={() => setSolicitanteId(item.id)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      solicitanteId === item.id && styles.optionTextActive,
                    ]}
                  >
                    {item.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Trocar com</Text>
            <View style={styles.optionsWrap}>
              {funcionarios
                .filter((item) => item.id !== solicitanteId)
                .map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.optionButton,
                      destinatarioId === item.id && styles.optionButtonActive,
                    ]}
                    onPress={() => setDestinatarioId(item.id)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        destinatarioId === item.id && styles.optionTextActive,
                      ]}
                    >
                      {item.nome}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Turno</Text>
            <View style={styles.optionsWrap}>
              {turnosFixos.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.optionButton,
                    turno === item && styles.optionButtonActive,
                  ]}
                  onPress={() => setTurno(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      turno === item && styles.optionTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Data</Text>
            <TextInput
              style={styles.input}
              value={data}
              onChangeText={setData}
              placeholder="Ex: 20/04/2026"
            />

            <Text style={styles.label}>Motivo</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={motivo}
              onChangeText={setMotivo}
              placeholder="Descreva o motivo da troca"
              multiline
            />

            <TouchableOpacity style={styles.primaryButton} onPress={enviarSolicitacao}>
              <Text style={styles.primaryButtonText}>Enviar Solicitação</Text>
            </TouchableOpacity>
          </View>
        )}

        {aba === "recebidas" && (
          <>
            <View style={styles.card}>
              <Text style={styles.label}>Visualizar trocas recebidas por</Text>
              <View style={styles.optionsWrap}>
                {funcionarios.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.optionButton,
                      funcionarioRecebidasId === item.id && styles.optionButtonActive,
                    ]}
                    onPress={() => setFuncionarioRecebidasId(item.id)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        funcionarioRecebidasId === item.id && styles.optionTextActive,
                      ]}
                    >
                      {item.nome}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {trocasRecebidas.length === 0 ? (
              <View style={styles.emptyBox}>
                <Ionicons name="swap-horizontal-outline" size={42} color="#8aa4c7" />
                <Text style={styles.emptyTitle}>Nenhuma troca recebida</Text>
                <Text style={styles.emptyText}>
                  Quando alguém solicitar troca para esse funcionário, aparecerá aqui.
                </Text>
              </View>
            ) : (
              trocasRecebidas.map((item) => (
                <View key={item.id} style={styles.card}>
                  <View style={styles.topRow}>
                    <Text style={styles.cardTitle}>{item.solicitanteNome}</Text>
                    {renderStatus(item.status)}
                  </View>

                  <Text style={styles.detail}>Data: {item.data}</Text>
                  <Text style={styles.detail}>Turno: {item.turno}</Text>
                  <Text style={styles.detail}>Motivo: {item.motivo}</Text>

                  {item.status === "Aguardando aceite" && (
                    <View style={styles.actions}>
                      <TouchableOpacity
                        style={styles.approveButton}
                        onPress={() => aceitarTroca(item.id)}
                      >
                        <Text style={styles.actionText}>Aceitar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.rejectButton}
                        onPress={() => recusarTroca(item.id)}
                      >
                        <Text style={styles.actionText}>Recusar</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))
            )}
          </>
        )}

        {aba === "admin" && (
          <>
            {trocasAdmin.length === 0 ? (
              <View style={styles.emptyBox}>
                <Ionicons name="swap-horizontal-outline" size={42} color="#8aa4c7" />
                <Text style={styles.emptyTitle}>Nenhuma troca cadastrada</Text>
                <Text style={styles.emptyText}>
                  As solicitações aparecerão aqui para aprovação.
                </Text>
              </View>
            ) : (
              trocasAdmin.map((item) => (
                <View key={item.id} style={styles.card}>
                  <View style={styles.topRow}>
                    <Text style={styles.cardTitle}>
                      {item.solicitanteNome} → {item.destinatarioNome}
                    </Text>
                    {renderStatus(item.status)}
                  </View>

                  <Text style={styles.detail}>Data: {item.data}</Text>
                  <Text style={styles.detail}>Turno: {item.turno}</Text>
                  <Text style={styles.detail}>Motivo: {item.motivo}</Text>

                  {item.status === "Aceita pelo colega" && (
                    <View style={styles.actions}>
                      <TouchableOpacity
                        style={styles.approveButton}
                        onPress={() => aprovarTrocaAdmin(item.id)}
                      >
                        <Text style={styles.actionText}>Aprovar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.rejectButton}
                        onPress={() => rejeitarTroca(item.id)}
                      >
                        <Text style={styles.actionText}>Rejeitar</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef3f9",
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
    color: "#1d5fd0",
  },
  tabsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  tabButton: {
    backgroundColor: "#e6eef9",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  tabButtonActive: {
    backgroundColor: "#2f7cf3",
  },
  tabText: {
    color: "#1d5fd0",
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#ffffff",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d9e3ef",
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#20406a",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#20406a",
    marginTop: 12,
    marginBottom: 8,
  },
  optionsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  optionButton: {
    backgroundColor: "#e6eef9",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  optionButtonActive: {
    backgroundColor: "#2f7cf3",
  },
  optionText: {
    color: "#1d5fd0",
    fontWeight: "600",
  },
  optionTextActive: {
    color: "#ffffff",
  },
  input: {
    minHeight: 52,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d9e3ef",
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: "#203a5f",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  primaryButton: {
    marginTop: 18,
    backgroundColor: "#2f7cf3",
    borderRadius: 12,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#20406a",
    marginRight: 8,
  },
  detail: {
    fontSize: 15,
    color: "#4d6788",
    marginTop: 6,
    lineHeight: 22,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "700",
  },
  statusPendente: {
    backgroundColor: "#fff4d6",
    color: "#9a6700",
  },
  statusAceita: {
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
  },
  statusAprovada: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  statusRecusada: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  statusRejeitada: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  actions: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "flex-end",
  },
  approveButton: {
    backgroundColor: "#5d97f5",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  rejectButton: {
    backgroundColor: "#1d5fd0",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  emptyBox: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d9e3ef",
    padding: 24,
    alignItems: "center",
    marginTop: 30,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "700",
    color: "#20406a",
  },
  emptyText: {
    marginTop: 6,
    fontSize: 14,
    color: "#6b7f99",
    textAlign: "center",
  },
});
