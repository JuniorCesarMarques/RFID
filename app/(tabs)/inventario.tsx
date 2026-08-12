import { AtivosInventario } from "@/types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

import { ActivityIndicator } from "@ant-design/react-native";

import { useDataBase } from "@/database/DatabaseContext";
import { Picker } from "@react-native-picker/picker";

import { FormData } from "@/components/InventarioForm";

import PaginationNativePaper from "@/components/Pagination";

import EditModal from "@/components/EditModal";
import ListaAtivos from "@/components/ListaAtivos";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SubmitHandler } from "react-hook-form";

import ModalLeitura from "@/components/ModalLeitura";

import DeleteModal from "@/components/DeleteModal";
import InventarioForm from "@/components/InventarioForm";
import ModalGenerico from "@/components/ModalGenerico";
import { useInventarios } from "@/contexts/InventariosContext";
import { buscarAtivosInventario } from "@/database/ativosRepository";
import {
  criarInventario,
  getInventariosEmAberto,
} from "@/database/inventariosRepository";
import usePagination from "@/hooks/usePagination";
import { codigoInventarioExiste } from "@/services/validacoes";

import EditCdcBtn from "@/components/EditCdcBtn";
import EditarCentroDeCustos, { Data } from "@/components/EditarCentroDeCustos";
import EmptyInventario from "@/components/EmptyInventario";
import EmptyState from "@/components/EmptyState";
import Filtro from "@/components/Filtro";
import Segmented from "@/components/Segmented";
import editarCentrosService from "@/services/editarCentrosService";
import { useFocusEffect } from "expo-router";
import Toast from "react-native-toast-message";

export type AtivoComEncontrado = AtivosInventario & {
  id: number;
  Encontrado: number;
};

