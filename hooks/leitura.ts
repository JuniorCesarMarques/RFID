import { CentroDivisao } from "@/components/CentrosDeCustosSelect";
import { FormData } from "@/components/LeituraManualForm";
import { useAtivo } from "@/contexts/AtivosContext";
import { useBluetooth } from "@/contexts/BluetoothContext";
import { useInventarios } from "@/contexts/InventariosContext";
import { contarAtivos, inserirAtivo } from "@/database/ativosRepository";
import { useDataBase } from "@/database/DatabaseContext";
import { useLiveLocation } from "@/hooks/useLiveLocation";
import { Ativo, AtivosInventario } from "@/types";
import { useCallback, useRef, useState } from "react";
import { Alert } from "react-native";

type ParametrosLeitura = {
  filtro: CentroDivisao[];
  centroDivisao: CentroDivisao | null;
};

type ParametrosLeituraManual = {
  data: FormData;
  filtro: CentroDivisao[];
  centroDivisao: CentroDivisao | null;
};

export default function useLeitura() {
  const { tagData, queueRef, dispositivoConectado, ultimo } = useBluetooth();
  const { inventarioAtual } = useInventarios();
  const { location } = useLiveLocation();
  const { ativos } = useAtivo();
  const db = useDataBase();
  const [qtdAtivos, setQtdAtivos] = useState<number>(0);
  const [rssi, setRssi] = useState<number | null>(null);
  const lastEpc = useRef<string>("");

  const [buscandoAtivo, setBuscandoAtivo] = useState<boolean>(false);

  const teveLeitura = useRef(false);

  const dataHora = new Date();

  const atualizarQtdAtivos = useCallback(async () => {
    if (!inventarioAtual) return;

    const res = await contarAtivos(db, inventarioAtual.id);

    if (res) {
      setQtdAtivos(res.total);
    }
  }, [db, inventarioAtual?.id]);


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

    console.log(data);

    try {
      const ativoInventario = {
        inputType: 0,
        latitude,
        longitude,
        accuracy,
        timestamp,
        codigo_ativo: ativo?.codigo_ativo ?? codigo,
        inventario_id: inventarioAtual.id,
        descricao_ativo: ativo?.descricao ?? "",
        comentarios_ativo: data.comentarios ?? ativo?.comentarios ?? "",
        categoria_ativo: ativo?.categoria ?? "",
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

    let codigo: string;
    if (res?.includes("EP:")) {
      codigo = res.replace("EP:", "").trim().replace(/^0+/, "");
    } else {
      return;
    }

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

    if (!ativo) return;

    const ativoInventario: AtivosInventario = {
      inputType: 1,
      latitude,
      longitude,
      accuracy,
      timestamp,
      codigo_ativo: ativo?.codigo_ativo ?? codigo,
      inventario_id: inventarioAtual.id,
      descricao_ativo: ativo?.descricao ?? "",
      comentarios_ativo: ativo?.comentarios ?? "",
      categoria_ativo: ativo?.categoria ?? "",
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

      tagData.current = { epc: "", rssi: "" };

      setQtdAtivos(result.total);
    } catch (err) {}
  };

  const iniciarLeitura = (epc: string) => {
    if (!dispositivoConectado) return;

    setBuscandoAtivo(true);
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
        setRssi(Number(ri));
      }
    }
  };

  return {
    leitura,
    leituraManual,
    qtdAtivos,
    atualizarQtdAtivos,
    rssi,
    setRssi,
    iniciarLeitura,
    teveLeitura,
    buscandoAtivo,
    setBuscandoAtivo,
  };
}
