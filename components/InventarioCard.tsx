import { Inventario } from "@/types";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  inventario: Inventario;
  onDelete: () => void;
  onExport: () => void;
  onRestore: () => void;
}

export function InventarioCard({
  inventario,
  onDelete,
  onExport,
  onRestore,
}: Props) {
  const date = new Date(inventario.dataHoraAtualizacao);
  const formattedDate = `${date.getDate()}/${String(
    date.getMonth() + 1,
  ).padStart(2, "0")}/${date.getFullYear()}`;

  return (
    <View style={styles.card}>
      <View style={styles.item}>
        <View style={{ flexDirection: "row", gap: 5 }}>
          <Text style={styles.codigo}>{inventario.codigo_inventario}</Text>
          <Text>-</Text>
          <Text style={styles.descricao}>{inventario.descricao}</Text>
        </View>

        <View style={styles.iconsContainer}>
          <TouchableOpacity
            onPress={onExport}
            style={[styles.iconButton, styles.exportButton]}
          >
            <AntDesign name="file-excel" size={18} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onRestore}
            style={[styles.iconButton, styles.restoreButton]}
          >
            <Entypo name="export" size={18} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onDelete}
            style={[styles.iconButton, styles.deleteButton]}
          >
            <AntDesign name="delete" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <Text>Última modificação: {formattedDate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 5,
    backgroundColor: "#f4f4f4",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  iconButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  exportButton: {
    backgroundColor: "#16a34a", // verde
  },

  restoreButton: {
    backgroundColor: "#2563eb", // azul
  },

  deleteButton: {
    backgroundColor: "#dc2626", // vermelho
  },
  codigo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  descricao: {
    fontSize: 14,
    color: "#555",
  },
});
