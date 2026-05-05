import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Funcionario, precisaDeCoren, useAppData } from "../context/AppContext";

type FormData = Funcionario;

const emptyForm: FormData = {
  id: "",
  nome: "",
  cpf: "",
  cargo: "",
  setor: "",
  turno: "",
  cargaHoraria: "",
  telefone: "",
  matricula: "",
  status: "Ativo",
  observacoes: "",
  coren: "",
};

const cargosFixos = [
  "Enfermeiro",
  "Técnico de Enfermagem",
  "Motorista",
  "Raio-X",
  "Serviços Gerais",
];

const setoresFixos = [
  "Emergência/Ambulância",
  "Raio-X",
  "Serviços Gerais",
];

const statusFixos = ["Ativo", "Inativo"];
const turnosFixos = [
  "Diurno (07h às 19h)",
  "Noturno (19h às 07h)",
  "Plantão Extra",
];

const formatCPF = (value: string) => {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

const formatTelefone = (value: string) => {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
};

const formatCoren = (value: string) => {
  return value.replace(/\s/g, "").toUpperCase().slice(0, 20);
};

export default function Funcionarios() {
  const router = useRouter();
  const {
    funcionarios,
    adicionarFuncionario,
    editarFuncionario,
    removerFuncionario,
  } = useAppData();

  const [modalVisible, setModalVisible] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [aba, setAba] = useState<"pessoal" | "profissional" | "jornada" | "outros">(
    "pessoal"
  );
  const [form, setForm] = useState<FormData>(emptyForm);
  const [buscaNome, setBuscaNome] = useState("");

  const tituloModal = useMemo(
    () => (modoEdicao ? "Editar Funcionário" : "Novo Funcionário"),
    [modoEdicao]
  );

  const funcionariosFiltrados = useMemo(() => {
    return funcionarios.filter((item) =>
      item.nome.toLowerCase().includes(buscaNome.toLowerCase())
    );
  }, [funcionarios, buscaNome]);

  const abrirNovo = () => {
    setModoEdicao(false);
    setForm(emptyForm);
    setAba("pessoal");
    setModalVisible(true);
  };

  const abrirEdicao = (funcionario: FormData) => {
    setModoEdicao(true);
    setForm(funcionario);
    setAba("pessoal");
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    setModoEdicao(false);
    setForm(emptyForm);
  };

  const salvar = () => {
    if (!form.nome || !form.cpf || !form.telefone || !form.cargo || !form.setor) {
      Alert.alert("Atenção", "Preencha nome, CPF, telefone, cargo e setor.");
      return;
    }

    if (form.cpf.replace(/\D/g, "").length !== 11) {
      Alert.alert("Erro", "CPF inválido.");
      return;
    }

    if (form.telefone.replace(/\D/g, "").length < 10) {
      Alert.alert("Erro", "Telefone inválido.");
      return;
    }

    if (precisaDeCoren(form.cargo) && !form.coren.trim()) {
      Alert.alert(
        "Atenção",
        "COREN é obrigatório para Enfermeiro(a) e Técnico(a) de Enfermagem."
      );
      return;
    }

    if (modoEdicao) {
      editarFuncionario(form);
      Alert.alert("Sucesso", "Funcionário editado com sucesso.");
    } else {
      adicionarFuncionario({
        ...form,
        id: Date.now().toString(),
      });
      Alert.alert("Sucesso", "Funcionário cadastrado com sucesso.");
    }

    fecharModal();
  };

  const excluirFuncionario = (id: string) => {
    Alert.alert("Excluir", "Deseja excluir este funcionário?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => removerFuncionario(id),
      },
    ]);
  };

  const setCampo = (campo: keyof FormData, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const mostrarCoren = precisaDeCoren(form.cargo);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#1d5fd0" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Funcionários</Text>

        <TouchableOpacity
          style={styles.addMini}
          onPress={abrirNovo}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="add" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={22} color="#5b7091" />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar funcionário..."
            value={buscaNome}
            onChangeText={setBuscaNome}
            placeholderTextColor="#5b7091"
          />
        </View>

        {funcionariosFiltrados.length === 0 && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>Nenhum funcionário encontrado</Text>
            <Text style={styles.emptyText}>Tente pesquisar com outro nome.</Text>
          </View>
        )}

        {funcionariosFiltrados.map((item) => (
          <View key={item.id} style={styles.employeeCard}>
            <Text style={styles.employeeName}>{item.nome}</Text>
            <Text style={styles.employeeInfo}>
              {item.cargo} • CPF: {item.cpf}
              {!!item.coren ? ` • COREN: ${item.coren}` : ""}
            </Text>
            <Text style={styles.employeeInfo}>Setor: {item.setor}</Text>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.editButton} onPress={() => abrirEdicao(item)}>
                <Text style={styles.actionButtonText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => excluirFuncionario(item.id)}
              >
                <Text style={styles.actionButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={fecharModal}>
              <Ionicons name="close" size={28} color="#1d5fd0" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>{tituloModal}</Text>

            <TouchableOpacity onPress={salvar}>
              <Text style={styles.saveText}>Salvar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabsWrap}>
            {["pessoal", "profissional", "jornada", "outros"].map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.tabButton, aba === item && styles.tabButtonActive]}
                onPress={() =>
                  setAba(item as "pessoal" | "profissional" | "jornada" | "outros")
                }
              >
                <Text style={[styles.tabText, aba === item && styles.tabTextActive]}>
                  {item === "pessoal"
                    ? "Pessoal"
                    : item === "profissional"
                      ? "Profissional"
                      : item === "jornada"
                        ? "Jornada"
                        : "Outros"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView style={{ paddingHorizontal: 20 }}>
            {aba === "pessoal" && (
              <>
                <Text style={styles.label}>Nome completo</Text>
                <TextInput
                  style={styles.input}
                  value={form.nome}
                  onChangeText={(v) => setCampo("nome", v)}
                />

                <Text style={styles.label}>CPF</Text>
                <TextInput
                  style={styles.input}
                  value={form.cpf}
                  onChangeText={(v) => setCampo("cpf", formatCPF(v))}
                  keyboardType="numeric"
                />

                <Text style={styles.label}>Telefone</Text>
                <TextInput
                  style={styles.input}
                  value={form.telefone}
                  onChangeText={(v) => setCampo("telefone", formatTelefone(v))}
                  keyboardType="phone-pad"
                />
              </>
            )}

            {aba === "profissional" && (
              <>
                <Text style={styles.label}>Cargo</Text>
                <View style={styles.optionsWrap}>
                  {cargosFixos.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[styles.optionButton, form.cargo === item && styles.optionButtonActive]}
                      onPress={() => setCampo("cargo", item)}
                    >
                      <Text
                        style={[styles.optionText, form.cargo === item && styles.optionTextActive]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>Setor</Text>
                <View style={styles.optionsWrap}>
                  {setoresFixos.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[styles.optionButton, form.setor === item && styles.optionButtonActive]}
                      onPress={() => setCampo("setor", item)}
                    >
                      <Text
                        style={[styles.optionText, form.setor === item && styles.optionTextActive]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>Matrícula</Text>
                <TextInput
                  style={styles.input}
                  value={form.matricula}
                  onChangeText={(v) => setCampo("matricula", v)}
                />

                <Text style={styles.label}>Status</Text>
                <View style={styles.optionsWrap}>
                  {statusFixos.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[styles.optionButton, form.status === item && styles.optionButtonActive]}
                      onPress={() => setCampo("status", item)}
                    >
                      <Text
                        style={[styles.optionText, form.status === item && styles.optionTextActive]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {mostrarCoren && (
                  <>
                    <Text style={styles.label}>Número do COREN</Text>
                    <TextInput
                      style={styles.input}
                      value={form.coren}
                      onChangeText={(v) => setCampo("coren", formatCoren(v))}
                      autoCapitalize="characters"
                    />
                  </>
                )}
              </>
            )}

            {aba === "jornada" && (
              <>
                <Text style={styles.label}>Turno padrão</Text>
                <View style={styles.optionsWrap}>
                  {turnosFixos.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[styles.optionButton, form.turno === item && styles.optionButtonActive]}
                      onPress={() => setCampo("turno", item)}
                    >
                      <Text
                        style={[styles.optionText, form.turno === item && styles.optionTextActive]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>Carga horária</Text>
                <TextInput
                  style={styles.input}
                  value={form.cargaHoraria}
                  onChangeText={(v) => setCampo("cargaHoraria", v)}
                />
              </>
            )}

            {aba === "outros" && (
              <>
                <Text style={styles.label}>Observações</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  multiline
                  value={form.observacoes}
                  onChangeText={(v) => setCampo("observacoes", v)}
                />
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1d5fd0",
  },
  addMini: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#2f7cf3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  searchBox: {
    height: 50,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d9e3ef",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: "#203a5f",
    fontSize: 16,
  },
  employeeCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d9e3ef",
    padding: 16,
    marginBottom: 12,
  },
  employeeName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#20406a",
    marginBottom: 6,
  },
  employeeInfo: {
    fontSize: 15,
    color: "#395577",
    marginBottom: 6,
    lineHeight: 22,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 6,
  },
  editButton: {
    backgroundColor: "#5d97f5",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#1d5fd0",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#eef3f9",
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1d5fd0",
  },
  saveText: {
    color: "#1d5fd0",
    fontWeight: "700",
    fontSize: 18,
  },
  tabsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    marginBottom: 8,
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
  label: {
    fontSize: 18,
    fontWeight: "700",
    color: "#20406a",
    marginTop: 14,
    marginBottom: 8,
  },
  input: {
    height: 52,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d9e3ef",
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#203a5f",
  },
  textArea: {
    height: 110,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  optionsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
  },
  optionButton: {
    backgroundColor: "#e6eef9",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  optionButtonActive: {
    backgroundColor: "#2f7cf3",
  },
  optionText: {
    color: "#1d5fd0",
    fontWeight: "600",
    fontSize: 14,
  },
  optionTextActive: {
    color: "#ffffff",
  },
  emptyBox: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d9e3ef",
    padding: 24,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 12,
  },
  emptyTitle: {
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
