import React, { useEffect, useState } from "react";
import {
  Alert,
  Permission,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BluetoothDevice } from "react-native-bluetooth-classic";

import { useBluetooth } from "@/contexts/BluetoothContext";
import { PermissionsAndroid, Platform } from "react-native";

export default function BluetoothScreen() {
  const [paired, setPaired] = useState<BluetoothDevice[]>([]);

  const {
    connect,
    disconnect,
    dispositivoConectado,
    setDispositivoConectado,
    BluetoothClassic,
  } = useBluetooth();

  const [connecting, setConnecting] = useState(false);
  const [connectingTo, setConnectingTo] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  async function requestBluetoothPermissions() {
    if (Platform.OS !== "android") return true;

    try {
      const permissions: Permission[] = [];

      if (Platform.Version >= 31) {
        permissions.push(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        );
      }

      const granted = await PermissionsAndroid.requestMultiple(permissions);

      const allGranted = Object.values(granted).every(
        (result) => result === PermissionsAndroid.RESULTS.GRANTED,
      );

      return allGranted;
    } catch (e) {
      Alert.alert("Erro ao pedir permissões");
      return false;
    }
  }

  /** Carrega dispositivos pareados */
  async function loadPaired() {
    try {

      const devices = await BluetoothClassic.getBondedDevices();

      setPaired(devices);
    } catch (e) {
      // Caso desconcte o bluetooth
      setDispositivoConectado(null);
    }
  }

  /** Carrega pareados ao montar */
  useEffect(() => {
    (async () => {
      const ok = await requestBluetoothPermissions();
      if (ok) {
        loadPaired();
      } else {
        console.log("Permissões não concedidas");
      }
    })();
  }, []);



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dispositivos </Text>

      {connectionError && (
        <Text style={styles.errorText}>{connectionError}</Text>
      )}

      <ScrollView style={{ maxHeight: 220 }}>
        {paired.map((device) => {
          const isThisConnecting = connectingTo === device.address;
          const isConnected = dispositivoConectado?.address === device.address;

          return (
            <TouchableOpacity
              key={device.address}
              style={[styles.device, isConnected && styles.deviceConnected]}
              disabled={connecting}
              onPress={async () => {
                setConnectionError(null);
                setConnecting(true);
                setConnectingTo(device.address);

                try {
                  await connect(device);
                } catch {
                  setConnectionError(
                    "Não foi possível conectar ao dispositivo selecionado.",
                  );
                } finally {
                  setConnecting(false);
                  setConnectingTo(null);
                }
              }}
            >
              <Text style={styles.deviceName}>
                {device.name ?? "Dispositivo sem nome"}
              </Text>

              <Text style={styles.deviceAddress}>{device.address}</Text>

              {isThisConnecting && (
                <Text style={styles.statusConnecting}>Conectando…</Text>
              )}

              {isConnected && (
                <Text style={styles.statusConnected}>Conectado</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {dispositivoConectado && (
        <View style={styles.connectedBox}>
          <Text style={styles.subtitle}>Conectado a</Text>

          <Text style={styles.connectedName}>
            {dispositivoConectado.name ?? "Sem nome"}
          </Text>

          <TouchableOpacity
            style={styles.disconnectBtn}
            onPress={async () => {
              setConnectionError(null);
              try {
                await disconnect();
              } catch {
                setConnectionError("Erro ao desconectar do dispositivo.");
              }
            }}
          >
            <Text style={styles.disconnectText}>Desconectar</Text>
          </TouchableOpacity>

          <Text style={styles.hintText}>
            A leitura ficará pausada até uma nova conexão.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },

  subtitle: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "600",
  },

  /* LISTA DE DISPOSITIVOS */
  device: {
    padding: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  deviceConnected: {
    backgroundColor: "#dcfce7",
    borderColor: "#16a34a",
  },

  deviceName: {
    fontSize: 15,
    fontWeight: "600",
  },

  deviceAddress: {
    fontSize: 13,
    opacity: 0.6,
  },

  statusConnecting: {
    marginTop: 6,
    fontSize: 13,
    color: "#2563eb",
    fontWeight: "500",
  },

  statusConnected: {
    marginTop: 6,
    fontSize: 13,
    color: "#16a34a",
    fontWeight: "600",
  },

  /* ERRO */
  errorText: {
    color: "#dc2626",
    marginBottom: 10,
    fontSize: 14,
  },

  /* CONECTADO */
  connectedBox: {
    marginTop: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
  },

  connectedName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 6,
  },

  hintText: {
    marginTop: 12,
    fontSize: 13,
    opacity: 0.6,
  },

  disconnectBtn: {
    marginTop: 12,
    backgroundColor: "#dc2626",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
    width: 150,
  },

  disconnectText: {
    color: "#fff",
    fontWeight: "600",
  },
});
