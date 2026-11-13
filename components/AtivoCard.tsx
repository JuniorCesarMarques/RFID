import { AtivoComEncontrado } from "@/app/(tabs)/inventario";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import FontAwesome from "@expo/vector-icons/FontAwesome";

type Props = {
  onEditIconPress: (ativo: AtivoComEncontrado) => void;
  onSearchIconPress: (epc: string) => void;
  onLongPress: (c: string) => void;
  selecteds: string[];
  ativo: AtivoComEncontrado;
  showIcon: boolean;
};

export default function AtivoCard({
  ativo,
  onSearchIconPress,
  showIcon,
  onLongPress,
  selecteds,
}: Props) {
  const valor = Number(ativo.valor);

  return (
    <Pressable
      style={[
        styles.row,
        {
          backgroundColor: selecteds.includes(ativo.codigo_ativo)
            ? "rgba(59, 130, 246, 0.15)"
            : "transparent",
        },
      ]}
      onPress={() => {
        if (showIcon && selecteds.length) {
          onLongPress(ativo.codigo_ativo);
        }
      }}
      onLongPress={() => {
        if (showIcon) {
          onLongPress(ativo.codigo_ativo);
        }
      }}
    >
      <View style={styles.wBuscar}>
        <TouchableOpacity onPress={() => onSearchIconPress(ativo.codigo_ativo)}>
          <FontAwesome size={20} name="search" />
        </TouchableOpacity>
      </View>

      <View style={[styles.cell, styles.wStatus]}>
        {ativo.Encontrado ? (
          <FontAwesome name="check-square" size={20} color="green" />
        ) : (
          <Text></Text>
        )}
      </View>
      <Text style={[styles.cell, styles.wCodigo]}>{ativo.codigo_ativo}</Text>
      <Text style={[styles.cell, styles.wDescricao]}>{ativo.descricao}</Text>
      <Text style={[styles.cell, styles.wCentroDeCustos]}>
        {ativo.centroDeCustos}
      </Text>
      <Text style={[styles.cell, styles.wCentroDeCustos]}>
        {ativo.novoCentroDeCustos}
      </Text>
      <Text style={[styles.cell, styles.wSubdivisao]}>{ativo.subdivisao}</Text>
      <Text style={[styles.cell, styles.wSubdivisao]}>
        {ativo.novaSubdivisao}
      </Text>
      <Text style={[styles.cell, styles.wValor]}>
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(valor)}
      </Text>
    </Pressable>
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
  btn: {
    alignSelf: "flex-start",
    padding: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 2 },
  },
  btnEdit: {
    backgroundColor: "#2563eb", // azul
  },
  cell: {
    fontSize: 14,
    color: "#475569",
    paddingHorizontal: 6,
  },

  // LARGURAS FIXAS (IMPORTANTE: iguais ao ListaAtivos)
  wBuscar: { width: 100 },
  wCodigo: { width: 120 },
  wStatus: { width: 100 },
  wDescricao: { width: 200 },
  wCategoria: { width: 150 },
  wCentroDeCustos: { width: 150 },
  wSubdivisao: { width: 150 },
  wValor: { width: 100 },
});
