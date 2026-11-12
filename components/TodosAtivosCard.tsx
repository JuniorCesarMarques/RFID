import { Ativo } from "@/types";
import { StyleSheet, Text, View } from "react-native";


export default function TodosAtivosCard({ ativo }: { ativo: Ativo }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.wCodigo]}>{ativo?.codigo_ativo}</Text>
      <Text style={[styles.cell, styles.wDescricao]}>{ativo?.descricao}</Text>
      <Text style={[styles.cell, styles.wCategoria]}>
        {ativo?.centroDeCustos}
      </Text>
      <Text style={[styles.cell, styles.wSubdivisao]}>{ativo?.subdivisao}</Text>
      <Text style={[styles.cell, styles.wValor]}>{ativo?.valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  cell: {
    fontSize: 14,
    color: "#475569",
    paddingHorizontal: 6,
  },

  // LARGURAS FIXAS (IMPORTANTE: iguais ao ListaAtivos)
  wCodigo: { width: 120 },
  wStatus: { width: 100 },
  wDescricao: { width: 200 },
  wCategoria: { width: 150 },
  wSubdivisao: { width: 150 },
  wValor: { width: 100 }
});
