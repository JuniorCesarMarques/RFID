import { useBluetooth } from "@/contexts/BluetoothContext";
import useLeitura from "@/hooks/leitura";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";

import getIntervalFromRssi from "@/utils/getIntervalFromRssi";
import getStatus from "@/utils/getStatus";
import { playBeep, stopBeep } from "@/utils/beep";
import BarrasSinal from "./BarrasSinal";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Octicons from "@expo/vector-icons/Octicons";
import AlertDesconectado from "./AlertDesconectado";
import useDidUpdate from "@/hooks/useDidUpdate";

export default function BuscaPorAproximacao({ epc }: { epc: string }) {
  const { iniciarLeitura, rssi, setRssi, buscandoAtivo, setBuscandoAtivo } = useLeitura();
  const { count, dispositivoConectado } = useBluetooth();

  const intervalId = useRef<number | null>(null);

  const [intervalo, setIntervalo] = useState<number | null>(null);
  const [mutado, setMutado] = useState<boolean>(true);

  const status = useMemo(() => getStatus(rssi), [rssi]);

  const handleMutado = () => {
    stopBeep();
    setMutado((prev) => !prev);

    if (intervalId.current) {
      clearInterval(intervalId.current);
    }
  };

  useDidUpdate(() => {
      iniciarLeitura(epc);

    const timeoutId = setTimeout(() => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }

      setBuscandoAtivo(false);
      setIntervalo(null);
      setRssi(null);
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [count])

  useEffect(() => {
    if (intervalo && !mutado) {
      intervalId.current = setInterval(playBeep, intervalo);
    }

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [intervalo, mutado]);

  useEffect(() => {
    if (!rssi) return;

    const novoIntervalo = getIntervalFromRssi(rssi);

    if (intervalo !== novoIntervalo) {
      setIntervalo(novoIntervalo);
    }
  }, [rssi]);

  if (!dispositivoConectado) return <AlertDesconectado />;


 return (
  <View style={styles.container}>
    <TouchableOpacity
      onPress={handleMutado}
      activeOpacity={0.8}
      style={styles.soundButton}
    >
      {mutado ? (
        <FontAwesome5 name="volume-mute" size={16} color="#64748B" />
      ) : (
        <Octicons name="unmute" size={16} color="#0F172A" />
      )}
    </TouchableOpacity>

    <Text style={styles.title}>Busca por aproximação</Text>

    <Text style={styles.epc} numberOfLines={1}>
      {epc}
    </Text>

    <View style={styles.signalContainer}>
      <BarrasSinal status={status} />

      <Text
        style={[
          styles.status,
          {
            color: status.color,
          },
        ]}
      >
        {buscandoAtivo && rssi === null ? "Procurando..." : status.label}
      </Text>

      <Text style={styles.rssi}>
        {rssi !== null && `${rssi} RSSI`}
      </Text>
    </View>
    {!buscandoAtivo && <Text>Pressione o botão do leitor para iniciar a leitura</Text>}
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 38,
    paddingVertical: 36,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },

  soundButton: {
    position: "absolute",
    top: 18,
    right: 18,

    width: 36,
    height: 36,
    borderRadius: 999,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#F8FAFC",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },

  epc: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 36,
    maxWidth: 240,
  },

  signalContainer: {
    alignItems: "center",
    gap: 18,
  },

  status: {
    fontSize: 20,
    fontWeight: "700",
  },

  rssi: {
    fontSize: 14,
    color: "#64748B",
  },
});