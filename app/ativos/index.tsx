import AtivosToolbar from "@/components/AtivosToolbar";
import { useAtivo } from "@/contexts/AtivosContext";
import { Ativo, AtivoToInsert } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";

import { exportTemplate } from "@/services/exportTamplate";

import AlertComponent from "@/components/AlertComponent";
import EmptyState from "@/components/EmptyState";
import Filtro from "@/components/Filtro";
import ModalGenerico from "@/components/ModalGenerico";
import NovoAtivoForm from "@/components/NovoAtivoForm";
import PaginationNativePaper from "@/components/Pagination";
import TodosAtivosCard from "@/components/TodosAtivosCard";
import { useInventarios } from "@/contexts/InventariosContext";
import {
  buscarAtivoPeloCodigo,
  buscarTodosAtivos,
  inserirAtivoLista,
} from "@/database/ativosRepository";
import { useDataBase } from "@/database/DatabaseContext";
import usePagination from "@/hooks/usePagination";
import { exportXLSX } from "@/services/exportXLSX";

import useImportAtivos from "@/hooks/useImportAtivos";
import { ActivityIndicator } from "@ant-design/react-native";
import Toast from "react-native-toast-message";

export default function Ativos() {
  const { ativos, setAtivos } = useAtivo();

  const { inventarioAtual } = useInventarios();

  const [ativosLoading, setAtivosLoading] = useState(false);


  const {
    errorsModalState,
    errosPreview,
    erros,
    closeErrorsModal,
    handleImportacao,
    importAtivosLoading,
  } = useImportAtivos();

  // Filtro
  const [valorFiltro, setValorFiltro] = useState("");
  const [campoFiltro, setCampoFiltro] = useState("codigo_ativo");

  // Add Ativo
  const [addModalState, setAddModalState] = useState<boolean>(false);

  // Pagination
  const {
    inicio,
    fim,
    paginaAtual,
    setPaginaAtual,
    setNumberOfItemsPerPage,
    numberOfItemsPerPage,
  } = usePagination();

  const openAddAtivoModal = () => {
    setAddModalState(true);
  };

  const closeAddAtivoModal = () => {
    setAddModalState(false);
  };

  const handleAddAtivo = async (ativo: AtivoToInsert) => {
    Object.keys(ativo).forEach((key) => {
      const typedKey = key as keyof AtivoToInsert;
      const value = ativo[typedKey];

      if (typeof value === "string") {
        (ativo as any)[typedKey] = value.trim();
      }
    });

    try {
      const res = await buscarAtivoPeloCodigo(db, ativo.codigo_ativo.trim());

      if (res) {
        Toast.show({
          type: "error",
          text1: "Já existe um ativo com este código",
        });
        return;
      }

      await inserirAtivoLista(db, ativo);

      const novoAtivo: Ativo = {
        inventario_id: ativo.inventario_id,
        codigo_ativo: ativo.codigo_ativo,
        centroDeCustos: ativo.centroDeCustos,
        subdivisao: ativo.subdivisao ?? "",
        descricao: ativo.descricao,
        categoria: ativo.categoria ?? "",
        comentarios: ativo.comentarios ?? "",
        localizacao: "",
        dataHoraCriacao: ativo.dataHoraCriacao ?? "",
        dataHoraInventariado: ativo.dataHoraInventariado ?? "",
        dataHoraAtualizacao: ativo.dataHoraAtualizacao ?? "",
        status: ativo.status ?? 0,
      };

      setAtivos((prev) => [...prev, novoAtivo]);

      closeAddAtivoModal();

      Toast.show({
        type: "success",
        text1: "Ativo adicionado com sucesso",
      });
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Erro ao adicionar ativo",
      });
      console.log(err);
    }
  };

  const handleExportarErros = async () => {
    const nome = `erros-importacao-${inventarioAtual?.descricao ?? "inventario"}-${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, "-")}.xlsx`;

    if (!erros) return;
    exportXLSX({ rows: erros, nome });
  };

  const ativosFiltrados = useMemo(() => {
    if (!valorFiltro || !campoFiltro) {
      return ativos;
    }

    return ativos.filter((ativo) => {
      const valorCampo = ativo[campoFiltro as keyof Ativo];

      return (
        typeof valorCampo === "string" &&
        valorCampo.toLowerCase().includes(valorFiltro.toLowerCase())
      );
    });
  }, [ativos, valorFiltro]);

  useEffect(() => {
    setPaginaAtual(0);
  }, [valorFiltro, campoFiltro]);

  const ativosSliced = ativosFiltrados.slice(inicio, fim);

  const db = useDataBase();

  useEffect(() => {
    (async () => {
      try {
        const rows: Ativo[] = await buscarTodosAtivos(inventarioAtual?.id, db);

        setAtivos(rows);
      } catch (err) {
        console.error(err);
      } finally {
        setAtivosLoading(false);
      }
    })();
  }, [inventarioAtual?.id]);

  return (
    <View style={styles.screen}>
      {/* MODAIS */}
      <ModalGenerico
        onClose={closeErrorsModal}
        height="50%"
        width="90%"
        modalState={errorsModalState}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {erros && erros.length > 100
              ? `Erros encontrados na importação (exibindo 100 de ${erros.length})`
              : "Erros encontrados na importação"}
          </Text>

          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.lineColumn]}>
              Linha
            </Text>

            <Text style={[styles.tableHeaderText, styles.errorColumn]}>
              Erro
            </Text>
          </View>

          <ScrollView
            contentContainerStyle={styles.errorsContainer}
            showsVerticalScrollIndicator={false}
          >
            {errosPreview
              ?.sort((a, b) => a.linha - b.linha)
              .map((e, i) => (
                <View key={i} style={styles.tableRow}>
                  <View style={styles.lineColumn}>
                    <Text style={styles.lineText}>{e.linha}</Text>
                  </View>

                  <View style={styles.errorColumn}>
                    <View style={styles.errorItem}>
                      <Text style={styles.errorText}>{e.erro}</Text>
                    </View>
                  </View>
                </View>
              ))}
          </ScrollView>
          {!!erros?.length && (
            <View style={styles.exportButtonContainer}>
              <Button title="Exportar erros" onPress={handleExportarErros} />
            </View>
          )}
        </View>
      </ModalGenerico>

      {!!inventarioAtual && (
        <ModalGenerico
          bgColor="#F5F7FA"
          height={700}
          width={400}
          modalState={addModalState}
          onClose={closeAddAtivoModal}
        >
          <NovoAtivoForm
            onSubmit={handleAddAtivo}
            inventarioId={inventarioAtual.id}
          />
        </ModalGenerico>
      )}
      {/* Filtro */}
      {!inventarioAtual && (
        <AlertComponent text="Selecione um inventário para habilitar a importação" />
      )}
      <AtivosToolbar
        onAddAtivo={openAddAtivoModal}
        onExportTemplate={exportTemplate}
        onUpload={handleImportacao}
        inventarioAtual={inventarioAtual}
      />
      {importAtivosLoading || ativosLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={100} color={"#60A5FA"} />
          {importAtivosLoading && (
            <Text style={styles.loadingText}>Importando ativos...</Text>
          )}
        </View>
      ) : (
        <View>
          <Filtro
            field={campoFiltro}
            value={valorFiltro}
            setValue={setValorFiltro}
            seFiled={setCampoFiltro}
          />
          {/* Scroll horizontal para a tabela */}
          <PaginationNativePaper
            numberOfItemsPerPage={numberOfItemsPerPage}
            onItemsPerPageChange={setNumberOfItemsPerPage}
            totalItems={ativosFiltrados.length}
            setPage={setPaginaAtual}
            page={paginaAtual}
          />
          {ativos.length ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <View style={styles.container}>
                <View style={styles.rowHeader}>
                  <Text style={[styles.cellHeader, styles.cellCodigo]}>
                    Código
                  </Text>
                  <Text style={[styles.cellHeader, styles.cellDescricao]}>
                    Descrição
                  </Text>
                  <Text style={[styles.cellHeader, styles.cellCategoria]}>
                    Centro de custos
                  </Text>
                  <Text style={[styles.cellHeader, styles.cellSubdivisao]}>
                    Subdivisão
                  </Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={true}>
                  <View style={styles.listContainer}>
                    {ativosSliced.map((ativo, index) => (
                      <TodosAtivosCard key={index} ativo={ativo} />
                    ))}
                  </View>
                </ScrollView>
              </View>
            </ScrollView>
          ) : (
            <EmptyState tableMode />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  modalContent: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
  },

  tableHeader: {
    flexDirection: "row",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#F3F4F6",
  },

  tableHeaderText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    textTransform: "uppercase",
  },
  listContainer: {
    paddingBottom: 100,
  },
  lineColumn: {
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: "#D1D5DB",
  },

  errorColumn: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  lineText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  errorsContainer: {
    paddingBottom: 12,
  },
  errorItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  errorText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: "#4B5563",
  },
  exportButtonContainer: {
    padding: 12,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#D1D5DB",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#D1D5DB",
    minHeight: 44,
  },
  rowHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "baseline",
  },
  cellHeader: {
    fontWeight: "600",
    fontSize: 14,
    color: "#334155",
    textAlign: "left",
    paddingHorizontal: 6,
  },
  cellCodigo: {
    width: 100,
  },
  cellDescricao: {
    width: 200,
  },
  cellCategoria: {
    width: 150,
  },
  cellSubdivisao: {
    width: 150,
  },
  loadingContainer: {
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },

  loadingText: {
    marginTop: 12,
    color: "#64748B",
    fontSize: 15,
  },
});
