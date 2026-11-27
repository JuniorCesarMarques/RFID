import { ensureBluetoothPermissions } from "@/utils/bluetoothPermissions";
import React, {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Alert } from "react-native";
import BluetoothClassic, {
  BluetoothDevice,
  BluetoothDeviceReadEvent,
  BluetoothEventSubscription,
} from "react-native-bluetooth-classic";
import BluetoothModule from "react-native-bluetooth-classic/lib/BluetoothModule";

type BluetoothContextType = {
  BluetoothClassic: BluetoothModule;
  dispositivoConectado: BluetoothDevice | null;
  setDispositivoConectado: React.Dispatch<
    SetStateAction<BluetoothDevice | null>
  >;
  connect: (device: BluetoothDevice) => Promise<void>;
  disconnect: () => Promise<void>;
  registerOnRead: (callback: (event: BluetoothDeviceReadEvent) => void) => void;
  registerOnDisconnected: (callback: () => void) => void;
};

const BluetoothContext = createContext<BluetoothContextType | null>(null);

export default function BluetoothProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [dispositivoConectado, setDispositivoConectado] =
    useState<BluetoothDevice | null>(null);

    // função de leitura
  const onReadRef = useRef<(event: BluetoothDeviceReadEvent) => void>(
    () => {},
  );

  const onDisconnectedRef =
  useRef<(() => void)>(() => {});

  const subscriptionRef = useRef<BluetoothEventSubscription | null>(null);

  const registerOnRead = (fun: (event: BluetoothDeviceReadEvent) => void) => {
    onReadRef.current = fun;
  };

  const registerOnDisconnected = (callback: () => void) => {
    onDisconnectedRef.current = callback;
  }

  useEffect(() => {
    if (!dispositivoConectado) return;

    const subscription = BluetoothClassic.onDeviceDisconnected((event) => {
      if (event.device.address === dispositivoConectado.address) {
        onDisconnectedRef.current();

        subscriptionRef.current?.remove();
        subscriptionRef.current = null;

        setDispositivoConectado(null);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [dispositivoConectado]);



  async function connect(device: BluetoothDevice) {
    const ok = await ensureBluetoothPermissions();

    if (!ok) {
      Alert.alert("Permissões de Bluetooth não concedidas");
      return;
    }

    try {
      const connected = await BluetoothClassic.connectToDevice(device.address);
      setDispositivoConectado(connected);

      subscriptionRef.current?.remove();

      subscriptionRef.current = BluetoothClassic.onDeviceRead(
        connected.address,
        onReadRef.current,
      );
    } catch (e) {
      Alert.alert("Erro ao conectar");
    }
  }

  /** Remover resetReading e colocar callback */
  async function disconnect() {
    if (!dispositivoConectado) return;

    try {
      onDisconnectedRef.current();

      subscriptionRef.current?.remove();
      subscriptionRef.current = null;

      await BluetoothClassic.disconnectFromDevice(dispositivoConectado.address);

      setDispositivoConectado(null);
    } catch (e) {
      Alert.alert("Erro ao desconectar");
    }
  }

  return (
    <BluetoothContext.Provider
      value={{
        connect,
        disconnect,
        dispositivoConectado,
        setDispositivoConectado,
        BluetoothClassic,
        registerOnRead,
        registerOnDisconnected
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
}

export const useBluetooth = () => {
  const context = useContext(BluetoothContext);

  if (!context)
    throw new Error(
      "useBluetooth deve ser usado dentro de um BluetoothProvider",
    );

  return context;
};
