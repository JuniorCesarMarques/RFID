import { BarChart3 } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

export default function EmptyDashboard() {
  return (
    <View style={styles.container}>
      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />

      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <BarChart3 size={56} color="#2563eb" />
        </View>

        <Text style={styles.title}>
          Selecione um inventário
        </Text>

        <Text style={styles.description}>
          Escolha um inventário para visualizar indicadores operacionais, métricas RFID e informações patrimoniais em tempo real.
        </Text>

        <View style={styles.statusContainer}>
          <View style={styles.statusDot} />

          <Text style={styles.statusText}>
            Aguardando seleção de inventário
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    paddingHorizontal: 28,
  },

  circleTop: {
    position: "absolute",
    top: -140,
    right: -100,
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: "rgba(37, 99, 235, 0.10)",
  },

  circleBottom: {
    position: "absolute",
    bottom: -180,
    left: -120,
    width: 360,
    height: 360,
    borderRadius: 999,
    backgroundColor: "rgba(37, 99, 235, 0.07)",
  },


  content: {
    alignItems: "center",
    maxWidth: 420,
  },

  iconWrapper: {
    width: 110,
    height: 110,
    borderRadius: 999,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
    shadowColor: "#2563eb",
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 8,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 18,
  },

  description: {
    fontSize: 16,
    lineHeight: 28,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 32,
  },

  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.75)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#f59e0b",
  },

  statusText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
});