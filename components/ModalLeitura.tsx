import { FormData } from "@/components/LeituraManualForm";
import { useAtivo } from "@/contexts/AtivosContext";
import { useBluetooth } from "@/contexts/BluetoothContext";
import { useInventarios } from "@/contexts/InventariosContext";
import useLeitura from "@/hooks/leitura";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useFocusEffect } from "@react-navigation/native";
import { Dispatch, useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import AlertComponent from "./AlertComponent";
import CentrosDeCustosSelect, { CentroDivisao } from "./CentrosDeCustosSelect";
import EmptyLeituraState from "./EmptyLeituraState";
import FiltroSeletor from "./FiltroSeletor";
import LeituraManual from "./LeituraManual";
import ModalGenerico from "./ModalGenerico";

type ModalLeituraType = {
  onCloseModal: () => void;
  totalAtivos: number;
  modalState: boolean;
  setModalState: Dispatch<React.SetStateAction<boolean>>;
};

export type NovoCentroDivisao = {
  novoCentroDeCustos: string | undefined;
  novaSubdivisao: string | undefined;
};

export default function ModalLeitura({
  onCloseModal,
  modalState,
  setModalState,
  totalAtivos,
}: ModalLeituraType) {


  const { ativos } = useAtivo();

  const { count, resetReading, dispositivoConectado } = useBluetooth();

  const { leitura, leituraManual, qtdAtivos, atualizarQtdAtivos, teveLeitura } =
    useLeitura();

  const { inventarioAtual } = useInventarios();

  const [modo, setModo] = useState<number>(0);

  const [filtro, setFiltro] = useState<CentroDivisao[]>([]);

  const [cdcSelecionado, setCdcSelecionado] = useState<CentroDivisao | null>(
    null,
  );

  const [incluirManualInfo, setIncluirManualInfo] = useState(false);

  const listaImportada = useMemo(() => {
    return ativos.some((a) => a.inventario_id == inventarioAtual?.id);
  }, [ativos, inventarioAtual?.id]);



useEffect(() => {
  if (modalState) {
    atualizarQtdAtivos();
  }
}, [modalState, atualizarQtdAtivos]);

  const closeModal = () => {
    setModalState(false);
    resetReading();

    if (teveLeitura.current) {
      onCloseModal();
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (modalState) {
        leitura({
          filtro,
          centroDivisao: cdcSelecionado,
        });
      }
    }, [count]),
  );

  const handleSubmit = async (data: FormData) => {
    const res = await leituraManual({
      data,
      filtro,
      centroDivisao: cdcSelecionado,
    });

    if (!res?.success) {
      Toast.show({
        type: "error",
        text1: res?.message,
        position: "top",
        topOffset: 60,
      });

      return false;
    }

    Toast.show({
      type: "success",
      text1: res.message,
    });

    return true;
  };

  const resetFiltrosState = () => {
    setFiltro([]);
    setCdcSelecionado(null);
  };

  useEffect(() => {
    if(modalState){
      resetFiltrosState();
    }
  }, [inventarioAtual?.id, modalState]);


  return (
    <ModalGenerico
      onOpen={() => {
        teveLeitura.current = false;
      }}
      width="95%"
      height={`${listaImportada ? "65%" : "45%"}`}
      modalState={modalState}
      onClose={closeModal}
      basedOnKeyboard
    >
      {listaImportada ? (
        <View style={styles.wrapper}>
          <View style={styles.header}>
            <View style={styles.side} />

            <Text style={styles.headerTitle}>Modo leitura</Text>
          </View>

          <View style={styles.divider} />

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {!dispositivoConectado && (
              <AlertComponent text="Conecte o leitor RFID para habilitar a leitura automática" />
            )}

            <FiltroSeletor selecionados={filtro} setSelecionados={setFiltro} />
            <View>
              <CentrosDeCustosSelect
                incluiManualInfo={incluirManualInfo}
                selecionado={cdcSelecionado}
                setSelecionado={setCdcSelecionado}
              />
            </View>

            <SegmentedControl
              style={styles.segmented}
              values={["RFID", "Manual"]}
              selectedIndex={dispositivoConectado ? modo : 1}
              enabled={!!dispositivoConectado}
              onChange={(event) =>
                setModo(event.nativeEvent.selectedSegmentIndex)
              }
            />

            {!modo && dispositivoConectado ? (
              <View style={styles.containerLeitura}>
                <Text style={styles.titulo}>Leituras realizadas</Text>

                <Text style={styles.contador}>{count}</Text>

                <Text style={styles.titulo}>
                  Ativos do inventário que foram encontrados
                </Text>

                <Text style={styles.contador}>
                  {qtdAtivos} / {totalAtivos}
                </Text>
              </View>
            ) : (
              <LeituraManual checked={incluirManualInfo} setChecked={setIncluirManualInfo} onSubmit={handleSubmit} />
            )}
          </ScrollView>
        </View>
      ) : (
        <EmptyLeituraState />
      )}
      <Toast />
    </ModalGenerico>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 80,
    gap: 10,
    flexGrow: 1,
  },

  containerLeitura: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    width: "100%",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    height: 60,
  },

  side: {
    width: 40,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },

  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
  },

  segmented: {
    width: "90%",
    marginBottom: 20,
  },

  titulo: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },

  contador: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 8,
  },

  progresso: {
    fontSize: 18,
    color: "#333",
  },

  aviso: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },

  modal: {
    width: "90%",
    height: "50%",
    backgroundColor: "white",
    borderRadius: 12,
    position: "relative",
    justifyContent: "flex-start",
  },

  TextoLeitura: {
    fontSize: 35,
  },
});
