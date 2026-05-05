import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Escala, useAppData } from "../context/AppContext";

const setoresFixos = [
  "Todos",
  "Emergência/Ambulância",
  "Raio-X",
  "Serviços Gerais",
];

const turnosFixos = [
  "Todos",
  "Diurno (07h às 19h)",
  "Noturno (19h às 07h)",
  "Plantão Extra",
];

export default function Escalas() {
  const [buscaEscala, setBuscaEscala] = useState("");
  const router = useRouter();
  const { escalas, removerEscala, setEscalaEmEdicao } = useAppData();
  const [filtroFuncionario, setFiltroFuncionario] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [filtroSetor, setFiltroSetor] = useState("Todos");
  const [filtroTurno, setFiltroTurno] = useState("Todos");

  const excluirEscala = (id: string) => {
    Alert.alert("Excluir", "Deseja apagar esta escala?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => removerEscala(id),
      },
    ]);
  };

  const editarEscalaItem = (escala: Escala) => {
    setEscalaEmEdicao(escala);
    router.push("/nova-escala");
  };

  const novaEscala = () => {
    setEscalaEmEdicao(null);
    router.push("/nova-escala");
  };

  const escalasFiltradas = useMemo(() => {
    return escalas.filter((item) => {
      const textoBusca = buscaEscala.toLowerCase();

      const bateBuscaGeral =
        buscaEscala.trim() === "" ||
        item.funcionario.toLowerCase().includes(textoBusca) ||
        item.setor.toLowerCase().includes(textoBusca) ||
        item.turno.toLowerCase().includes(textoBusca) ||
        item.data.toLowerCase().includes(textoBusca);

      const bateFuncionario =
        filtroFuncionario.trim() === "" ||
        item.funcionario.toLowerCase().includes(filtroFuncionario.toLowerCase());

      const bateData =
        filtroData.trim() === "" ||
        item.data.toLowerCase().includes(filtroData.toLowerCase());

      const bateSetor = filtroSetor === "Todos" || item.setor === filtroSetor;

      const bateTurno = filtroTurno === "Todos" || item.turno.includes(filtroTurno);

      return (
        bateBuscaGeral &&
        bateFuncionario &&
        bateData &&
        bateSetor &&
        bateTurno
      );
    });
  }, [escalas, buscaEscala, filtroFuncionario, filtroData, filtroSetor, filtroTurno]);

  const limparFiltros = () => {
    setBuscaEscala("");
    setFiltroFuncionario("");
    setFiltroData("");
    setFiltroSetor("Todos");
    setFiltroTurno("Todos");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#1d5fd0" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Escalas</Text>

        <TouchableOpacity style={styles.addMini} onPress={novaEscala}>
          <Ionicons name="add" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.filtersCard}>
        <View style={styles.filterInputBox}>
          <Ionicons name="search" size={18} color="#5b7091" />
          <TextInput
            style={styles.filterInput}
            placeholder="Pesquisar escala"
            value={buscaEscala}
            onChangeText={setBuscaEscala}
            placeholderTextColor="#8aa4c7"
          />
        </View>

        <View style={styles.filterInputBox}>
          <Ionicons name="person-outline" size={18} color="#5b7091" />
          <TextInput
            style={styles.filterInput}
            placeholder="Filtrar por funcionário"
            value={filtroFuncionario}
            onChangeText={setFiltroFuncionario}
            placeholderTextColor="#8aa4c7"
          />
        </View>

        <View style={styles.filterInputBox}>
          <Ionicons name="calendar-outline" size={18} color="#5b7091" />
          <TextInput
            style={styles.filterInput}
            placeholder="Filtrar por data"
            value={filtroData}
            onChangeText={setFiltroData}
            placeholderTextColor="#8aa4c7"
          />
        </View>

        <Text style={styles.filterLabel}>Setor</Text>
        <View style={styles.optionsWrap}>
          {setoresFixos.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.optionButton,
                filtroSetor === item && styles.optionButtonActive,
              ]}
              onPress={() => setFiltroSetor(item)}
            >
              <Text
                style={[
                  styles.optionText,
                  filtroSetor === item && styles.optionTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.filterLabel}>Turno</Text>
        <View style={styles.optionsWrap}>
          {turnosFixos.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.optionButton,
                filtroTurno === item && styles.optionButtonActive,
              ]}
              onPress={() => setFiltroTurno(item)}
            >
              <Text
                style={[
                  styles.optionText,
                  filtroTurno === item && styles.optionTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.clearButton} onPress={limparFiltros}>
          <Text style={styles.clearButtonText}>Limpar filtros</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={escalasFiltradas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <Ionicons name="calendar-outline" size={24} color="#1d5fd0" />
            </View>

            <View style={styles.info}>
              <Text style={styles.nome}>{item.funcionario}</Text>
              <Text style={styles.detail}>Setor: {item.setor}</Text>
              <Text style={styles.detail}>Turno: {item.turno}</Text>
              <Text style={styles.detail}>Data: {item.data}</Text>
            </View>

            <View style={styles.actionColumn}>
              <TouchableOpacity onPress={() => editarEscalaItem(item)}>
                <Ionicons name="create-outline" size={22} color="#5b7091" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => excluirEscala(item.id)}
                style={{ marginTop: 14 }}
              >
                <Ionicons name="trash-outline" size={22} color="#dc2626" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="calendar-clear-outline" size={42} color="#8aa4c7" />
            <Text style={styles.emptyTitle}>Nenhuma escala encontrada</Text>
            <Text style={styles.emptyText}>
              Ajuste os filtros ou toque no botão + para criar uma escala.
            </Text>
          </View>
        }
      />
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
  addMini: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#2f7cf3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  filtersCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d9e3ef",
    padding: 14,
    marginBottom: 12,
  },
  filterInputBox: {
    height: 48,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d9e3ef",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  filterInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: "#203a5f",
  },
  filterLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#20406a",
    marginTop: 6,
    marginBottom: 8,
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
  clearButton: {
    marginTop: 8,
    backgroundColor: "#1d5fd0",
    borderRadius: 10,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d9e3ef",
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#e8f0fb",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  nome: {
    fontSize: 20,
    fontWeight: "700",
    color: "#20406a",
    marginBottom: 4,
  },
  detail: {
    fontSize: 15,
    color: "#4d6788",
    lineHeight: 22,
  },
  actionColumn: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
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
