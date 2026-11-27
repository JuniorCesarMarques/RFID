import { contarAtivos, inserirAtivo } from "@/database/ativosRepository";
import { useDataBase } from "@/database/DatabaseContext";
import { ParametrosLeitura, ParametrosLeituraManual } from "@/hooks/leitura";
import { useLiveLocation } from "@/hooks/useLiveLocation";
import { AtivosInventario } from "@/types";
import {
  createContext,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Alert } from "react-native";
import {
  BluetoothDevice,
  BluetoothDeviceReadEvent,
} from "react-native-bluetooth-classic";
import { useAtivo } from "./AtivosContext";
import { useBluetooth } from "./BluetoothContext";
import { useInventarios } from "./InventariosContext";

type LeituraContextType = {
  count: number;
  qtdAtivos: number;
  resetReading: () => void;
  leitura: ({ filtro, centroDivisao }: ParametrosLeitura) => Promise<void>;
  leituraManual: ({
    data,
    filtro,
    centroDivisao,
  }: ParametrosLeituraManual) => Promise<
    | {
        success: boolean;
        message: string;
      }
    | undefined
  >;
  atualizarQtdAtivos: () => Promise<void>;
  teveLeitura: RefObject<boolean>;
  naoCadastrado: boolean;
  toggleNaoCadastrados: () => void;
  iniciarLeitura: (
    epc: string,
    dispositivoConectado: BluetoothDevice | null,
  ) => void;
  rssi: number | null;
  setRssiValue: (value: number | null) => void;
  buscandoAtivo: boolean;
  toggleBusca: (value: boolean) => void;
};

const LeituraContext = createContext<LeituraContextType | null>(null);

