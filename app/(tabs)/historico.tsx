import EmptyState from "@/components/EmptyState";
import { InventarioCard } from "@/components/InventarioCard";
import { useDataBase } from "@/database/DatabaseContext";
import { getHistoricos } from "@/database/inventariosRepository";
import { deletarInventario } from "@/services/deletarInventarioService";
import { exportHistorico } from "@/services/exportHistoricoService";
import restaurarHistorico from "@/services/restaurarHistorico";
import { Inventario } from "@/types";
import confirmAction from "@/utils/confirmAction";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function Historico() {
  const db = useDataBase();

  const [inventariosHistorico, setInventariosHistorico] = useState<
    Inventario[]
  >([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const historicos = await getHistoricos(db);
        setInventariosHistorico(historicos);
      })();
    }, [db]),
  );

  async function handleDelete(id: number) {
    confirmAction(
      "Excluir histórico",
      "Tem certeza que deseja excluir?",
      "Excluir",
      async () => {
        await deletarInventario(id, db);
        setInventariosHistorico((prev) => prev.filter((i) => i.id !== id));
      },
    );
  }

  async function handleRestore(id: number) {
    confirmAction(
      "Restaurar histórico",
      "Tem certeza que deseja restaurar?",
      "Restaurar",
      async () => {
        await restaurarHistorico(id, db);
        setInventariosHistorico((prev) => prev.filter((i) => i.id !== id));
      },
    );
  }

  if (!inventariosHistorico.length) {
    return (
      <EmptyState
        title="Histórico vazio"
        description="Os inventários concluídos aparecerão aqui."
      />
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        !inventariosHistorico.length && styles.emptyContent,
      ]}
    >
      {inventariosHistorico.map((i) => (
        <InventarioCard
          key={i.id}
          inventario={i}
          onDelete={() => handleDelete(i.id)}
          onExport={() => exportHistorico(i, db)}
          onRestore={() => handleRestore(i.id)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 20,
  },

  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
});
