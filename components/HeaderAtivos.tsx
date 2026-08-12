import { StyleSheet, Text, View } from "react-native";

export default function HeaderAtivos() {
  return (
    <View style={styles.rowHeader}>
      <Text style={[styles.cellHeader, styles.wBuscar]}>Buscar</Text>
      <Text style={[styles.cellHeader, styles.wStatus]}>Status</Text>
      <Text style={[styles.cellHeader, styles.wCodigo]}>Código</Text>
      <Text style={[styles.cellHeader, styles.wDescricao]}>Descrição</Text>
      <Text style={[styles.cellHeader, styles.wCentroDeCustos]}>
        Centro de custos
      </Text>
      <Text style={[styles.cellHeader, styles.wCategoria]}>
        Novo centro de custos
      </Text>
      <Text style={[styles.cellHeader, styles.wSubdivisao]}>Subdivisão</Text>
      <Text style={[styles.cellHeader, styles.wSubdivisao]}>Nova subdivisão</Text>
      {/* {abaLidos && <Text style={[styles.cellHeader, styles.wEditar]}>Editar</Text>} */}
    </View>
  );
}

const styles = StyleSheet.create({
  cellHeader: {
    fontWeight: "600",
    fontSize: 14,
    color: "#334155",
    textAlign: "left",
    paddingHorizontal: 6,
  },

  rowHeader: {
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
    paddingVertical: 10,
    paddingHorizontal: 8,
  },

  wBuscar: { width: 100 },
  wCodigo: { width: 100 },
  wStatus: { width: 100 },
  wDescricao: { width: 200 },
  wCategoria: { width: 150 },
  wCentroDeCustos: { width: 150 },
  wSubdivisao: { width: 150 },
  wEditar: { width: 70 },
});
