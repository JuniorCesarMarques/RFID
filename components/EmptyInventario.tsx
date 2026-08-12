import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { StyleSheet, Text, View } from "react-native";

export default function EmptyInventario() {
  return (
    <View style={styles.container}>
      {/* BACKGROUND */}
      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />
      <View style={styles.circleCenter} />

      <View style={styles.content}>
        {/* ÍCONE */}
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons
            name="archive-search-outline"
            size={56}
            color="#60A5FA"
          />
        </View>

        {/* TÍTULO */}
        <Text style={styles.title}>
          Selecione um inventário
        </Text>

        {/* DESCRIÇÃO */}
        <Text style={styles.description}>
          Escolha um inventário para visualizar os ativos vinculados, acompanhar
          leituras realizadas e utilizar os filtros e ferramentas operacionais
          disponíveis.
        </Text>

        {/* STATUS */}
        <View style={styles.statusContainer}>
          <View style={styles.statusDot} />

          <Text style={styles.statusText}>
            Nenhum inventário ativo no momento
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "flex-start",
    alignItems: "center",
    overflow: "hidden",
    padding: 28,
  },

  circleTop: {
    position: "absolute",
    top: -120,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 999,
    backgroundColor: "rgba(96, 165, 250, 0.08)",
  },

  circleBottom: {
    position: "absolute",
    bottom: -160,
    left: -100,
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: "rgba(96, 165, 250, 0.05)",
  },

  circleCenter: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "rgba(96, 165, 250, 0.04)",
  },

  content: {
    alignItems: "center",
    width: "100%",
    maxWidth: 360,
  },

  iconWrapper: {
    width: 115,
    height: 115,
    borderRadius: 999,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,

    shadowColor: "#60A5FA",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 6,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 16,
  },

  description: {
    fontSize: 16,
    lineHeight: 28,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 28,
  },

  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    marginBottom: 34,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#F59E0B",
  },

  statusText: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "600",
  },

  previewContainer: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 18,
    gap: 14,
  },

  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  previewCircle: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: "#DBEAFE",
  },

  previewBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
  },

  previewTexts: {
    flex: 1,
    gap: 8,
  },

  previewLineLarge: {
    height: 12,
    width: "78%",
    borderRadius: 999,
    backgroundColor: "#CBD5E1",
  },

  previewLineMedium: {
    height: 12,
    width: "62%",
    borderRadius: 999,
    backgroundColor: "#CBD5E1",
  },

  previewLineSmall: {
    height: 10,
    width: "42%",
    borderRadius: 999,
    backgroundColor: "#E2E8F0",
  },

  previewDivider: {
    height: 1,
    backgroundColor: "#E2E8F0",
  },
});