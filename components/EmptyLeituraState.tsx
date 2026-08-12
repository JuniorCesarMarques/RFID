import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { StyleSheet, Text, View } from "react-native";

export default function EmptyLeituraState() {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <MaterialCommunityIcons
          name="file-import-outline"
          size={42}
          color="#2563EB"
        />
      </View>

      <Text style={styles.title}>
        Nenhuma lista importada
      </Text>

      <Text style={styles.description}>
        Importe a lista deste inventário para habilitar as leituras RFID e
        manuais dos ativos.
      </Text>

      <View style={styles.statusContainer}>
        <View style={styles.statusDot} />

        <Text style={styles.statusText}>
          Leitura indisponível
        </Text>
      </View>

      <View style={styles.flowContainer}>
        <Text style={styles.flowItem}>📄 Lista</Text>

        <Text style={styles.arrow}>→</Text>

        <Text style={styles.flowItem}>📡 Leitura</Text>

        <Text style={styles.arrow}>→</Text>

        <Text style={styles.flowItem}>✅ Validação</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    padding: 24,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },

  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
    textAlign: "center",
  },

  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 18,
  },

  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F8FAFC",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 18,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#F59E0B",
  },

  statusText: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "600",
  },

  flowContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6,
  },

  flowItem: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },

  arrow: {
    color: "#94A3B8",
    fontSize: 14,
  },
});