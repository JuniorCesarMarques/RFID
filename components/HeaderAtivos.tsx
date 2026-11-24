import { StyleSheet, Text, View } from "react-native";
import { ATIVOS_COLUMN_WIDTHS } from "./ativosTableStyles";

export default function HeaderAtivos() {
  return (
    <View style={styles.rowHeader}>
      <Text style={[styles.cellHeader, ATIVOS_COLUMN_WIDTHS.wBuscar]}>Buscar</Text>
      <Text style={[styles.cellHeader, ATIVOS_COLUMN_WIDTHS.wStatus]}>Status</Text>
      <Text style={[styles.cellHeader, ATIVOS_COLUMN_WIDTHS.wCodigo]}>Código</Text>
      <Text style={[styles.cellHeader, ATIVOS_COLUMN_WIDTHS.wDescricao]}>Descrição</Text>
      <Text style={[styles.cellHeader, ATIVOS_COLUMN_WIDTHS.wCentroDeCustos]}>
        Centro de custos
      </Text>
      <Text style={[styles.cellHeader, ATIVOS_COLUMN_WIDTHS.wCategoria]}>
        Novo centro de custos
      </Text>
      <Text style={[styles.cellHeader, ATIVOS_COLUMN_WIDTHS.wSubdivisao]}>Subdivisão</Text>
      <Text style={[styles.cellHeader, ATIVOS_COLUMN_WIDTHS.wSubdivisao]}>Nova subdivisão</Text>
      <Text style={[styles.cellHeader, ATIVOS_COLUMN_WIDTHS.wValor]}>Valor</Text>
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

});