export default function LeituraProvider({ children }: { children: ReactNode }) {
  const { inventarioAtual } = useInventarios();
  const { location } = useLiveLocation();
  const { ativos } = useAtivo();
  const db = useDataBase();

  const { registerOnRead, registerOnDisconnected } = useBluetooth();

  const [qtdAtivos, setQtdAtivos] = useState<number>(0);
  const [rssi, setRssi] = useState<number | null>(null);
  const lastEpc = useRef<string>("");

  const queueRef = useRef<string[]>([]);

  const [count, setCount] = useState(0);

    const [naoCadastrado, setNaoCadastrado] = useState(false);

  const [buscandoAtivo, setBuscandoAtivo] = useState<boolean>(false);

  const teveLeitura = useRef(false);

  const dataHora = new Date();

  const onRead = (event: BluetoothDeviceReadEvent) => {
    // VERIFICAR O QUE VEM PARA SABER SE NÃO VEM CODIGOS SEM EP
    if (event.data.includes("EP: ") || event.data.includes("RI:")) {
      queueRef.current.push(event.data);
      setCounter();
    }
  };

  function resetReading() {
    queueRef.current = [];
    resetCount();
  }

  useEffect(() => {
    registerOnRead(onRead);
    registerOnDisconnected(resetReading);
  }, []);

  const setCounter = () => {
    setCount((prev) => prev + 1);
  };

  const resetCount = () => {
    setCount(0);
  };

  const atualizarQtdAtivos = useCallback(async () => {
    if (!inventarioAtual) return;

    const res = await contarAtivos(db, inventarioAtual.id);

    if (res) {
      setQtdAtivos(res.total);
    }
  }, [db, inventarioAtual?.id]);

  const toggleNaoCadastrados = () => {
    setNaoCadastrado((prev) => !prev);
  };

  const leituraManual = async ({
    data,
    filtro,
    centroDivisao,
  }: ParametrosLeituraManual) => {
    if (!inventarioAtual) {
      return;
    }

    const codigo = data.codigo;

    // Impede undefined ou erro
    if (!location) {
      Alert.alert("Localização ainda não carregada ou houve erro.");
      return;
    }

    const { latitude, longitude, accuracy } = location.coords;
    const timestamp = location.timestamp;

    let ativosFiltrados =
      filtro.length > 0
        ? ativos.filter((a) => {
            return filtro.some(
              (loc) =>
                loc.centroDeCustos === a.centroDeCustos &&
                loc.subdivisao === a.subdivisao,
            );
          })
        : ativos;

    const ativo = ativosFiltrados.find(
      (a) => codigo === a.codigo_ativo && a.inventario_id == inventarioAtual.id,
    );

    if (!ativo) {
      return { success: false, message: "Ativo não encontrado." };
    }

    try {
      const ativoInventario: AtivosInventario = {
        usuario_responsavel: inventarioAtual.usuario_responsavel,
        inputType: 0,
        latitude,
        longitude,
        accuracy,
        timestamp,
        codigo_ativo: ativo?.codigo_ativo ?? codigo,
        inventario_id: inventarioAtual.id,
        descricao: ativo?.descricao ?? "",
        comentarios: data.comentarios ?? ativo?.comentarios ?? "",
        categoria: ativo?.categoria ?? "",
        centroDeCustos: ativo?.centroDeCustos ?? "",
        subdivisao: ativo?.subdivisao ?? "",
        novoCentroDeCustos:
          data.centroDeCustos ?? centroDivisao?.centroDeCustos ?? null,
        novaSubdivisao: data.subdivisao ?? centroDivisao?.subdivisao ?? null,
        dataHoraInventariado: dataHora,
      };

      await inserirAtivo(db, ativoInventario);
      teveLeitura.current = true;

      const result = await contarAtivos(db, inventarioAtual.id);

      if (!result) {
        return;
      }

      setQtdAtivos(result.total);
      return { success: true, message: "Ativo lido com sucesso." };
    } catch (err) {
      return { success: false, message: "Ativo não encontrado." };
    }
  };

  const leitura = async ({ filtro, centroDivisao }: ParametrosLeitura) => {
    let { centroDeCustos: novoCentroDeCustos, subdivisao: novaSubdivisao } =
      centroDivisao || {};

    if (!inventarioAtual) {
      return;
    }

    // Impede undefined ou erro
    if (!location) {
      Alert.alert("Localização ainda não carregada ou houve erro.");
      return;
    }

    const { latitude, longitude, accuracy } = location.coords;
    const timestamp = location.timestamp;

    const res = queueRef.current.shift();

    if (!res?.includes("EP:")) {
      return;
    } 

    const codigo = res.replace("EP:", "").trim().replace(/^0+/, "");

    console.log(codigo);

    let ativosFiltrados =
      filtro.length > 0
        ? ativos.filter((a) => {
            return filtro.some(
              (loc) =>
                loc.centroDeCustos === a.centroDeCustos &&
                loc.subdivisao === a.subdivisao,
            );
          })
        : ativos;

    const ativo = ativosFiltrados.find(
      (a) => codigo === a.codigo_ativo && a.inventario_id == inventarioAtual.id,
    );

    if (!naoCadastrado && !ativo) return;

    const ativoInventario: AtivosInventario = {
      usuario_responsavel: inventarioAtual.usuario_responsavel,
      inputType: 1,
      latitude,
      longitude,
      accuracy,
      timestamp,
      codigo_ativo: ativo?.codigo_ativo ?? codigo,
      inventario_id: inventarioAtual.id,
      descricao: ativo?.descricao ?? "",
      comentarios: ativo?.comentarios ?? "",
      categoria: ativo?.categoria ?? "",
      centroDeCustos: ativo?.centroDeCustos ?? "",
      subdivisao: ativo?.subdivisao ?? "",
      novoCentroDeCustos: novoCentroDeCustos ?? null,
      novaSubdivisao: novaSubdivisao ?? null,
      dataHoraInventariado: dataHora,
    };

    try {
      await inserirAtivo(db, ativoInventario);

      const result = await contarAtivos(db, inventarioAtual.id);
      teveLeitura.current = true;

      if (!result) {
        return;
      }

      setQtdAtivos(result.total);
    } catch (err) {}
  };

  const iniciarLeitura = (
    epc: string,
    dispositivoConectado: BluetoothDevice | null,
  ) => {
    if (!dispositivoConectado) {
      return;
    }

    toggleBusca(true);
    const epcCompleto = epc.padStart(24, "0");

    dispositivoConectado.write(
      `.iv -x -n -sb epc -sd ${epcCompleto} -sl 96 -so 0020 -sa 4 -st s0 -qt b -qs s0 -ron -io off\r\n`,
    );

    while (queueRef.current.length) {
      const res = queueRef.current.shift();
      if (!res) continue;

      if (res.includes("EP:")) {
        lastEpc.current = res.replace("EP:", "").trim().replace(/^0+/, "");
        continue;
      }

      if (res.includes("RI:") && lastEpc.current.includes(epc)) {
        const ri = res.replace("RI:", "").trim();
        setRssiValue(Number(ri));
      }
    }
  };

  const toggleBusca = (value: boolean) => {
    setBuscandoAtivo(value);
  };

  const setRssiValue = (value: number | null) => {
    setRssi(value);
  };

  return (
    <LeituraContext.Provider
      value={{
        count,
        qtdAtivos,
        resetReading,
        leitura,
        leituraManual,
        iniciarLeitura,
        rssi,
        setRssiValue,
        buscandoAtivo,
        toggleBusca,
        atualizarQtdAtivos,
        teveLeitura,
        naoCadastrado,
        toggleNaoCadastrados,
      }}
    >
      {children}
    </LeituraContext.Provider>
  );
}

export const useLeituraProvider = () => {
  const context = useContext(LeituraContext);

  if (!context) {
    throw new Error(
      "UseLeituraContext deve ser usado dentro de LeituraProvider",
    );
  }

  return context;
};
