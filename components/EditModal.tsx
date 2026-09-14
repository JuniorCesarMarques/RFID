// EditModal.tsx
import {
  Alert,
  Button,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Checkbox from "expo-checkbox";

import { useInventarios } from "@/contexts/InventariosContext";
import { buscarCentrosAplicaveis } from "@/database/ativosRepository";
import { useDataBase } from "@/database/DatabaseContext";
import { editarInventario } from "@/database/inventariosRepository";
import { Inventario } from "@/types";
import { ActivityIndicator } from "@ant-design/react-native";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "expo-router";
import { SetStateAction, useCallback, useEffect, useState } from "react";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import Toast from "react-native-toast-message";
import { CamposBasicos } from "./CamposBasicosForm";
import EmptyState from "./EmptyState";

type EditModalProps = {
  editModal: boolean;
  setEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  inventarioAtual: Inventario;
  setInventarioAtual: React.Dispatch<SetStateAction<Inventario | null>>;
  onAlteracao: React.Dispatch<SetStateAction<number>>;
};

// Tipo temporario
export type CentrosAplica = {
  aplica: number;
  centroDeCustos: string;
  subdivisao: string;
};

export type EditFormData = {
  codigo: string;
  descricao: string;
  lista: CentrosAplica[];
};

export type EditFormType = {
  codigo: string;
  descricao: string;
  status: number;
};

type StatusType = {
  label: string;
  value: number;
};

export default function EditModal({
  editModal,
  setEditModal,
  inventarioAtual,
  setInventarioAtual,
  onAlteracao,
}: EditModalProps) {
  const db = useDataBase();

  const methods = useForm<EditFormType>({
    defaultValues: {
      status: 1,
    },
  });
  const { control, handleSubmit, reset } = methods;

  const dataHora = new Date().toISOString();

  const { inventarios, setInventarios } = useInventarios();

  const [centros, setCentros] = useState<CentrosAplica[]>([]);

  const [loading, setLoading] = useState(true);

  const statusOptions: StatusType[] = [
    {
      label: "Em andamento",
      value: 1,
    },
    {
      label: "Cancelado",
      value: 2,
    },
    {
      label: "Finalizado",
      value: 3,
    },
  ];

  const onSubmit: SubmitHandler<EditFormType> = async (data) => {
    if (!inventarioAtual) return;

    const outrosInventarios = inventarios.filter(
      (i) => i.codigo_inventario !== inventarioAtual.codigo_inventario,
    );

    const codigoExiste = outrosInventarios.some(
      (i) => i.codigo_inventario === data.codigo,
    );

    if (codigoExiste) {
      Alert.alert("Este código já existe.");
      return;
    }

    const res = await editarInventario(db, data, inventarioAtual.id, dataHora);


    if (res.changes === 0) {
      Toast.show({
        type: "error",
        text1: "Erro ao editar",
        position: "top",
        topOffset: 60,
      });
      return;
    }

    await handleInsertLocals();

    setInventarios((prev) =>
      prev.map((inv) => {
        if (inv.id === inventarioAtual.id) {
          return {
            ...inv,
            status: data.status,
            codigo_inventario: data.codigo,
            descricao: data.descricao,
          };
        }

        return inv;
      }),
    );

    if (data.status !== 1) {
      setInventarioAtual(null);
      setEditModal(false);
      return;
    }

    setInventarioAtual({
      ...inventarioAtual,
      codigo_inventario: data.codigo,
      descricao: data.descricao,
    });

    setEditModal(false);
  };

  useEffect(() => {
     const getInventarios = async () => {
        if (inventarioAtual === null) {
          return;
        }

        setLoading(true);
        const centrosAplica: CentrosAplica[] = await buscarCentrosAplicaveis(
          inventarioAtual.id,
          db,
        );

        setLoading(false);
        setCentros(centrosAplica);
      };

      getInventarios();
  }, [inventarioAtual.id, editModal])


  const handleInsertLocals = async () => {
    const centrosAplicaveis = centros.filter((l) => l.aplica);

    try {
      await db.runAsync(
        `
          DELETE FROM tbCentrosInventarios 
          WHERE inventario_id = ?
        `,
        inventarioAtual.id,
      );

      for (const c of centrosAplicaveis) {
        await db.runAsync(
          `
          INSERT INTO tbCentrosInventarios
          (inventario_id, centroDeCustos, subdivisao)
          VALUES (?, ?, ?)
          `,
          inventarioAtual.id,
          c.centroDeCustos,
          c.subdivisao,
        );
      }

      onAlteracao((prev) => prev + 1);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleCentros = (i: number) => {
    setCentros((prev) => {
      let newCentros = [...prev];

      newCentros[i].aplica = !newCentros[i].aplica ? 1 : 0;

      return newCentros;
    });
  };

  const todosSelecionados =
    centros.length > 0 && centros.every((c) => c.aplica === 1);

  const toggleSelecionarTodos = () => {
    setCentros((prev) =>
      prev.map((c) => ({
        ...c,
        aplica: todosSelecionados ? 0 : 1,
      })),
    );
  };


  return (
    <Modal
      visible={editModal}
      transparent
      animationType="fade"
      onRequestClose={() => {
        setEditModal(false);
      }}
      onFocus={() =>
        reset({
          codigo: inventarioAtual.codigo_inventario,
          descricao: inventarioAtual.descricao,
        })
      }
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Toast />
          <Text style={{ marginBottom: 10, fontWeight: "bold" }}>
            Editar inventário
          </Text>

          <FormProvider {...methods}>
            <CamposBasicos inventarioAtual={inventarioAtual} />
          </FormProvider>

          {centros.length > 0 ? (
            <View>
              <Controller
                control={control}
                name="status"
                defaultValue={inventarioAtual.status}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Status do inventário</Text>

                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={value}
                        onValueChange={onChange}
                        style={styles.picker}
                      >
                        {statusOptions.map((status) => (
                          <Picker.Item
                            key={status.value}
                            label={status.label}
                            value={status.value}
                          />
                        ))}
                      </Picker>
                    </View>

                    {error && (
                      <Text style={styles.errorText}>{error.message}</Text>
                    )}
                  </View>
                )}
              />
              <TouchableOpacity
                onPress={toggleSelecionarTodos}
                style={styles.selectAllContainer}
              >
                <Checkbox value={todosSelecionados} />
                <Text style={styles.selectAllText}>Selecionar todos</Text>
              </TouchableOpacity>
              <ScrollView
                style={{ maxHeight: 300 }}
                showsVerticalScrollIndicator={true}
              >
                <ScrollView
                  horizontal
                  contentContainerStyle={{ padding: 10 }}
                  showsHorizontalScrollIndicator={true}
                >
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        backgroundColor: "#f2f2f2",
                        borderBottomWidth: 1,
                        borderColor: "#ccc",
                        paddingVertical: 8,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          width: 70,
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        Aplica
                      </Text>
                      <Text
                        style={{
                          width: 160,
                          fontWeight: "bold",
                          paddingLeft: 8,
                        }}
                      >
                        Centro de custos
                      </Text>
                      <Text
                        style={{
                          width: 160,
                          fontWeight: "bold",
                          paddingLeft: 8,
                        }}
                      >
                        Subdivisão
                      </Text>
                    </View>
                    {centros.map((l, i) => (
                      <View
                        key={i}
                        style={{
                          flexDirection: "row",
                          borderBottomWidth: 1,
                          borderColor: "#eee",
                          paddingVertical: 8,
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            width: 70,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Checkbox
                            value={centros[i].aplica === 1}
                            onValueChange={() => {
                              toggleCentros(i);
                            }}
                          />
                        </View>
                        <TouchableOpacity
                          style={{ flexDirection: "row" }}
                          onPress={() => toggleCentros(i)}
                        >
                          <Text style={{ width: 160, paddingLeft: 8 }}>
                            {l.centroDeCustos}
                          </Text>
                          <Text style={{ width: 160, paddingLeft: 8 }}>
                            {l.subdivisao}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </ScrollView>
            </View>
          ) : loading ? (
            <View style={{ padding: 15 }}>
              <ActivityIndicator size={80} color={"#60A5FA"} />
            </View>
          ) : (
            <EmptyState
              title="Nenhum centro de custo disponível"
              description="A lista de centros de custos é gerada com base nos ativos importados. Importe uma planilha para visualizar as opções disponíveis."
              tableMode
            />
          )}

          <Button
            title="Salvar"
            onPress={async () => {
              await handleSubmit(onSubmit)();
            }}
          />

          <View
            style={{
              position: "absolute",
              right: 0,
              top: 0,
            }}
          >
            <Button title="X" color="red" onPress={() => setEditModal(false)} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
  },

  inputError: {
    borderColor: "red",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },

  selectAllContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },

  selectAllText: {
    fontWeight: "500",
  },
  fieldContainer: {
    marginBottom: 16,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },

  pickerContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 12,
    overflow: "hidden",
  },

  picker: {
    color: "#0F172A",
    height: 54,
  },

  errorText: {
    color: "#DC2626",
    fontSize: 13,
    marginTop: 4,
  },
});
