import { PermissionsAndroid, Platform } from "react-native";

 export async function ensureBluetoothPermissions() {
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