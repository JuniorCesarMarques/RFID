import {
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { Inventario } from "@/types";
import { AntDesign, Octicons } from "@expo/vector-icons";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type AtivosToolbarProps = {
  inventarioAtual: Inventario | null;
  onUpload: () => void;
  onExportTemplate: () => void;
  onAddAtivo: () => void;
};

export default function AtivosToolbar({
  inventarioAtual,
  onAddAtivo,
  onUpload,
  onExportTemplate
}: AtivosToolbarProps) {

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.btn,
          styles.btnImport,
          !inventarioAtual && {
            backgroundColor: "#D1D5DB",
            opacity: 0.6,
          },
        ]}
        disabled={!inventarioAtual}
        onPress={onUpload}
      >
        <MaterialIcons name="upload-file" size={27} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, styles.btnDownload]}
        onPress={onExportTemplate}
      >
        <Octicons name="download" size={20} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.btn,
          styles.btnAdd,
          !inventarioAtual && {
            backgroundColor: "#D1D5DB",
            opacity: 0.6,
          },
        ]}
        disabled={!inventarioAtual}
        onPress={onAddAtivo}
      >
        <AntDesign name="plus" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: "row",
    gap: 5,
  },
  btn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 2 },
    justifyContent: "center",
    alignItems: "center",
  },
  btnImport: {
    backgroundColor: "#16a34a", // verde
  },
  btnAdd: {
    backgroundColor: "#2563eb", // azul
  },
  btnDownload: {
    backgroundColor: "#7c3aed",
  },
});
