import { SetStateAction, useMemo, useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";

import { useAtivo } from "@/contexts/AtivosContext";
import { useDataBase } from "@/database/DatabaseContext";
import { exportTemplate } from "@/services/exportTamplate";
import { exportXLSX } from "@/services/exportXLSX";
import { Erro, pickXLSX } from "@/services/importarPlanilhaAtivos";
import { Inventario } from "@/types";
import Toast from "react-native-toast-message";
import ModalGenerico from "./ModalGenerico";

export default function CarregarXML({
  setLoading,
  inventarioAtual,
}: {
  setLoading: React.Dispatch<SetStateAction<boolean>>;
  inventarioAtual: Inventario | null;
}) {
  const { setAtivos } = useAtivo();
  const db = useDataBase();

  const [modalState, setModalState] = useState<boolean>(false);
  const [erros, setErros] = useState<Erro[]>();

  const errosPreview = useMemo(() => {
    return erros?.slice(0, 100);
  }, [erros]);

  const handlePick = async () => {
    const res = await pickXLSX({ inventarioAtual, setLoading, db });

    if (!res.ok) {

    if(res.motivo === "erros"){
      setErros(res.erros);
      setModalState(true);
      }

  if(res.motivo === "validacao")
    Toast.show({
      type: "error",
      text1: res.message,
    });

      return
    }

    setAtivos(res.ativos);

     Toast.show({
      type: "success",
      text1: res.message,
    });

  };

  const handleExportarErros = async () => {
    const nome = `erros-importacao-${inventarioAtual?.descricao ?? "inventario"}-${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, "-")}.xlsx`;

    if (!erros) return;
    exportXLSX({ rows: erros, nome });
  };

  return (
    <View style={styles.container}>
      <ModalGenerico
        onClose={() => setModalState(false)}
        height="50%"
        width="90%"
        modalState={modalState}
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

      <Button
        disabled={!inventarioAtual}
        title="Carregar XLSX"
        onPress={handlePick}
      />

      <Button title="Baixar modelo" onPress={exportTemplate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: "row",
    gap: 5,
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

  errorsContainer: {
    paddingBottom: 12,
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
  moreErrorsContainer: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#D1D5DB",
    padding: 12,
    backgroundColor: "#FFFBEB",
  },

  moreErrorsText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#92400E",
    textAlign: "center",
  },
});