export default function TelaInventario() {
  const db = useDataBase();

  const { inventarios, setInventarios, inventarioAtual, setInventarioAtual } =
    useInventarios();

  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [modalState, setModalState] = useState<boolean>(false);
  const [addModal, setAddModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [houveAlteracaoCentros, setHouveAlteracaoCentros] = useState(0);
  const [editCdcs, setEditCdcs] = useState<boolean>(false);

  const [deleteModalState, setDeleteModalState] = useState<boolean>(false);

  const [ativosInventario, setAtivosInventario] = useState<
    AtivoComEncontrado[]
  >([]);

  const [valorFiltro, setValorFiltro] = useState("");
  const [campoFiltro, setCampoFiltro] = useState("codigo_ativo");


  let ativosPorStatus;
  switch (selectedTab) {
    // Lidos
    case 1:
      ativosPorStatus = ativosInventario.filter((a) => a.Encontrado === 1);
      break;
    // Pendentes
    case 2:
      ativosPorStatus = ativosInventario.filter((a) => a.Encontrado === 0);
      break;
    // Extras
    case 3:
      ativosPorStatus = ativosInventario.filter((a) => a.Encontrado === 2);
      break;
    // Todos
    default:
      ativosPorStatus = ativosInventario.filter((a) => a.Encontrado !== 2);
  }

  const {
    inicio,
    fim,
    paginaAtual,
    setPaginaAtual,
    numberOfItemsPerPage,
    setNumberOfItemsPerPage,
  } = usePagination();

  const ativosFiltrados = useMemo(() => {
    if (!valorFiltro || !campoFiltro) {
      return ativosPorStatus;
    }

    return ativosPorStatus.filter((ativo) => {
      const valorCampo = ativo[campoFiltro as keyof AtivoComEncontrado];

      return (
        typeof valorCampo === "string" &&
        valorCampo.toLowerCase().includes(valorFiltro.toLowerCase())
      );
    });
  }, [ativosPorStatus, valorFiltro]);

  let ativosSliced = ativosFiltrados.slice(inicio, fim);

  useEffect(() => {
    setPaginaAtual(0);
  }, [campoFiltro, valorFiltro]);

  const onSelectedTab = (i: number) => {
    setSelectedTab(i);
    setPaginaAtual(0);
  };

  const handleSelectedCard = (idAtivo: number) => {
    setSelectedCards((prev) =>
      selectedCards.includes(idAtivo)
        ? selectedCards.filter((id) => id !== idAtivo)
        : [...prev, idAtivo],
    );
  };

  const handleEditCentro = async (data: Data) => {
    const res = await editarCentrosService(db, {
      ...data,
      ids: selectedCards,
    });

    if (!res?.changes) {
      Toast.show({
        type: "error",
        text1: "Erro ao editar",
        position: "top",
        topOffset: 60,
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Editado com sucesso!",
    });

    setEditCdcs(false);

    if (!inventarioAtual) return;

    const ativos = await buscarAtivosInventario(inventarioAtual.id, db);

    setAtivosInventario(ativos);
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    data.codigo = data.codigo.trim();

    const inventarioExiste = await codigoInventarioExiste(data.codigo, db);

    if (inventarioExiste) {
      Alert.alert("Já existe um inventário com este código");
      return;
    }

    try {
      const result = await criarInventario(db, data, dataHora);

      setInventarioAtual({
        id: result.lastInsertRowId,
        codigo_inventario: data.codigo,
        descricao: data.descricao,
        status: 1,
        dataHoraCriacao: dataHora,
        dataHoraAtualizacao: dataHora,
      });
    } catch (err) {
      Alert.alert("Erro: " + String(err));
    }

    setAddModal(false);

    const result = await getInventariosEmAberto(db);

    setInventarios(result);
  };

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const res = await getInventariosEmAberto(db);

        setInventarios(res);
      })();
    }, []),
  );

  const dataHora = new Date().toISOString();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (!inventarioAtual) {
          return;
        }

        const res = await buscarAtivosInventario(inventarioAtual.id, db);

        setAtivosInventario(res);
      } catch (error) {
        console.error("Erro ao buscar ativos:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [inventarioAtual?.id, houveAlteracaoCentros]);

  const onCloseModalLeitura = async () => {
    setLoading(true);
    try {
      if (!inventarioAtual) {
        return;
      }

      const res = await buscarAtivosInventario(inventarioAtual.id, db);

      setAtivosInventario(res);
    } catch (error) {
      console.error("Erro ao buscar ativos:", error);
    } finally {
      setLoading(false);
    }
  };

  const atualizarListaDeAtivos = async () => {
    if (!inventarioAtual?.id) return;

    const res = await buscarAtivosInventario(inventarioAtual?.id, db);

    setAtivosInventario(res);
  };

  return (
    <View style={styles.container}>
      <ModalLeitura
        onCloseModal={onCloseModalLeitura}
        totalAtivos={ativosInventario.filter((a) => a.Encontrado !== 2).length}
        modalState={modalState}
        setModalState={setModalState}
      />
      <View style={styles.toolbar}>
        {/* PICKER */}
        <View style={styles.pickerWrapper}>
          <Picker
            onValueChange={(value) => {
              const inventario = inventarios.find(
                (i) => i.id === Number(value),
              );
              setInventarioAtual(inventario ? { ...inventario } : null);
            }}
            style={styles.picker}
            selectedValue={inventarioAtual?.id ?? null}
          >
            <Picker.Item label="Selecione um inventário" value={null} />
            {inventarios
              .filter((i) => i.status === 1)
              .map((i, index) => (
                <Picker.Item
                  key={index}
                  label={`${i?.codigo_inventario} - ${i?.descricao}`}
                  value={i.id}
                />
              ))}
          </Picker>
        </View>

        {/* ADICIONAR */}
        <TouchableOpacity
          style={[styles.btn, styles.btnAdd]}
          onPress={() => setAddModal(true)}
        >
          <AntDesign name="plus" size={20} color="#fff" />
        </TouchableOpacity>

        {/* EDITAR */}
        {inventarioAtual !== null && (
          <TouchableOpacity
            style={[styles.btn, styles.btnEdit]}
            onPress={() => setEditModal(true)}
          >
            <AntDesign name="edit" size={20} color="#fff" />
          </TouchableOpacity>
        )}

        {/* Excluir */}
        {inventarioAtual !== null && (
          <TouchableOpacity
            onPress={() => setDeleteModalState(true)}
            style={[styles.btn, styles.btnDelete]}
          >
            <MaterialIcons name="delete" size={20} color="white" />
          </TouchableOpacity>
        )}

        {/* LEITURA */}
        {inventarioAtual !== null && (
          <TouchableOpacity
            style={[styles.btn, styles.btnRead]}
            onPress={() => {
              setModalState(true);
            }}
          >
            <AntDesign name="barcode" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {!inventarioAtual && <EmptyInventario />}

      <ModalGenerico
        width="80%"
        height="30%"
        modalState={addModal}
        onClose={() => setAddModal(false)}
      >
        <InventarioForm
          title="Novo inventário"
          textButton="Criar"
          onSubmit={onSubmit}
        />
      </ModalGenerico>

      {inventarioAtual !== null && (
        <EditModal
          onAlteracao={setHouveAlteracaoCentros}
          editModal={editModal}
          setEditModal={setEditModal}
          inventarioAtual={inventarioAtual}
          setInventarioAtual={setInventarioAtual}
        />
      )}

      {inventarioAtual !== null && (
        <DeleteModal
          deleteModalState={deleteModalState}
          setDeleteModalState={setDeleteModalState}
          setInventarioAtual={setInventarioAtual}
          inventarioAtual={inventarioAtual}
        />
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={100} color={"#60A5FA"} />
        </View>
      )}
      {!loading && inventarioAtual !== null && (
        <View>
          <Segmented selectedTab={selectedTab} onSelectedTab={onSelectedTab} />

          <Filtro
            setValue={setValorFiltro}
            seFiled={setCampoFiltro}
            field={campoFiltro}
            value={valorFiltro}
          />

          <PaginationNativePaper
            numberOfItemsPerPage={numberOfItemsPerPage}
            onItemsPerPageChange={setNumberOfItemsPerPage}
            totalItems={ativosFiltrados.length}
            setPage={setPaginaAtual}
            page={paginaAtual}
          />
          {selectedCards.length > 0 && (
            <EditCdcBtn openModal={() => setEditCdcs(true)} />
          )}

          <ModalGenerico
            width="80%"
            height="30%"
            onClose={() => setEditCdcs(false)}
            modalState={editCdcs}
          >
            <EditarCentroDeCustos
              onEditCentro={handleEditCentro}
              closeModal={() => setEditCdcs(false)}
            />
          </ModalGenerico>

          {ativosPorStatus.length ? (
            <ListaAtivos
              selecteds={selectedCards}
              handleSelectedCard={handleSelectedCard}
              setAtivosInventario={setAtivosInventario}
              onAtivoEditado={atualizarListaDeAtivos}
              ativos={ativosSliced}
              segmented={selectedTab}
              loading={loading}
            />
          ) : (
            <EmptyState tableMode />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: "100%",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 8,
    width: "80%",
  },
  tableColums: {
    borderWidth: 1,
    borderColor: "gray",
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  cell: {
    width: 120,
  },
  inventarioContainer: {
    borderWidth: 1,
    borderColor: "gray",
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    gap: 8,
  },

  /* PICKER */
  pickerWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  picker: {
    width: "100%",
  },

  /* BOTÕES */
  btn: {
    padding: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 2 },
  },
  btnAdd: {
    backgroundColor: "#16a34a", // verde
  },
  btnEdit: {
    backgroundColor: "#2563eb", // azul
  },
  btnDelete: {
    backgroundColor: "red",
  },
  btnRead: {
    backgroundColor: "#7c3aed", // roxo
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
