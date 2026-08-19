import { useInventarios } from "@/contexts/InventariosContext";
import { useDataBase } from "@/database/DatabaseContext";
import { getAllInventarios } from "@/database/inventariosRepository";
import { deletarInventario } from "@/services/deletarInventarioService";
import { Inventario } from "@/types";
import { ActivityIndicator } from "@ant-design/react-native";
import { SetStateAction, useState } from "react";
import { Button, Modal, StyleSheet, Text, View } from "react-native";

export default function DeleteModal({
  deleteModalState,
  setDeleteModalState,
  inventarioAtual,
}: {
  deleteModalState: boolean;
  setDeleteModalState: React.Dispatch<SetStateAction<boolean>>;
  setInventarioAtual: React.Dispatch<SetStateAction<Inventario | null>>;
  inventarioAtual: Inventario | null;
}) {
  const db = useDataBase();
  const { setInventarios, setInventarioAtual } = useInventarios();

  const [loading, setLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    if (inventarioAtual === null) {
      return;
    }

    setLoading(true);

    await deletarInventario(inventarioAtual.id, db);

    const inventariosAtualizados: Inventario[] = await getAllInventarios(db);

    setLoading(false);
    setInventarios(inventariosAtualizados);
    setDeleteModalState(false);
    setInventarioAtual(null);
  };

  return (
    <Modal
      visible={deleteModalState}
      animationType="fade"
      transparent
      onRequestClose={() => setDeleteModalState(false)}
    >
      <View style={styles.container}>
        {!loading ? (
          <View style={styles.modal}>
            <Text>Tem certeza que deseja excluir este inventário?</Text>
            <View style={styles.btnContainer}>
              <Button onPress={() => handleDelete()} title="Sim" />
              <Button onPress={() => setDeleteModalState(false)} title="Não" />
            </View>
            <View
              style={{
                position: "absolute",
                right: 0,
                top: 0,
              }}
            >
              <Button
                title="X"
                color="red"
                onPress={() => setDeleteModalState(false)}
              />
            </View>
          </View>
        ) : (
          <ActivityIndicator />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    flexDirection: "row",
    gap: 15,
  },
  container: {
    backgroundColor: "rgba(0,0,0,0.5)",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    width: "80%",
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
});
