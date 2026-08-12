import React, {
  createContext,
  RefObject,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import BluetoothClassic, {
  BluetoothDevice,
  BluetoothEventSubscription,
} from "react-native-bluetooth-classic";
import BluetoothModule from "react-native-bluetooth-classic/lib/BluetoothModule";

type BluetoothContextType = {
  ultimo: RefObject<number>;
  tagData: RefObject<{ epc: string; rssi: string }>;
  modoRef: RefObject<number>;
  BluetoothClassic: BluetoothModule;
  resetReading: () => void;
  count: number;
  setCount: React.Dispatch<SetStateAction<number>>;
  queueRef: React.RefObject<string[]>;
  dispositivoConectado: BluetoothDevice | null;
  setDispositivoConectado: React.Dispatch<
    SetStateAction<BluetoothDevice | null>
  >;
  connect: (device: BluetoothDevice) => Promise<void>;
  disconnect: () => Promise<void>;
};

const BluetoothContext = createContext<BluetoothContextType | null>(null);

export default function BluetoothProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dispositivoConectado, setDispositivoConectado] =
    useState<BluetoothDevice | null>(null);

  const queueRef = useRef<string[]>([]);
  const modoRef = useRef<number>(0);
  const tagData = useRef<{ epc: string; rssi: string }>({ epc: "", rssi: "" });

  const [count, setCount] = useState<number>(0);

  const ultimo = useRef(0);

  const subscriptionRef = useRef<BluetoothEventSubscription | null>(null);

  useEffect(() => {
    if (!dispositivoConectado) return;

    const subscription = BluetoothClassic.onDeviceDisconnected((event) => {
      if (event.device.address === dispositivoConectado.address) {
        resetReading();

        subscriptionRef.current?.remove();
        subscriptionRef.current = null;

        setDispositivoConectado(null);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [dispositivoConectado]);

  function resetReading() {
    queueRef.current = [];
    setCount(0);
  }

  async function ensureBluetoothPermissions() {
    if (Platform.OS !== "android") return true;

    const permissions = [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];

    if (Platform.Version >= 31) {
      permissions.push(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      );
    }

    const granted = await PermissionsAndroid.requestMultiple(permissions);

    return Object.values(granted).every(
      (v) => v === PermissionsAndroid.RESULTS.GRANTED,
    );
  }

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
        (event) => {

          if (event.data.includes("EP: ") || event.data.includes("RI:")) {
            queueRef.current.push(event.data);
            setCount((prev) => prev + 1);
          }
        },
      );
    } catch (e) {
      Alert.alert("Erro ao conectar");
    }
  }

  /** Desconectar */
  async function disconnect() {
    if (!dispositivoConectado) return;

    try {
      resetReading();

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
        tagData,
        modoRef,
        connect,
        disconnect,
        dispositivoConectado,
        setDispositivoConectado,
        queueRef,
        count,
        setCount,
        resetReading,
        BluetoothClassic,
        ultimo
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
