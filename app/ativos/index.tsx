import AtivosToolbar from "@/components/AtivosToolbar";
import { useAtivo } from "@/contexts/AtivosContext";
import { Ativo } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import AlertComponent from "@/components/AlertComponent";
import EmptyState from "@/components/EmptyState";
import Filtro from "@/components/Filtro";
import PaginationNativePaper from "@/components/Pagination";
import TodosAtivosCard from "@/components/TodosAtivosCard";
import { useInventarios } from "@/contexts/InventariosContext";
import { buscarTodosAtivos } from "@/database/ativosRepository";
import { useDataBase } from "@/database/DatabaseContext";
import usePagination from "@/hooks/usePagination";
import { ActivityIndicator } from "@ant-design/react-native";


export default function Ativos() {
  const { ativos, setAtivos } = useAtivo();

  const [loading, setLoading] = useState<boolean>(false);

  const { inventarioAtual } = useInventarios();

  const [valorFiltro, setValorFiltro] = useState("");
  const [campoFiltro, setCampoFiltro] = useState("codigo_ativo");

  const {
    inicio,
    fim,
    paginaAtual,
    setPaginaAtual,
    setNumberOfItemsPerPage,
    numberOfItemsPerPage,
  } = usePagination();

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
        setLoading(false);
      }
    })();
  }, [inventarioAtual?.id]);

  return (
    <View style={styles.screen}>
      {/* Filtro */}
      {!inventarioAtual && (
        <AlertComponent text="Selecione um inventário para habilitar a importação" />
      )}
      <AtivosToolbar inventarioAtual={inventarioAtual} setLoading={setLoading} />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={100} color={"#60A5FA"} />
          <Text style={styles.loadingText}>Importando ativos...</Text>
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
  listContainer: {
    paddingBottom: 100,
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
