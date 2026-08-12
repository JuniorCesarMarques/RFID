import { AtivosMapa } from "@/app/(tabs)/mapa";
import { Feather } from "@expo/vector-icons";
import { ActivityIndicator } from "@ant-design/react-native";
import Checkbox from "expo-checkbox";
import { SetStateAction, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import EmptyState from "./EmptyState";

export default function ListaAtivosMapa({
  loading,
  ativos,
  setAtivos,
}: {
  loading: boolean;
  ativos: AtivosMapa[];
  setAtivos: React.Dispatch<SetStateAction<AtivosMapa[]>>;
}) {
  const [textInput, setTextInput] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const ativosFiltrados = useMemo(() => {
    return ativos.filter((a) =>
      a.codigo_ativo.toLowerCase().includes(textInput.toLowerCase()),
    );
  }, [ativos, textInput]);

  const selecionados = ativos.filter((a) => a.Aplica).length;

  const toggleAtivo = (codigo: string) => {
    setAtivos((prev) =>
      prev.map((item) =>
        item.codigo_ativo === codigo
          ? {
              ...item,
              Aplica: item.Aplica ? 0 : 1,
            }
          : item,
      ),
    );
  };

  const selecionarTodos = () => {
    setAtivos((prev) =>
      prev.map((a) => ({
        ...a,
        Aplica: 1,
      })),
    );
  };

  const desmarcarTodos = () => {
    setAtivos((prev) =>
      prev.map((a) => ({
        ...a,
        Aplica: 0,
      })),
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Ativos do mapa</Text>

          <Text style={styles.subtitle}>
            {selecionados} de {ativos.length} selecionados
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.actionButton} onPress={selecionarTodos}>
            <Feather tex name="check" size={16} color="#2563eb" />
          </Pressable>

          <Pressable style={styles.actionButton} onPress={desmarcarTodos}>
            <Feather name="x" size={16} color="#ef4444" />
          </Pressable>

          <Pressable
            style={styles.actionButton}
            onPress={() => setCollapsed((prev) => !prev)}
          >
            <Feather
              name={collapsed ? "chevron-down" : "chevron-up"}
              size={18}
              color="#374151"
            />
          </Pressable>
        </View>
      </View>

      {!collapsed && (
        <>
          {/* Busca */}
          <View style={styles.searchContainer}>
            <Feather name="search" size={18} color="#9ca3af" />

            <TextInput
              placeholder="Buscar ativo"
              placeholderTextColor="#9ca3af"
              value={textInput}
              onChangeText={setTextInput}
              style={styles.input}
            />
          </View>

          {/* Lista */}
          {ativosFiltrados.length ? (
            <ScrollView
              style={{ flexGrow: 0 }}
              contentContainerStyle={{ paddingBottom: 4 }}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              {ativosFiltrados.map((a, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.item, !!a.Aplica && styles.itemSelected]}
                  activeOpacity={0.7}
                  onPress={() => toggleAtivo(a.codigo_ativo)}
                >
                  <View style={styles.itemLeft}>
                    <Checkbox
                      value={!!a.Aplica}
                      onValueChange={() => toggleAtivo(a.codigo_ativo)}
                      color={a.Aplica ? "#2563eb" : undefined}
                    />

                    <Text
                      style={[
                        styles.itemText,
                        !!a.Aplica && styles.itemTextSelected,
                      ]}
                    >
                      {a.codigo_ativo}
                    </Text>
                  </View>

                  {!!a.Aplica && (
                    <Feather
                      name="check-circle"
                      size={18}
                      color="#2563eb"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator />
            </View>
          ) : (
            <View style={styles.centerContainer}>
              <EmptyState />
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "52%",
    maxHeight: "70%",
    position: "absolute",
    overflow: "hidden",
    top: 12,
    left: 12,
    zIndex: 10,

    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 14,

    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    marginTop: 2,
    fontSize: 13,
    color: "#6b7280",
  },

  actions: {
    flexDirection: "row",
    gap: 8,
    marginLeft: 12,
  },

  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },

  searchContainer: {
    height: 46,
    borderRadius: 14,
    backgroundColor: "#f3f4f6",

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 14,
    gap: 8,
    marginTop: 14,
    marginBottom: 14,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
  },

  item: {
    minHeight: 56,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 8,

    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#f3f4f6",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  itemSelected: {
    backgroundColor: "#eff6ff",
    borderColor: "#bfdbfe",
  },

  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  itemText: {
    fontSize: 15,
    color: "#374151",
  },

  itemTextSelected: {
    color: "#111827",
    fontWeight: "600",
  },

  centerContainer: {
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
  },
});